import { expect } from '@playwright/test';

import { loadPage } from './libs/load-page';
import { newPage } from './libs/page-logic';
import { test } from './libs/playwright';
loadPage();

test.describe('Local first delete page', () => {
  test('New a page , then delete it in all pages, restore it', async ({
    page,
  }) => {
    await newPage(page);
    await page.getByPlaceholder('Title').click();
    await page.getByPlaceholder('Title').fill('this is a new page to restore');
    const originPageUrl = page.url();
    const newPageId = page.url().split('/').reverse()[0];
    await page.getByRole('link', { name: 'All pages' }).click();
    const cell = page.getByRole('cell', {
      name: 'this is a new page to restore',
    });
    expect(cell).not.toBeUndefined();

    await page
      .getByTestId('more-actions-' + newPageId)
      .getByRole('button')
      .first()
      .click();
    const deleteBtn = page.getByRole('button', { name: 'Delete' });
    await deleteBtn.click();
    const confirmTip = page.getByText('Delete page?');
    expect(confirmTip).not.toBeUndefined();

    await page.getByRole('button', { name: 'Delete' }).click();

    await page.getByRole('link', { name: 'Trash' }).click();
    // restore it
    await page
      .getByTestId('more-actions-' + newPageId)
      .getByRole('button')
      .first()
      .click();

    // go to page detail
    expect(page.url()).toBe(originPageUrl);

    await page.getByRole('link', { name: 'All pages' }).click();
    const restoreCell = page.getByRole('cell', {
      name: 'this is a new page to restore',
    });
    expect(restoreCell).not.toBeUndefined();
  });
});
