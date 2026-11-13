import type { Metadata } from 'next';
import { Volunteers } from './volunteers';
export const metadata: Metadata = {
  title: 'Espace bénévoles', description: 'Participez aux lotos de l’EDR Nord Toulousain.',
  icons: { apple: '/benevoles/icon-192.png' },
  manifest: '/benevoles/manifest.webmanifest', alternates: { canonical: '/benevoles' },
};
export default function VolunteersPage() { return <Volunteers />; }
