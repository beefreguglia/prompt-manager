'use client';

import { Trash as DeleteIcon, Loader2 as LoadingIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { PromptSummary } from '@/core/domain/prompts/prompt.entity';

export type PromptCardProps = {
  prompt: PromptSummary;
};

export function PromptCard({ prompt }: PromptCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    toast.success('Prompt removido com sucesso');
  }

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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="icon"
              size="icon"
              title="Remover Prompt"
              aria-label="Remover Prompt"
            >
              <DeleteIcon className="h-3 w-3" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover Prompt</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover este prompt? Esta ação não pode
                ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting && (
                  <LoadingIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirmar remoção
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>
    </li>
  );
}
