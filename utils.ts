import { expect, Page, Locator } from '@playwright/test'

const utils = {
    acessarTelaModelos,
    propsOptionSelect,
}

async function acessarTelaModelos(page: Page) {
    await page.goto('/');

    // Inicia acesso ao sistema
    await page.getByRole('button', { name: 'Começar' }).click();
    await expect(
        page.getByRole('heading', { name: 'Filtrar Modelos' })
    ).toBeVisible();
}

async function propsOptionSelect(page: Page, selectLocator: Locator, index: number) {
    const option = selectLocator.locator('option').nth(index)
    const texto = await option.textContent()
    const valor = await option.getAttribute('value');
    return { texto, valor }
}

export default utils