import userEvent from '@testing-library/user-event';
import { SidebarContent, type SidebarContentProps } from '@/components/sidebar';
import { render, screen } from '@/lib/test-utils';

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

  describe('Base', () => {
    it('should render a new prompt button', () => {
      makeSut();

      expect(screen.getByRole('complementary')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Novo prompt' })).toBeVisible();
    });

    it('should be able to render a prompts list', () => {
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

  describe('Collapse / Expand', () => {
    it('should be able to initialize expanded and show minimize button', () => {
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
      const text = 'AI text';

      makeSut();

      const searchInput = screen.getByPlaceholderText('Buscar prompts...');

      await user.type(searchInput, text);

      expect(pushMock).toHaveBeenCalled();
      const lastCall = pushMock.mock.calls.at(-1);
      expect(lastCall?.[0]).toBe('/?q=AI%20text');

      await user.clear(searchInput);

      const lastClearCall = pushMock.mock.calls.at(-1);
      expect(lastClearCall?.[0]).toBe('/');
    });

    it('should be able to initialize search with a query string', () => {
      const text = 'AI text';
      const searchParams = new URLSearchParams(`q=${text}`);
      searchParamsMock = searchParams;
      makeSut();

      const searchInput = screen.getByPlaceholderText('Buscar prompts...');
      expect(searchInput).toHaveValue(text);
    });
  });
});
