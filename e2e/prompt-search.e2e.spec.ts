import test, { expect, type Page } from '@playwright/test';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

test('Filter a prompt list based in term typed', async ({
  page,
}: {
  page: Page;
}) => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  const uniqueAlpha = `E2E search Alpha ${Date.now()}`;
  const uniqueBeta = `E2E search Beta ${Date.now()}`;

  await prisma.prompt.createMany({
    data: [
      { title: uniqueAlpha, content: 'Content Alpha' },
      { title: uniqueBeta, content: 'Content Beta' },
    ],
  });
  await prisma.$disconnect();

  await page.goto('/');

  const searchInput = page.getByPlaceholder('Buscar prompts...');
  await expect(searchInput).toBeVisible();

  await searchInput.fill(uniqueAlpha);
  await expect(page.getByText(uniqueAlpha)).toHaveCount(1);

  await searchInput.fill(uniqueBeta);
  await expect(page.getByText(uniqueBeta)).toHaveCount(1);

  const notExist = `E2E Search Not exits ${Date.now()}`;
  await searchInput.fill(notExist);
  await expect(page.getByText(notExist)).toHaveCount(0);
});
