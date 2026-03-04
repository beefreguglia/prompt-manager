import type { Prompt } from '@/core/domain/prompts/prompt.entity';
import type { PrismaClient } from '@/generated/prisma/client';
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompt.repository';

type PromptDelegateMock = {
  findMany: jest.MockedFunction<
    (args: {
      orderBy?: { createdAt: 'asc' | 'desc' };
      where?: {
        OR: Array<{
          title?: { contains: string; mode: 'insensitive' };
          content?: { contains: string; mode: 'insensitive' };
        }>;
      };
    }) => Promise<Prompt[]>
  >;
};

type PrismaMock = {
  prompt: PromptDelegateMock;
};

function createMockPrisma() {
  const mock: PrismaMock = {
    prompt: {
      findMany: jest.fn(),
    },
  };

  return mock as unknown as PrismaClient & PrismaMock;
}

describe('PrismaPromptRepository', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let repository: PrismaPromptRepository;

  beforeEach(() => {
    prisma = createMockPrisma();
    repository = new PrismaPromptRepository(prisma);
  });

  describe('findMany', () => {
    it('should be able to order by createdAt desc and map results', async () => {
      const now = new Date();
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'Content 01',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '2',
          title: 'Title 02',
          content: 'Content 02',
          createdAt: now,
          updatedAt: now,
        },
      ];
      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.findMany();

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(results).toMatchObject(input);
    });
  });

  describe('searchMany', () => {
    it('should be able to search by empty term and no send where', async () => {
      const now = new Date();
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'Content 01',
          createdAt: now,
          updatedAt: now,
        },
      ];
      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany('    ');

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
      });
      expect(results).toMatchObject(input);
    });

    it('should be able to search by term and no send OR on where', async () => {
      const now = new Date();
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'Content 01',
          createdAt: now,
          updatedAt: now,
        },
      ];
      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany('  title 01  ');

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'title 01', mode: 'insensitive' } },
            { content: { contains: 'title 01', mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(results).toMatchObject(input);
    });

    it('should be able to accept undefined term and dont send where', async () => {
      const now = new Date();
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'Content 01',
          createdAt: now,
          updatedAt: now,
        },
      ];
      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany(undefined);

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
      });
      expect(results).toMatchObject(input);
    });
  });
});
