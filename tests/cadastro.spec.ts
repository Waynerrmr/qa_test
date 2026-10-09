import { test, expect } from '@playwright/test';
import utils from '../utils';

test('CT-012 - Abrir cadastro de novo modelo', async ({ page }) => {
    await utils.acessarTelaModelos(page)

    await page.getByRole('button', { name: 'Novo modelo' }).click();

    const dialog = page.locator('#modalNovoVeiculo')
    await expect(dialog).toBeVisible();

    // Campos devem estar disponíveis e sem dados preenchidos
    await expect(dialog.locator('#novoFabricante')).toBeVisible();
    await expect(dialog.locator('#novaFamilia')).toBeVisible();

    const inputMolicar = dialog.locator('.form-group').filter({ hasText: 'Molicar' }).locator('input')
    const inputModelo = dialog.locator('.form-group').filter({ hasText: 'Modelo' }).locator('input')
    await expect(inputMolicar).toHaveValue('');
    await expect(inputModelo).toHaveValue('');
});

test('CT-013 - Cadastrar modelo com dados válidos', async ({ page }) => {
    await utils.acessarTelaModelos(page)

    await page.getByRole('button', { name: 'Novo modelo' }).click();

    const dialog = page.locator('#modalNovoVeiculo')
    await expect(dialog).toBeVisible();

    // Fabricante e Família
    const selectFabricante = dialog.locator('#novoFabricante')
    const { valor: valorFab } = await utils.propsOptionSelect(page, selectFabricante, 1)
    await selectFabricante.selectOption(valorFab!);

    const selectFamilia = dialog.locator('#novaFamilia')
    const { valor: valorFam } = await utils.propsOptionSelect(page, selectFamilia, 1)
    await selectFamilia.selectOption(valorFam!);

    // Demais campos
    await dialog.locator('.form-group').filter({ hasText: 'Molicar' }).locator('input').fill('99999999-9');
    await dialog.locator('.form-group').filter({ hasText: 'Modelo' }).locator('input').fill('Modelo Teste CT13');
    await dialog.locator('.form-group').filter({ hasText: 'Ano início' }).locator('input').fill('2020');
    await dialog.locator('.form-group').filter({ hasText: 'Ano fim' }).locator('input').fill('2026');
    // Campo de Portas ainda não segue funcionamento dos outros campos
    await dialog.locator('.form-group').filter({ hasText: 'Portas' }).locator('input').fill('4');
    await dialog.locator('.form-group').filter({ hasText: 'Cilindradas' }).locator('input').fill('1000');
    await dialog.locator('.form-group').filter({ hasText: 'Cavalos' }).locator('input').fill('100');

    const selectCombustivel = dialog.locator('.form-group').filter({ hasText: 'Combustível' }).locator('select')
    const { valor: valorComb } = await utils.propsOptionSelect(page, selectCombustivel, 1)
    await selectCombustivel.selectOption(valorComb!);

    await dialog.locator('#btnSalvar').click();
    await expect(dialog).not.toBeVisible();

    // Registro deve aparecer na tabela
    await expect(
        page.locator('#tableModelos td').filter({ hasText: 'Modelo Teste CT13' })
    ).toBeVisible();
});

test('CT-014 - Tentar cadastrar modelo sem preencher campos obrigatórios', async ({ page }) => {
    await utils.acessarTelaModelos(page)

    await page.getByRole('button', { name: 'Novo modelo' }).click();

    const dialog = page.locator('#modalNovoVeiculo')
    await expect(dialog).toBeVisible();

    // Salvar sem colocar nd
    await dialog.locator('#btnSalvar').click();

    // Dialog deve continuar aberto
    await expect(dialog).toBeVisible();

    // Alguma mensagem de validação tem q aparecer
    await expect(dialog.locator('.validationMessage').first()).toBeVisible();
});

test('CT-015 - Cancelar cadastro de novo modelo', async ({ page }) => {
    await utils.acessarTelaModelos(page)

    await page.getByRole('button', { name: 'Novo modelo' }).click();

    const dialog = page.locator('#modalNovoVeiculo')
    await expect(dialog).toBeVisible();

    // Preencher alguns campos
    await dialog.locator('.form-group').filter({ hasText: 'Modelo' }).locator('input').fill('Modelo que não deve ser salvo');

    // Cancelar
    await dialog.locator('#btnCancelar').click();
    await expect(dialog).not.toBeVisible();

    // Abrir novamente, campos devem estar limpos
    await page.getByRole('button', { name: 'Novo modelo' }).click();
    await expect(dialog).toBeVisible();

    const inputModelo = dialog.locator('.form-group').filter({ hasText: 'Modelo' }).locator('input')
    await expect(inputModelo).toHaveValue('');
});

test('CT-016 - Verificar relacionamento entre Fabricante e Família no cadastro', async ({ page }) => {
    await utils.acessarTelaModelos(page)

    await page.getByRole('button', { name: 'Novo modelo' }).click();

    const dialog = page.locator('#modalNovoVeiculo')
    await expect(dialog).toBeVisible();

    // Selecionar Fabricante
    const selectFabricante = dialog.locator('#novoFabricante')
    const { texto: textoFab, valor: valorFab } = await utils.propsOptionSelect(page, selectFabricante, 1)
    await selectFabricante.selectOption(valorFab!);

    // Família deve habilitar e carregar opções relacionadas
    const selectFamilia = dialog.locator('#novaFamilia')
    await expect(selectFamilia).toBeEnabled();

    const { texto: textoFam, valor: valorFam } = await utils.propsOptionSelect(page, selectFamilia, 1)
    await selectFamilia.selectOption(valorFam!);

    // Preencher restante
    await dialog.locator('.form-group').filter({ hasText: 'Molicar' }).locator('input').fill('99999916-0');
    await dialog.locator('.form-group').filter({ hasText: 'Modelo' }).locator('input').fill('Modelo Teste CT16');
    await dialog.locator('.form-group').filter({ hasText: 'Ano início' }).locator('input').fill('2021');
    await dialog.locator('.form-group').filter({ hasText: 'Ano fim' }).locator('input').fill('2023');
    // Campo de Portas ainda não segue funcionamento dos outros campos
    await dialog.locator('.form-group').filter({ hasText: 'Portas' }).locator('input').fill('4');
    await dialog.locator('.form-group').filter({ hasText: 'Cilindradas' }).locator('input').fill('1000');
    await dialog.locator('.form-group').filter({ hasText: 'Cavalos' }).locator('input').fill('100');

    const selectCombustivel = dialog.locator('.form-group').filter({ hasText: 'Combustível' }).locator('select')
    const { valor: valorComb } = await utils.propsOptionSelect(page, selectCombustivel, 1)
    await selectCombustivel.selectOption(valorComb!);

    await dialog.locator('#btnSalvar').click();
    await expect(dialog).not.toBeVisible();

    // Linha na tabela deve ter o Fabricante e Família corretos
    const linha = page.locator('#tableModelos td').filter({ hasText: 'Modelo Teste CT16' })
    await expect(linha).toBeVisible();
    await expect(linha).toContainText(textoFab!);
    await expect(linha).toContainText(textoFam!);
});
