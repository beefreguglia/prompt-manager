import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import {
  PromptCard,
  type PromptCardProps,
} from '@/components/prompts/prompt-card';
import { render, screen } from '@/lib/test-utils';

const pushMock = jest.fn();
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    prefetch,
    ...props
  }: {
    href: string;
    children: ReactNode;
    prefetch?: boolean;
  }) => (
    <a
      href={href}
      {...props}
      onClick={(e) => {
        e.preventDefault();
        pushMock(href);
      }}
    >
      {children}
    </a>
  ),
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

function makeSut({ prompt }: PromptCardProps) {
  return render(<PromptCard prompt={prompt} />);
}

describe('PromptCard', () => {
  const user = userEvent.setup();
  const prompt = {
    id: '1',
    title: 'title 1',
    content: 'content 1',
  };

  it('should be able render link with href correctly', () => {
    makeSut({ prompt });

    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/${prompt.id}`);
  });

  it('should be able to redirect user by click on card', async () => {
    makeSut({ prompt });

    const link = screen.getByRole('link');
    await user.click(link);

    expect(pushMock).toHaveBeenCalledWith(`/${prompt.id}`);
  });

  it('should be able open a remove prompt confirmation', async () => {
    makeSut({ prompt });

    const deleteButton = screen.getByRole('button');
    await user.click(deleteButton);

    expect(screen.getByText('Remover Prompt')).toBeInTheDocument();
  });

  it('should be able to remove with success and show a success toast', async () => {
    makeSut({ prompt });

    const deleteButton = screen.getByRole('button', { name: 'Remover Prompt' });
    await user.click(deleteButton);

    await user.click(screen.getByRole('button', { name: 'Confirmar remoção' }));

    expect(toast.success).toHaveBeenCalledWith('Prompt removido com sucesso');
  });
});
