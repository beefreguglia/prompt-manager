import type { Prompt } from '@/core/domain/prompts/prompt.entity';

export interface PromptRepository {
  findMany(): Promise<Prompt[]>;
  searchMany(term: string): Promise<Prompt[]>;
}
