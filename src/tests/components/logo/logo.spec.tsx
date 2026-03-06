import { Logo } from '@/components/logo';
import { render, screen } from '@/lib/test-utils';

describe('Logo', () => {
  it('should be able to render a link for homepage with text', async () => {
    render(<Logo />);

    const link = screen.getByRole('link', { name: 'PROMPTS' });

    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', '/');
  });
});
