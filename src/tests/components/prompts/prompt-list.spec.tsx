import { PromptList, type PromptListProps } from '@/components/prompts';
import { render, screen } from '@/lib/test-utils';

function makeSut({ prompts }: PromptListProps) {
  return render(<PromptList prompts={prompts} />);
}

describe('PromptList', () => {
  it('should be able to render a list of prompts', async () => {
    const prompts = [
      {
        id: '1',
        title: 'title 1',
        content: 'content 1',
      },
      {
        id: '2',
        title: 'title 2',
        content: 'content 2',
      },
    ];
    makeSut({ prompts });

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('title 1')).toBeInTheDocument();
    expect(screen.getByText('title 2')).toBeInTheDocument();
  });

  it('should not be able to render a list of prompts when list is empty', async () => {
    const prompts = [] as PromptListProps['prompts'];
    makeSut({ prompts });

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
