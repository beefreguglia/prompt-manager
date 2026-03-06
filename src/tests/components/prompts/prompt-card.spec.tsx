import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

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

function makeSut({ prompt }: PromptCardProps) {
  return render(<PromptCard prompt={prompt} />);
}

describe('PromptCard', () => {
  const user = userEvent.setup();

  it('should be able render link with href correctly', () => {
    const prompt = {
      id: '1',
      title: 'title 1',
      content: 'content 1',
    };
    makeSut({ prompt });

    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/${prompt.id}`);
  });

  it('should be able to redirect user by click on card', async () => {
    const prompt = {
      id: '1',
      title: 'title 1',
      content: 'content 1',
    };
    makeSut({ prompt });

    const link = screen.getByRole('link');
    await user.click(link);

    expect(pushMock).toHaveBeenCalledWith(`/${prompt.id}`);
  });
});
