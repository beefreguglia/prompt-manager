import { SearchPromptsUseCase } from '@/core/application/prompts/search-prompts.use-case';
import type { Prompt } from '@/core/domain/prompts/prompt.entity';
import type { PromptRepository } from '@/core/domain/prompts/prompt.repository';

describe('SearchPromptUseCase', () => {
  const input: Prompt[] = [
    {
      id: '1',
      title: 'Title 01',
      content: 'Content 01',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Title 02',
      content: 'Content 02',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const makeRepository = (overrides: Partial<PromptRepository>) => {
    const base = {
      findMany: async () => input,
      searchMany: async (term: string) =>
        input.filter(
          (prompt) =>
            prompt.title
              .toLocaleLowerCase()
              .includes(term.toLocaleLowerCase()) ||
            prompt.content.toLocaleLowerCase().includes(term.toLowerCase())
        ),
    };

    return { ...base, ...overrides } as PromptRepository;
  };

  it('should be able to return success with no empty term', async () => {
    const repository = makeRepository({});
    const useCase = new SearchPromptsUseCase(repository);
    const results = await useCase.execute('');

    expect(results).toHaveLength(2);
  });

  it('should be able to filter prompts list by search term', async () => {
    const repository = makeRepository({});

    const useCase = new SearchPromptsUseCase(repository);
    const term = 'Title 01';
    const results = await useCase.execute(term);

    expect(results).toHaveLength(1);
    expect(results[0].id === '1');
    expect(results[0].title === term);
  });

  it('should be able possible to apply trim to searches with whitespace and return all prompts list', async () => {
    const repository = makeRepository({
      findMany: jest.fn().mockResolvedValue(input),
      searchMany: jest.fn().mockResolvedValue([]),
    });

    const useCase = new SearchPromptsUseCase(repository);
    const results = await useCase.execute('     ');

    expect(results).toHaveLength(2);
    expect(repository.findMany).toHaveBeenCalledTimes(1);
    expect(repository.searchMany).not.toHaveBeenCalled();
  });

  it('should be able to search for terms with spaces, whith trim', async () => {
    const firstElement = input.slice(0, 1);
    const repository = makeRepository({
      findMany: jest.fn().mockResolvedValue(input),
      searchMany: jest.fn().mockResolvedValue(firstElement),
    });

    const useCase = new SearchPromptsUseCase(repository);
    const query = '  title 2  ';
    const results = await useCase.execute(query);

    expect(results).toMatchObject(firstElement);
    expect(repository.searchMany).toHaveBeenCalledWith(query.trim());
    expect(repository.findMany).not.toHaveBeenCalled();
  });

  it('should be able to return all prompt list when term is undefiner or null', async () => {
    const repository = makeRepository({
      findMany: jest.fn().mockResolvedValue(input),
      searchMany: jest.fn().mockResolvedValue([]),
    });

    const useCase = new SearchPromptsUseCase(repository);
    const query = undefined as unknown as string;
    const results = await useCase.execute(query);

    expect(results).toMatchObject(input);
    expect(repository.findMany).toHaveBeenCalled();
    expect(repository.searchMany).not.toHaveBeenCalled();
  });
});
