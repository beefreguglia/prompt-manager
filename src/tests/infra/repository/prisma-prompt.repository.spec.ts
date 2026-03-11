import type { CreatePromptDTO } from '@/core/application/prompts/create-prompt.dto';
import type { UpdatePromptDTO } from '@/core/application/prompts/update-prompt.dto';
import type { Prompt } from '@/core/domain/prompts/prompt.entity';
import type { PrismaClient } from '@/generated/prisma/client';
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompt.repository';

type PromptDelegateMock = {
  create: jest.MockedFunction<
    (args: { data: CreatePromptDTO }) => Promise<void>
  >;
  findUnique: jest.MockedFunction<
    (args: { where: { id: string } }) => Promise<Prompt | null>
  >;
  findFirst: jest.MockedFunction<
    (args: {
      where: { title: string };
    }) => Promise<Pick<Prompt, 'id' | 'title' | 'content'> | null>
  >;
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
  update: jest.MockedFunction<
    (args: { where: { id: string }; data: UpdatePromptDTO }) => Promise<Prompt>
  >;
  delete: jest.MockedFunction<
    (args: {
      where: {
        id: string;
      };
    }) => Promise<void>
  >;
};

type PrismaMock = {
  prompt: PromptDelegateMock;
};

function createMockPrisma() {
  const mock: PrismaMock = {
    prompt: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

  describe('create', () => {
    it('should be able to create an user', async () => {
      const input = {
        title: 'title',
        content: 'content',
      };

      await repository.create(input);

      expect(prisma.prompt.create).toHaveBeenCalledWith({ data: input });
    });
  });

  describe('findByTitle', () => {
    it('should be able to call findFirts with title', async () => {
      const title = 'title 01';
      const input = {
        id: 'p1',
        title,
        content: 'content 01',
      };

      prisma.prompt.findFirst.mockResolvedValue(input);

      const result = await repository.findByTitle(title);

      expect(prisma.prompt.findFirst).toHaveBeenCalledWith({
        where: {
          title,
        },
      });

      expect(result).toEqual(input);
    });
  });

  describe('findById', () => {
    it('should be able to return a prompt when exists', async () => {
      const now = new Date();
      const input = {
        id: '1',
        title: 'title',
        content: 'content',
        createdAt: now,
        updatedAt: now,
      };
      prisma.prompt.findUnique.mockResolvedValue(input);

      const result = await repository.findById(input.id);

      expect(prisma.prompt.findUnique).toHaveBeenCalledWith({
        where: {
          id: input.id,
        },
      });
      expect(result).toEqual(input);
    });

    it('should be able to return null when dont exits a prompt', async () => {
      prisma.prompt.findUnique.mockResolvedValue(null);

      const result = await repository.findById('1');

      expect(result).toBeNull();
    });
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

  describe('update', () => {
    it('should be able to update and return updated prompt', async () => {
      const now = new Date();
      const input = {
        id: '1',
        title: 'New title',
        content: 'New content',
        createdAt: now,
        updatedAt: now,
      };

      prisma.prompt.update.mockResolvedValue(input);

      const result = await repository.update(input.id, {
        title: input.title,
        content: input.content,
      });

      expect(prisma.prompt.update).toHaveBeenCalledWith({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          content: input.content,
        },
      });

      expect(result).toEqual(input);
    });

    it('should be able to update only with new title', async () => {
      const now = new Date();
      const input = {
        id: '1',
        title: 'New title',
        content: '',
        createdAt: now,
        updatedAt: now,
      };

      prisma.prompt.update.mockResolvedValue(input);

      await repository.update(input.id, {
        title: input.title,
      });
      const call = prisma.prompt.update.mock.calls[0][0];

      expect(call.where).toEqual({ id: input.id });
      expect(call.data).toEqual({ title: input.title });
      expect('content' in call.data).toBe(false);
    });

    it('should be able to update only with new content', async () => {
      const now = new Date();
      const input = {
        id: '1',
        title: '',
        content: 'New content',
        createdAt: now,
        updatedAt: now,
      };

      prisma.prompt.update.mockResolvedValue(input);

      await repository.update(input.id, {
        content: input.content,
      });
      const call = prisma.prompt.update.mock.calls[0][0];

      expect(call.where).toEqual({ id: input.id });
      expect(call.data).toEqual({ content: input.content });
      expect('title' in call.data).toBe(false);
    });
  });

  describe('delete', () => {
    it('should be able to call prisma.prompt.delete whith where using id', async () => {
      const promptId = '1';
      await repository.delete(promptId);

      expect(prisma.prompt.delete).toHaveBeenCalledWith({
        where: { id: promptId },
      });
    });
  });
});
