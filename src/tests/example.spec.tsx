import { render, screen } from '@/lib/test-utils';

describe('Exemplo', () => {
  it('Deve passar', () => {
    render(<div>Teste</div>);

    expect(screen.getByText('Teste')).toBeInTheDocument();
  });
});
