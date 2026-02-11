import userEvent from '@testing-library/user-event';
import { SidebarContent } from '@/components/sidebar';
import { render, screen } from '@/lib/test-utils';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const makeSut = () => {
  return render(<SidebarContent />);
};

describe('Sidebar Content', () => {
  const user = userEvent.setup();

  it('should render a new prompt button', () => {
    makeSut();

    expect(screen.getByRole('complementary')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Novo prompt' })).toBeVisible();
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
});
