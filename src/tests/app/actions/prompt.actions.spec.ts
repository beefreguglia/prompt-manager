import { revalidatePath } from 'next/cache';
import { unknown } from 'zod/v3';
import {
  createPromptAction,
  deletePromptAction,
  searchPromptAction,
  updatePromptAction,
} from '@/app/actions/prompt.actions';

jest.mock('@/lib/prisma', () => ({ prisma: {} }));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

const mockedSearchExecute = jest.fn();
const mockedCreateExecute = jest.fn();
const mockedUpdateExecute = jest.fn();
const mockedDeleteExecute = jest.fn();

jest.mock('@/core/application/prompts/search-prompts.use-case', () => ({
  SearchPromptsUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedSearchExecute,
  })),
}));

jest.mock('@/core/application/prompts/create-prompt.use-case', () => ({
  CreatePromptUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedCreateExecute,
  })),
}));

jest.mock('@/core/application/prompts/update-prompt.use-case', () => ({
  UpdatePromptUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedUpdateExecute,
  })),
}));

jest.mock('@/core/application/prompts/delete-prompt.use-case', () => ({
  DeletePromptUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedDeleteExecute,
  })),
}));

describe('Server Actions: Prompts', () => {
  beforeEach(() => {
    mockedSearchExecute.mockReset();
    mockedCreateExecute.mockReset();
    mockedUpdateExecute.mockReset();
    mockedDeleteExecute.mockReset();
    (revalidatePath as jest.Mock).mockReset();
  });

  describe('createPromptAction', () => {
    it('should be able to create a prompt', async () => {
      mockedCreateExecute.mockResolvedValue(undefined);
      const data = { title: 'Title', content: 'Content' };
      const result = await createPromptAction(data);

      expect(result?.success).toBe(true);
      expect(result?.message).toBe('Prompt criado com sucesso');
      expect(revalidatePath as jest.Mock).toHaveBeenCalledTimes(1);
    });

    it('should be able to return validation error when form fields empty', async () => {
      const data = {
        title: '',
        content: '',
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Erro de validação');
      expect(result?.errors).toBeDefined();
    });

    it('should be able to return PROMPT_ALREADY_EXISTS error when when happen', async () => {
      mockedCreateExecute.mockRejectedValue(new Error('PROMPT_ALREADY_EXISTS'));
      const data = {
        title: 'duplicado',
        content: 'duplicado',
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Este prompt já existe');
    });

    it('should be able to return a generic error when create action fails', async () => {
      mockedCreateExecute.mockRejectedValue(unknown);
      const data = { title: 'title', content: 'content' };

      const result = await createPromptAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Falha ao criar o prompt');
    });
  });

  describe('searchPromptAction', () => {
    it('should be able to return success with no empty term', async () => {
      const input = [{ id: '1', title: 'AI title', content: 'Content' }];
      mockedSearchExecute.mockResolvedValue(input);

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
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('q', '');

      const result = await searchPromptAction({ success: true }, formData);

      expect(result.success).toBeDefined();
      expect(result.prompts).toEqual(input);
    });

    it('should be able to return a generic error when the search fails', async () => {
      const error = new Error('UNKNOWN');

      mockedSearchExecute.mockRejectedValue(error);

      const formData = new FormData();
      formData.append('q', 'error');

      const result = await searchPromptAction({ success: true }, formData);

      expect(result.success).toBe(false);
      expect(result.prompts).toBe(undefined);
      expect(result.message).toBe('Falha ao buscar prompts.');
    });

    it('should be able to trim spaces before executing', async () => {
      const input = [{ id: '1', title: 'First', content: 'Content 01' }];

      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('q', '   first   ');

      const result = await searchPromptAction({ success: true }, formData);

      expect(mockedSearchExecute).toHaveBeenCalledWith('first');
      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });

    it('should be able to handle the absence of query as an empty string', async () => {
      const input = [
        { id: '1', title: 'First', content: 'Content 01' },
        { id: '2', title: 'Second', content: 'Content 02' },
      ];

      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();

      const result = await searchPromptAction({ success: true }, formData);

      expect(mockedSearchExecute).toHaveBeenCalledWith('');
      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });
  });

  describe('updatePromptAction', () => {
    it('should be able to update a prompt successfuly', async () => {
      mockedUpdateExecute.mockResolvedValue({});
      const promptId = '1';
      const data = {
        id: promptId,
        title: 'Old title',
        content: 'Old content',
      };

      const result = await updatePromptAction(data);

      expect(result).toMatchObject({
        success: true,
        message: 'Prompt atualizado com sucesso',
      });
      expect(revalidatePath as jest.Mock).toHaveBeenCalledTimes(1);
    });

    it('should be able to return validation error when fields are empty', async () => {
      const data = {
        id: '1',
        title: '',
        content: '',
      };

      const result = await updatePromptAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Erro de validação');
      expect(result.errors).toBeDefined();
    });

    it('should be able to return error when prompt dont exists', async () => {
      mockedUpdateExecute.mockRejectedValue(new Error('PROMPT_NOT_FOUND'));
      const promptId = '1';
      const data = {
        id: promptId,
        title: 'Novo',
        content: 'Content',
      };

      const result = await updatePromptAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Prompt não encontrado');
    });

    it('should be able to resturn generic error when update fails', async () => {
      mockedUpdateExecute.mockRejectedValue(new Error('UNKNOWN'));
      const promptId = '1';
      const data = {
        id: promptId,
        title: 'new',
        content: 'content',
      };

      const result = await updatePromptAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Falha ao atualizar o prompt');
    });
  });

  describe('deletePromptAction', () => {
    it('should be able to remove prompt', async () => {
      mockedDeleteExecute.mockResolvedValue(undefined);
      const promptId = '1';

      const result = await deletePromptAction(promptId);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Prompt removido com sucesso');
      expect(revalidatePath as jest.Mock).toHaveBeenCalledTimes(1);
    });

    it('should be able to return error when id is empty', async () => {
      const promptId = '';
      const result = await deletePromptAction(promptId);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Id do prompt é obrigatório');
    });

    it('should be able to return error when prompt dont exists', async () => {
      const errorMessage = 'PROMPT_NOT_FOUND';
      mockedDeleteExecute.mockRejectedValue(new Error(errorMessage));
      const promptId = '1';

      const result = await deletePromptAction(promptId);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Prompt não encontrado');
    });

    it('should be able to return generic error when action fails', async () => {
      const errorMessage = 'UNKNOWN';
      mockedDeleteExecute.mockRejectedValue(new Error(errorMessage));
      const promptId = '1';

      const result = await deletePromptAction(promptId);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Falha ao remover o prompt');
    });
  });
});
