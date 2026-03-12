import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { SidebarContent, type SidebarContentProps } from '@/components/sidebar';
import { render, screen, waitFor } from '@/lib/test-utils';

const pushMock = jest.fn();
let searchParamsMock = new URLSearchParams();
const setQueryMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => searchParamsMock,
}));

jest.mock('nuqs', () => ({
  useQueryState: (key: string) => {
    const [value, setValue] = useState(searchParamsMock.get(key) ?? '');

    function setQuery(nextValue: string) {
      setQueryMock(nextValue);
      setValue(nextValue);
    }

    return [value, setQuery] as const;
  },
}));

const initialPrompts = [
  { id: '1', title: 'Title 01', content: 'Content 01' },
  { id: '2', title: 'Title 02', content: 'Content 02' },
];

const makeSut = (
  { prompts = initialPrompts }: SidebarContentProps = {} as SidebarContentProps
) => {
  return render(<SidebarContent prompts={prompts} />);
};

describe('Sidebar Content', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    searchParamsMock = new URLSearchParams();
  });

  describe('Base', () => {
    it('should render a new prompt button', async () => {
      makeSut();

      expect(screen.getByRole('complementary')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Novo prompt' })).toBeVisible();
    });

    it('should be able to render a prompts list', async () => {
      makeSut();

      expect(screen.getByText(initialPrompts[0].title)).toBeInTheDocument();
      expect(screen.getAllByRole('paragraph')).toHaveLength(
        initialPrompts.length
      );
    });

    it('should be able to update a search field while typing', async () => {
      const text = 'AI';
      makeSut();

      const searchInput = screen.getByPlaceholderText('Buscar prompts...');
      await user.type(searchInput, text);

      expect(searchInput).toHaveValue(text);
    });
  });

  describe('SidebarContentMobile', () => {
    it('should be able to open and close mobile menu', async () => {
      makeSut();

      const aside = screen.getByRole('complementary');
      expect(aside.className).toContain('-translate-x-full');

      const openButton = screen.getByRole('button', { name: 'Abrir menu' });
      await user.click(openButton);
      expect(aside.className).toContain('translate-x-0');

      const closeButton = screen.getByRole('button', { name: 'Fechar menu' });
      await user.click(closeButton);
      expect(aside.className).toContain('-translate-x-full');
    });
  });

  describe('Collapse / Expand', () => {
    it('should be able to initialize expanded and show minimize button', async () => {
      makeSut();

      const aside = screen.getByRole('complementary');
      expect(aside).toBeVisible();

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });
      expect(collapseButton).toBeVisible();

      const expandButton = screen.queryByRole('button', {
        name: /expandir sidebar/i,
      });
      expect(expandButton).not.toBeInTheDocument();
    });

    it('should be able to expand by click in expand button', async () => {
      makeSut();

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });
      await user.click(collapseButton);

      const expandButton = screen.getByRole('button', {
        name: /expandir sidebar/i,
      });
      await user.click(expandButton);

      expect(
        screen.getByRole('button', { name: /minimizar sidebar/i })
      ).toBeVisible();
      expect(
        screen.getByRole('navigation', { name: 'Lista de prompts' })
      ).toBeVisible();
    });

    it('should be able to colapse and show expand button', async () => {
      makeSut();

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });
      await user.click(collapseButton);

      const expandButton = screen.getByRole('button', {
        name: /expandir sidebar/i,
      });

      expect(expandButton).toBeInTheDocument();
      expect(collapseButton).not.toBeInTheDocument();
    });

    it('should be able to show add prompt button in collapsed sidebar', async () => {
      makeSut();

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });
      await user.click(collapseButton);

      const newPromptButton = screen.getByRole('button', {
        name: /novo prompt/i,
      });

      expect(newPromptButton).toBeVisible();
    });

    it('should not be able to show prompt list in collapsed sidebar', async () => {
      makeSut();

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });
      await user.click(collapseButton);

      const nav = screen.queryByRole('navigation', {
        name: /lista de prompts/i,
      });

      expect(nav).not.toBeInTheDocument();
    });
  });

  describe('New prompt', () => {
    it('should be able to navigate an user for a new prompt page', async () => {
      makeSut();

      const newPromptButton = screen.getByRole('button', {
        name: 'Novo prompt',
      });
      await user.click(newPromptButton);

      expect(pushMock).toHaveBeenCalledWith('/new');
    });
  });

  describe('Search', () => {
    it('should be able navigate using an encoded URL while typing and clearing the address bar', async () => {
      const text = 'A B';
      makeSut();

      const searchInput = screen.getByPlaceholderText('Buscar prompts...');
      await user.type(searchInput, text);

      expect(setQueryMock).toHaveBeenCalled();
      const lastCall = setQueryMock.mock.calls.at(-1);
      expect(lastCall?.[0]).toBe(text);

      await user.clear(searchInput);
      const lastClearCall = setQueryMock.mock.calls.at(-1);
      expect(lastClearCall?.[0]).toBe('');
    });

    it('should submit the form when typing in the search field', async () => {
      const submitSpy = jest
        .spyOn(HTMLFormElement.prototype, 'requestSubmit')
        .mockImplementation(() => undefined);

      makeSut();

      const searchInput = screen.getByPlaceholderText('Buscar prompts...');
      await user.type(searchInput, 'AI');

      expect(submitSpy).toHaveBeenCalled();
      submitSpy.mockRestore();
    });

    it('should automatically submit on mount when a query is present', async () => {
      const submitSpy = jest
        .spyOn(HTMLFormElement.prototype, 'requestSubmit')
        .mockImplementation(() => undefined);

      const text = 'text';
      searchParamsMock = new URLSearchParams(`q=${text}`);

      makeSut();

      expect(submitSpy).toHaveBeenCalled();
      submitSpy.mockRestore();
    });

    it('should be able to initialize search with a query string', async () => {
      // const submitSpy = jest
      //   .spyOn(HTMLFormElement.prototype, 'requestSubmit')
      //   .mockImplementation(() => undefined);
      // Forma de resolver problemas com server actions
      const text = 'inicial';
      searchParamsMock = new URLSearchParams(`q=${text}`);

      makeSut();

      const searchInput = screen.getByPlaceholderText('Buscar prompts...');
      await waitFor(() => expect(searchInput).toHaveValue(text));
      // submitSpy.mockRestore();
    });
  });
});
