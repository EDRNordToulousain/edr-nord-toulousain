begin;
-- Missing capacities are genuinely unknown, not made-up limits or unlimited.
alter table public.volunteer_slots alter column capacity drop not null;
alter table public.volunteer_slots add constraint volunteer_unknown_capacity check(capacity is not null or (reserved=0 and enabled=false));
with missions(code,title,capacity) as (values
 ('installation','Installation des tables, chaises et de la buvette',null::integer),
 ('encaissement','Encaissement',4),
 ('buvette','Tenue de la buvette',null::integer),
 ('controle-cartons','Contrôle des cartons',2),
 ('annonce-numeros','Annonce des numéros',1),
 ('distribution-numeros','Distribution des numéros',1),
 ('rangement-tables','Rangement des tables et chaises',null::integer),
 ('balayage','Balayage',null::integer),
 ('rangement-buvette','Rangement de la buvette',null::integer)
)
insert into public.volunteer_slots(id,event_id,title,capacity,reserved,enabled)
select e.id||'-'||m.code,e.id,m.title,m.capacity,
 case when e.id='lespinasse-2026' and m.code='encaissement' then 1 else 0 end,false
from public.volunteer_events e cross join missions m
-- Never overwrite administrator edits, pre-existing capacities or reservations.
on conflict(id) do nothing;

-- Closed and unconfigured missions must still be visible for page review.
create or replace function public.volunteer_counts() returns table(id text,event_id text,title text,capacity integer,registered bigint)
language sql security invoker set search_path=public as $$
 select s.id,s.event_id,s.title,s.capacity,s.reserved+count(a.person_id)
 from volunteer_slots s left join volunteer_assignments a on a.slot_id=s.id
 group by s.id order by s.event_id,s.id
$$;
commit;
