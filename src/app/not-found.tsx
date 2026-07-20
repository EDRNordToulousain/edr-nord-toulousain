import { Button, Container } from "@/components/UI";

export default function NotFound() {
  return <section className="field-lines relative grid min-h-[65vh] place-items-center overflow-hidden bg-night py-20 text-center text-white"><Container className="relative"><p className="text-8xl font-black text-coral">404</p><h1 className="mt-4 text-4xl font-black">Le ballon est sorti du terrain</h1><p className="mx-auto mt-4 max-w-xl text-lg text-white/70">La page recherchée n’existe pas ou a été déplacée.</p><div className="mt-8"><Button href="/" variant="light">Retour à l’accueil</Button></div></Container></section>;
}
