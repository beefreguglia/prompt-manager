import test, { expect, type Page } from '@playwright/test';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@/generated/prisma/client';

test('Create prompt from ui (success)', async ({ page }: { page: Page }) => {
  const uniqueTitle = `E2E Prompt ${Date.now()}`;
  const content = 'Conteúdo gerado via E2E';

  await page.goto('/new');
  await expect(page.getByPlaceholder('Título do prompt')).toBeVisible();
  const titleInput = page.getByPlaceholder('Título do prompt');
  await titleInput.click();
  await titleInput.fill(uniqueTitle);
  await page.fill('textarea[name="content"]', content);
  await page.getByRole('button', { name: 'Salvar' }).click();

  await page.waitForSelector('text=Prompt criado com sucesso', {
    state: 'visible',
    timeout: 15000,
  });
});

test('Title duplicate validation', async ({ page }: { page: Page }) => {
  const duplicateTitle = 'Duplicate E2E Titile';
  const content = 'Conteúdo gerado via E2E';

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  await prisma.prompt.deleteMany({ where: { title: duplicateTitle } });
  await prisma.prompt.create({ data: { title: duplicateTitle, content } });

  await page.goto('/new');
  await expect(page.getByPlaceholder('Título do prompt')).toBeVisible();
  const titleInput = page.getByPlaceholder('Título do prompt');
  await titleInput.click();
  await titleInput.fill(duplicateTitle);
  await page.fill('textarea[name="content"]', content);
  await page.getByRole('button', { name: 'Salvar' }).click();

  await page.waitForSelector('text=Este prompt já existe', {
    state: 'visible',
    timeout: 15000,
  });

  expect(page.getByRole('heading', { name: duplicateTitle })).toHaveCount(1);
});
