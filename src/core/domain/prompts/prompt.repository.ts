import type { CreatePromptDTO } from '@/core/application/prompts/create-prompt.dto';
import type { Prompt } from '@/core/domain/prompts/prompt.entity';

export interface PromptRepository {
  create(data: CreatePromptDTO): Promise<void>;
  findMany(): Promise<Prompt[]>;
  findByTitle(title: string): Promise<Prompt | null>;
  searchMany(term: string): Promise<Prompt[]>;
}
