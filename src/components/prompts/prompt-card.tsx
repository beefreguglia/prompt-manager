import Link from 'next/link';
import type { PromptSummary } from '@/core/domain/prompts/prompt.entity';

interface PromptCardProps {
  prompt: PromptSummary;
}

export function PromptCard({ prompt }: PromptCardProps) {
  return (
    <li className="group relative rounded-lg bg-gray-700 p-3 transition-all duration-200">
      <header className="flex items-start justify-between">
        <Link href={`/${prompt.id}`} prefetch className="min-w-0 flex-1">
          <h3 className="font-medium text-sm text-white transition-colors group-hover:text-accent-300">
            {prompt.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-gray-400 text-xs">
            {prompt.content}
          </p>
        </Link>
      </header>
    </li>
  );
}
