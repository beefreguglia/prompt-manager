import test, { expect, type Page } from '@playwright/test';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

test('Edit prompt from UI (success)', async ({ page }: { page: Page }) => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const now = Date.now();
  const originalTitle = `E2E Edit Original ${now}`;
  const originalContent = 'Original Content';
  const updatedTitle = `E2E Edit Updated ${now}`;
  const updatedContent = 'Updated Content';

  const created = await prisma.prompt.create({
    data: {
      title: originalTitle,
      content: originalContent,
    },
  });
  await prisma.$disconnect();

  await page.goto(`/${created.id}`);
  const titleInput = page.getByPlaceholder('Título do prompt');
  await expect(titleInput).toBeVisible();
  await titleInput.click();
  await titleInput.fill(updatedTitle);
  await page.fill('textarea[name="content"]', updatedContent);
  await page.getByRole('button', { name: 'Salvar' }).click();

  await page.waitForSelector('text=Prompt atualizado com sucesso', {
    state: 'visible',
    timeout: 15000,
  });

  await expect(page.getByRole('heading', { name: updatedTitle })).toBeVisible();
  await expect(titleInput).toHaveValue(updatedTitle);
});
