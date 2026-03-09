import { expect, type Page, test } from '@playwright/test';

test('should be able to loading home page', async ({
  page,
}: {
  page: Page;
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Selecione um prompt' })
  ).toBeVisible();

  await expect(
    page.getByText(
      'Escolha um prompt da lista ao lado para visualizar e editar'
    )
  ).toBeVisible();
});
