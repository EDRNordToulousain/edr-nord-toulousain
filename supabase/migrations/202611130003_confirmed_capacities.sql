begin;
-- All remaining capacities are now confirmed. NULL means deliberately unlimited.
alter table public.volunteer_slots drop constraint if exists volunteer_unknown_capacity;
with limits(code,capacity) as (values
 ('installation',null::integer),('encaissement',4),('buvette',3),
 ('controle-cartons',2),('annonce-numeros',1),('distribution-numeros',1),
 ('rangement-tables',null::integer),('balayage',null::integer),('rangement-buvette',null::integer)
)
update public.volunteer_slots s set capacity=l.capacity
from public.volunteer_events e cross join limits l
where s.event_id=e.id and s.id=e.id||'-'||l.code;
-- Do not touch reserved, enabled, people, assignments or queued mail.
-- In particular, do not duplicate the administrator's existing reservation.

create or replace function public.volunteer_register(p_first text,p_last text,p_email text,p_category text,p_slots text[],p_bucket text)
returns boolean language plpgsql security invoker set search_path=public as $$
declare s record; ev record; person uuid; payload jsonb; n integer;
begin
 if p_first is null or length(p_first) not between 1 and 80 or p_last is null or length(p_last) not between 1 and 80
 or p_email is null or length(p_email)>254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
 or p_category is null or p_category not in ('Baby','U6','U8','U10','U12','U14')
 or p_slots is null or cardinality(p_slots) not between 1 and 30 or p_bucket is null then return false; end if;
 -- Both IP and address budgets are persistent and cannot be bypassed by a restart.
 delete from volunteer_rate where window_start < now()-interval '1 day';
 foreach p_bucket in array array[p_bucket, 'email:'||md5(lower(p_email))] loop
   insert into volunteer_rate values(p_bucket,now(),1)
   on conflict(bucket) do update set
   attempts=case when volunteer_rate.window_start < now()-interval '1 hour' then 1 else volunteer_rate.attempts+1 end,
   window_start=case when volunteer_rate.window_start < now()-interval '1 hour' then now() else volunteer_rate.window_start end
   returning attempts into n;
   if n>10 then return false; end if;
 end loop;
 if (select count(distinct v) from unnest(p_slots) v) <> cardinality(p_slots) then return false; end if;
 -- Sorted locks serialize concurrent signups for the last place and avoid deadlocks.
 perform 1 from volunteer_slots where id=any(p_slots) order by id for update;
 if (select count(*) from volunteer_slots where id=any(p_slots) and enabled)<>cardinality(p_slots) then return false; end if;
 for s in select * from volunteer_slots where id=any(p_slots) loop
   if (select event_date from volunteer_events where id=s.event_id) < (now() at time zone 'Europe/Paris')::date then return false; end if;
   if s.capacity is not null and s.reserved+(select count(*) from volunteer_assignments where slot_id=s.id)>=s.capacity then return false; end if;
   if exists(select 1 from volunteer_assignments a join volunteer_people p on p.id=a.person_id where a.slot_id=s.id and p.email=lower(p_email)) then return false; end if;
 end loop;
 for ev in select distinct event_id from volunteer_slots where id=any(p_slots) order by event_id loop
   -- Do not overwrite an existing person's identity from an unauthenticated form.
   insert into volunteer_people(event_id,email,first_name,last_name,category) values(ev.event_id,lower(p_email),p_first,p_last,p_category)
   on conflict(event_id,email) do nothing;
   select id into person from volunteer_people where event_id=ev.event_id and email=lower(p_email) for update;
   insert into volunteer_assignments select person,id from volunteer_slots where event_id=ev.event_id and id=any(p_slots);
   select jsonb_build_object('event_id',ev.event_id,'missions',jsonb_agg(title order by id)) into payload
   from volunteer_slots where event_id=ev.event_id and id=any(p_slots);
   insert into volunteer_mail(person_id,kind,payload) values(person,'confirmation',payload),(person,'admin',payload);
 end loop;
 return true;
end $$;


commit;
