import { MessageSquare } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-lg transition-colors hover:text-accent-600"
    >
      <MessageSquare />
      <span className="font-semibold text-lg">PROMPTS</span>
    </Link>
  );
}
