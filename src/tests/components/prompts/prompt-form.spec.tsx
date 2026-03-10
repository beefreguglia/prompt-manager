import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { PromptForm, type PromptFormProps } from '@/components/prompts';
import { render, screen } from '@/lib/test-utils';

const refreshMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const createActionMock = jest.fn();
const updateActionMock = jest.fn();
jest.mock('@/app/actions/prompt.actions', () => ({
  createPromptAction: (...args: unknown[]) => createActionMock(...args),
  updatePromptAction: (...args: unknown[]) => updateActionMock(...args),
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

function makeSut({ prompt }: PromptFormProps = {} as PromptFormProps) {
  return render(<PromptForm prompt={prompt} />);
}

describe('PromptForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    createActionMock.mockReset();
    updateActionMock.mockReset();
    refreshMock.mockReset();
    (toast.success as jest.Mock).mockReset();
    (toast.error as jest.Mock).mockReset();
  });

  it('should be able to create a new prompt', async () => {
    const successMessage = 'success';
    createActionMock.mockResolvedValueOnce({
      success: true,
      message: successMessage,
    });
    makeSut();

    const titleInput = screen.getByPlaceholderText('Título do prompt');
    await user.type(titleInput, 'title');
    const contentInput = screen.getByPlaceholderText(
      'Digite o conteúdo do prompt...'
    );
    await user.type(contentInput, 'content');

    const submitButton = screen.getByRole('button', { name: 'Salvar' });
    await user.click(submitButton);

    expect(createActionMock).toHaveBeenCalledWith({
      title: 'title',
      content: 'content',
    });
    expect(toast.success).toHaveBeenCalledWith(successMessage);
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });

  it('should be able to show an error messagen when creation fails', async () => {
    const errorMessage = 'error';
    createActionMock.mockResolvedValueOnce({
      success: false,
      message: errorMessage,
    });
    makeSut();

    const titleInput = screen.getByPlaceholderText('Título do prompt');
    await user.type(titleInput, 'title');

    const contentInput = screen.getByPlaceholderText(
      'Digite o conteúdo do prompt...'
    );
    await user.type(contentInput, 'content');

    const submitButton = screen.getByRole('button', { name: 'Salvar' });
    await user.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it('should be able to show error messages when form is empty', async () => {
    makeSut();

    const submitButton = screen.getByRole('button', { name: 'Salvar' });
    await user.click(submitButton);

    expect(screen.getByText('Título é obrigatório')).toBeVisible();
    expect(screen.getByText('Conteúdo é obrigatório')).toBeVisible();
    expect(createActionMock).not.toHaveBeenCalled();
  });

  it('should be able to update a prompt with success', async () => {
    updateActionMock.mockResolvedValue({
      success: true,
      message: 'Prompt atualizado com sucesso',
    });
    const now = new Date();
    const prompt = {
      id: '1',
      title: 'Old title',
      content: 'Old content',
      createdAt: now,
      updatedAt: now,
    };

    makeSut({ prompt });

    const titleInput = screen.getByPlaceholderText('Título do prompt');
    await user.clear(titleInput);
    await user.type(titleInput, 'New title');

    const contentInput = screen.getByPlaceholderText(
      'Digite o conteúdo do prompt...'
    );
    await user.clear(contentInput);
    await user.type(contentInput, 'New content');

    const submitButton = screen.getByRole('button', { name: 'Salvar' });
    await user.click(submitButton);

    expect(updateActionMock).toHaveBeenCalledWith({
      id: prompt.id,
      title: 'New title',
      content: 'New content',
    });
    expect(toast.success).toHaveBeenCalledWith('Prompt atualizado com sucesso');
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });
});
