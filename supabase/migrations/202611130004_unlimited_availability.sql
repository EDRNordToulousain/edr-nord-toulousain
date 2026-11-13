begin;
-- The initial seed closed all missions pending confirmation. The four confirmed
-- unlimited missions must now be selectable together; NULL is not a full quota.
-- Preserve finite mission closures, capacities, reservations and registrations.
update public.volunteer_slots s set enabled=true
from public.volunteer_events e
where s.event_id=e.id
 and e.id in ('lespinasse-2026','bruguieres-2027','saint-jory-2027')
 and s.id in (e.id||'-installation',e.id||'-rangement-tables',e.id||'-balayage',e.id||'-rangement-buvette')
 and s.capacity is null;

-- No capacity, reservation, registration, secret or service configuration is changed.
commit;
