import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { volunteerEvents } from '@/lib/volunteers/events';
import { Volunteers } from '../volunteers';

type Props = { params: Promise<{ eventId: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return volunteerEvents.map(event => ({ eventId: event.id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventId } = await params;
  const event = volunteerEvents.find(event => event.id === eventId);
  if (!event) notFound();
  return {
    title: `Bénévoles — ${event.title}`,
    description: `Choisissez vos missions pour ${event.title}, ${event.label}, ${event.venue}.`,
    alternates: { canonical: `/benevoles/${event.id}` },
  };
}
export default async function VolunteerEventPage({ params }: Props) {
  const { eventId } = await params;
  const event = volunteerEvents.find(event => event.id === eventId);
  if (!event) notFound();
  // A fresh form for each event: no selected missions or personal fields carry over.
  return <Volunteers key={event.id} event={event} />;
}
