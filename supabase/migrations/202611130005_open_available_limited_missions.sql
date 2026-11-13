begin;
-- Open confirmed finite missions only when a place is still available.
-- Keep the reserved Lespinasse encaissement place and all assignments intact.
update public.volunteer_slots s
set enabled = true
from public.volunteer_events e
where s.event_id = e.id
  and e.id in ('lespinasse-2026', 'bruguieres-2027', 'saint-jory-2027')
  and s.capacity is not null
  and s.reserved + (
    select count(*)
    from public.volunteer_assignments a
    where a.slot_id = s.id
  ) < s.capacity;

-- No reservation, registration, capacity, email, or service setting is changed.
commit;
