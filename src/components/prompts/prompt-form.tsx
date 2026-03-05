'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createPromptAction } from '@/app/actions/prompt.actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  type CreatePromptDTO,
  createPromptSchema,
} from '@/core/application/prompts/create-prompt.dto';
import { CopyButton } from '../button-actions';

export function PromptForm() {
  const router = useRouter();
  const form = useForm<CreatePromptDTO>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });
  const content = form.watch('content');

  async function submit(data: CreatePromptDTO) {
    const result = await createPromptAction(data);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
        <header className="mb-6 flex flex-wrap items-center justify-end gap-2">
          <CopyButton content={content} />
          <Button type="submit" size="sm">
            Salvar
          </Button>
        </header>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Título do prompt"
                  variant="transparent"
                  size="lg"
                  autoFocus
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Digite o conteúdo do prompt..."
                  variant="transparent"
                  size="lg"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
