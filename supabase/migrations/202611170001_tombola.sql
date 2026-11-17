begin;

insert into public.volunteer_events(id, event_date)
values ('tombola-2026-2027', '2026-12-03')
on conflict(id) do nothing;

insert into public.volunteer_slots(id, event_id, title, capacity, reserved, enabled)
values
  ('tombola-2026-2027-prospection-lots', 'tombola-2026-2027', 'Recherche et prospection de lots', null, 0, true),
  ('tombola-2026-2027-collecte-lots', 'tombola-2026-2027', 'Collecte des lots', 2, 0, true)
on conflict(id) do nothing;

commit;
