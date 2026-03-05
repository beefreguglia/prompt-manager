import type { PromptSummary } from '@/core/domain/prompts/prompt.entity';
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompt.repository';
import { prisma } from '@/lib/prisma';
import { SidebarContent } from './sidebar-content';

export async function Sidebar() {
  const repository = new PrismaPromptRepository(prisma);
  let initialPrompts: PromptSummary[] = [];

  try {
    const prompts = await repository.findMany();

    initialPrompts = prompts.map(({ id, title, content }) => ({
      id,
      title,
      content,
    }));
  } catch {
    initialPrompts = [];
  }

  return <SidebarContent prompts={initialPrompts} />;
}
