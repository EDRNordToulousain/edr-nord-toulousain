begin;
create table public.volunteer_events (id text primary key, event_date date not null);
create table public.volunteer_slots (
 id text primary key, event_id text not null references public.volunteer_events, title text not null,
 capacity integer not null check(capacity>0), reserved integer not null default 0 check(reserved>=0 and reserved<=capacity),
 enabled boolean not null default false
);
create table public.volunteer_people (
 id uuid primary key default gen_random_uuid(), event_id text not null references public.volunteer_events,
 email text not null, first_name text not null, last_name text not null, category text not null check(category in ('Baby','U6','U8','U10','U12','U14')),
 created_at timestamptz not null default now(), unique(event_id,email)
);
create table public.volunteer_assignments (
 person_id uuid not null references public.volunteer_people on delete cascade,
 slot_id text not null references public.volunteer_slots, primary key(person_id,slot_id)
);
create table public.volunteer_rate (bucket text primary key, window_start timestamptz not null, attempts integer not null);
create table public.volunteer_mail (
 id uuid primary key default gen_random_uuid(), person_id uuid not null references public.volunteer_people on delete cascade,
 kind text not null check(kind in ('confirmation','admin','reminder')),
 payload jsonb not null, status text not null default 'pending' check(status in ('pending','sending','sent','manual')),
 attempts integer not null default 0, first_attempt timestamptz, next_attempt timestamptz not null default now(),
 lease uuid, lease_until timestamptz, created_at timestamptz not null default now()
);
create unique index volunteer_one_reminder on public.volunteer_mail(person_id) where kind='reminder';
create index volunteer_pending_mail on public.volunteer_mail(status,next_attempt);
-- Nothing in these tables is readable through anonymous/authenticated REST access.
alter table public.volunteer_events enable row level security;
alter table public.volunteer_slots enable row level security;
alter table public.volunteer_people enable row level security;
alter table public.volunteer_assignments enable row level security;
alter table public.volunteer_rate enable row level security;
alter table public.volunteer_mail enable row level security;
revoke all on public.volunteer_events, public.volunteer_slots, public.volunteer_people, public.volunteer_assignments, public.volunteer_rate, public.volunteer_mail from anon, authenticated;
grant all on public.volunteer_events, public.volunteer_slots, public.volunteer_people, public.volunteer_assignments, public.volunteer_rate, public.volunteer_mail to service_role;

insert into public.volunteer_events values ('lespinasse-2026','2026-11-21'),('bruguieres-2027','2027-01-24'),('saint-jory-2027','2027-03-20');
-- Only the capacity explicitly supplied by the EDR is seeded. Keep disabled
-- until the validated common mission list and capacities have been supplied.
insert into public.volunteer_slots(id,event_id,title,capacity,reserved) values ('lespinasse-2026-encaissement','lespinasse-2026','Encaissement',4,1);

create function public.volunteer_counts() returns table(id text,event_id text,title text,capacity integer,registered bigint)
language sql security invoker set search_path=public as $$
 select s.id,s.event_id,s.title,s.capacity,s.reserved+count(a.person_id)
 from volunteer_slots s left join volunteer_assignments a on a.slot_id=s.id
 where s.enabled group by s.id order by s.event_id,s.id
$$;

create function public.volunteer_register(p_first text,p_last text,p_email text,p_category text,p_slots text[],p_bucket text)
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
   if s.reserved+(select count(*) from volunteer_assignments where slot_id=s.id)>=s.capacity then return false; end if;
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

create function public.volunteer_queue_reminders() returns void language sql security invoker set search_path=public as $$
 insert into volunteer_mail(person_id,kind,payload)
 select p.id,'reminder',jsonb_build_object('event_id',p.event_id,'missions',jsonb_agg(s.title order by s.id))
 from volunteer_people p join volunteer_events e on e.id=p.event_id
 join volunteer_assignments a on a.person_id=p.id join volunteer_slots s on s.id=a.slot_id
 where e.event_date=(now() at time zone 'Europe/Paris')::date+1
 group by p.id on conflict(person_id) where kind='reminder' do nothing
$$;

create function public.volunteer_claim_mail() returns table(id uuid,kind text,email text,first_name text,last_name text,category text,event_id text,missions jsonb,lease uuid)
language plpgsql security invoker set search_path=public as $$
begin
 -- Resend idempotency expires after 24h: ambiguous deliveries older than 23h
 -- require admin inspection rather than risk a duplicate email.
 update volunteer_mail m set status='manual' where m.status in ('pending','sending') and m.first_attempt < now()-interval '23 hours';
 -- Never send a reminder on or after the event day.
 update volunteer_mail m set status='manual' from volunteer_people p join volunteer_events e on e.id=p.event_id
 where m.person_id=p.id and m.kind='reminder' and m.status in ('pending','sending') and e.event_date <= (now() at time zone 'Europe/Paris')::date;
 return query
 with selected as (
 select m.id from volunteer_mail m where (m.status='pending' and m.next_attempt<=now()) or (m.status='sending' and m.lease_until<now())
 order by m.created_at for update skip locked limit 3
 ), claimed as (
 update volunteer_mail m set status='sending',lease=gen_random_uuid(),lease_until=now()+interval '5 minutes',attempts=m.attempts+1,first_attempt=coalesce(m.first_attempt,now())
 from selected where m.id=selected.id returning m.*
 ) select m.id,m.kind,p.email,p.first_name,p.last_name,p.category,m.payload->>'event_id',m.payload->'missions',m.lease
 from claimed m join volunteer_people p on p.id=m.person_id;
end $$;
create function public.volunteer_finish_mail(p_id uuid,p_lease uuid,p_success boolean) returns void language sql security invoker set search_path=public as $$
 update volunteer_mail set status=case when p_success then 'sent' else 'pending' end,
 next_attempt=now()+interval '5 minutes',lease_until=null
 where id=p_id and lease=p_lease and status='sending'
$$;
-- Functions are server-only too. Explicit grants override PostgreSQL's default PUBLIC execute.
revoke all on function public.volunteer_counts(), public.volunteer_register(text,text,text,text,text[],text), public.volunteer_queue_reminders(), public.volunteer_claim_mail(), public.volunteer_finish_mail(uuid,uuid,boolean) from public,anon,authenticated;
grant execute on function public.volunteer_counts(), public.volunteer_register(text,text,text,text,text[],text), public.volunteer_queue_reminders(), public.volunteer_claim_mail(), public.volunteer_finish_mail(uuid,uuid,boolean) to service_role;
commit;
