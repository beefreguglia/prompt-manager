import userEvent from '@testing-library/user-event';
import { SidebarContent, type SidebarContentProps } from '@/components/sidebar';
import { render, screen, waitFor } from '@/lib/test-utils';

const pushMock = jest.fn();
let searchParamsMock = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => searchParamsMock,
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
      await makeSut();

      expect(screen.getByRole('complementary')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Novo prompt' })).toBeVisible();
    });

    it('should be able to render a prompts list', async () => {
      await makeSut();

      expect(screen.getByText(initialPrompts[0].title)).toBeInTheDocument();
      expect(screen.getAllByRole('paragraph')).toHaveLength(
        initialPrompts.length
      );
    });

    it('should be able to update a search field while typing', async () => {
      const text = 'AI';
      await makeSut();

      const searchInput = screen.getByPlaceholderText('Buscar prompts...');
      await user.type(searchInput, text);

      expect(searchInput).toHaveValue(text);
    });
  });

  describe('Collapse / Expand', () => {
    it('should be able to initialize expanded and show minimize button', async () => {
      await makeSut();

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
      await makeSut();

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
      await makeSut();

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
      await makeSut();

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
      await makeSut();

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
      await makeSut();

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
      await makeSut();

      const searchInput = screen.getByPlaceholderText('Buscar prompts...');
      await user.type(searchInput, text);

      expect(pushMock).toHaveBeenCalled();
      const lastCall = pushMock.mock.calls.at(-1);
      expect(lastCall?.[0]).toBe('/?q=A%20B');

      await user.clear(searchInput);
      const lastClearCall = pushMock.mock.calls.at(-1);
      expect(lastClearCall?.[0]).toBe('/');
    });

    it('should submit the form when typing in the search field', async () => {
      const submitSpy = jest
        .spyOn(HTMLFormElement.prototype, 'requestSubmit')
        .mockImplementation(() => undefined);

      await makeSut();

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

      await makeSut();

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
