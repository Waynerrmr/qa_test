import { expect, Page, Locator } from '@playwright/test'

const utils = {
    acessarTelaModelos,
    propsOptionSelect,
    abrirDialogNovo,
    abrirDialogEdicao,
    campoPorLabel,
    selectPorLabel,
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

async function abrirDialogNovo(page: Page): Promise<Locator> {
    await page.getByRole('button', { name: 'Novo modelo' }).click()
    const dialog = page.locator('#modalNovoVeiculo')
    await expect(dialog).toBeVisible()
    return dialog
}

async function abrirDialogEdicao(page: Page, linha: Locator): Promise<Locator> {
    await linha.locator('.action.primary').click()
    const dialog = page.locator('#modalNovoVeiculo')
    await expect(dialog).toBeVisible()
    return dialog
}

function campoPorLabel(dialog: Locator, label: string): Locator {
    return dialog.locator('.form-group').filter({ hasText: label }).locator('input')
}

function selectPorLabel(dialog: Locator, label: string): Locator {
    return dialog.locator('.form-group').filter({ hasText: label }).locator('select')
}

export default utils