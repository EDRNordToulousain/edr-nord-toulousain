import type { Metadata } from 'next';
import { PwaRegistration } from './pwa-registration';

export const metadata: Metadata = {
  other: { 'edr-volunteers-release': process.env.VERCEL_GIT_COMMIT_SHA || 'local' },
  icons: { apple: '/benevoles/icon-192.png' },
  manifest: '/benevoles/manifest.webmanifest',
};

export default function VolunteersLayout({ children }: { children: React.ReactNode }) {
  return <>
    <PwaRegistration />
    {children}
    <aside className="mx-auto mb-16 max-w-6xl px-4">
      <h2 className="rounded-2xl border border-blue/20 p-6 font-black text-night">L’espace bénévoles à portée de main</h2>
    </aside>
  </>;
}
