import { searchPromptAction } from '@/app/actions/prompt.actions';

jest.mock('@/lib/prisma', () => ({ prisma: {} }));

const mokedSearchExecute = jest.fn();

jest.mock('@/core/application/prompts/search-prompts.use-case', () => ({
  SearchPromptsUseCase: jest.fn().mockImplementation(() => ({
    execute: mokedSearchExecute,
  })),
}));

describe('Server Actions: Prompts', () => {
  beforeEach(() => {
    mokedSearchExecute.mockReset();
  });

  describe('searchPromptAction', () => {
    it('should be able to return success with no empty term', async () => {
      const input = [{ id: '1', title: 'AI title', content: 'Content' }];
      mokedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('q', 'AI');

      const result = await searchPromptAction({ success: true }, formData);
      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });

    it('should be able to return all prompts with empty term', async () => {
      const input = [
        { id: '1', title: 'First', content: 'Content 01' },
        { id: '2', title: 'Second', content: 'Content 02' },
      ];
      mokedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('q', '');

      const result = await searchPromptAction({ success: true }, formData);

      expect(result.success).toBeDefined();
      expect(result.prompts).toEqual(input);
    });

    it('should be able to return a generic error when the search fails', async () => {
      const error = new Error('UNKNOWN');

      mokedSearchExecute.mockRejectedValue(error);

      const formData = new FormData();
      formData.append('q', 'error');

      const result = await searchPromptAction({ success: true }, formData);

      expect(result.success).toBe(false);
      expect(result.prompts).toBe(undefined);
      expect(result.message).toBe('Falha ao buscar prompts.');
    });

    it('should be able to trim spaces before executing', async () => {
      const input = [{ id: '1', title: 'First', content: 'Content 01' }];

      mokedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('q', '   first   ');

      const result = await searchPromptAction({ success: true }, formData);

      expect(mokedSearchExecute).toHaveBeenCalledWith('first');
      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });

    it('should be able to handle the absence of query as an empty string', async () => {
      const input = [
        { id: '1', title: 'First', content: 'Content 01' },
        { id: '2', title: 'Second', content: 'Content 02' },
      ];

      mokedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();

      const result = await searchPromptAction({ success: true }, formData);

      expect(mokedSearchExecute).toHaveBeenCalledWith('');
      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });
  });
});
