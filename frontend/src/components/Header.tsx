import Link from 'next/link';

export default function Header() {
  return (
    <header className="header bg-primary p-6 flex flex-col items-center gap-3 text-primary-foreground">
      <h1 className="text-xl font-semibold">Checkpoint : frontend</h1>
      <Link href="/">Countries</Link>
    </header>
  );
}
