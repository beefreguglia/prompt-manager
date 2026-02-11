import userEvent from '@testing-library/user-event';
import { SidebarContent, type SidebarContentProps } from '@/components/sidebar';
import { render, screen } from '@/lib/test-utils';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
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
});
