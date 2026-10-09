import { test, expect } from '@playwright/test';
import utils from '../utils';

test('CT-012 - Abrir cadastro de novo modelo', async ({ page }) => {
    await utils.acessarTelaModelos(page)

    const dialog = await utils.abrirDialogNovo(page)

    // Campos devem estar disponíveis e sem dados preenchidos
    await expect(dialog.locator('#novoFabricante')).toBeVisible();
    await expect(dialog.locator('#novaFamilia')).toBeVisible();
    await expect(utils.campoPorLabel(dialog, 'Molicar')).toHaveValue('');
    await expect(utils.campoPorLabel(dialog, 'Modelo')).toHaveValue('');
});

test('CT-013 - Cadastrar modelo com dados válidos', async ({ page }) => {
    await utils.acessarTelaModelos(page)

    const dialog = await utils.abrirDialogNovo(page)

    // Fabricante e Família
    const selectFabricante = dialog.locator('#novoFabricante')
    const { valor: valorFab } = await utils.propsOptionSelect(page, selectFabricante, 1)
    await selectFabricante.selectOption(valorFab!);

    const selectFamilia = dialog.locator('#novaFamilia')
    const { valor: valorFam } = await utils.propsOptionSelect(page, selectFamilia, 1)
    await selectFamilia.selectOption(valorFam!);

    // Demais campos
    await utils.campoPorLabel(dialog, 'Molicar').fill('99999999-9');
    await utils.campoPorLabel(dialog, 'Modelo').fill('Modelo Teste CT13');
    await utils.campoPorLabel(dialog, 'Ano início').fill('2020');
    await utils.campoPorLabel(dialog, 'Ano fim').fill('2026');
    // Campo de Portas ainda não segue funcionamento dos outros campos
    await utils.campoPorLabel(dialog, 'Portas').fill('4');
    await utils.campoPorLabel(dialog, 'Cilindradas').fill('1000');
    await utils.campoPorLabel(dialog, 'Cavalos').fill('100');

    const selectCombustivel = utils.selectPorLabel(dialog, 'Combustível')
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

    const dialog = await utils.abrirDialogNovo(page)

    // Salvar sem colocar nd
    await dialog.locator('#btnSalvar').click();

    // Dialog deve continuar aberto
    await expect(dialog).toBeVisible();

    // Alguma mensagem de validação tem q aparecer
    await expect(dialog.locator('.validationMessage').first()).toBeVisible();
});

test('CT-015 - Cancelar cadastro de novo modelo', async ({ page }) => {
    await utils.acessarTelaModelos(page)

    const dialog = await utils.abrirDialogNovo(page)

    // Preencher alguns campos
    await utils.campoPorLabel(dialog, 'Modelo').fill('Modelo que não deve ser salvo');

    // Cancelar
    await dialog.locator('#btnCancelar').click();
    await expect(dialog).not.toBeVisible();

    // Abrir novamente, campos devem estar limpos
    await utils.abrirDialogNovo(page)
    await expect(utils.campoPorLabel(dialog, 'Modelo')).toHaveValue('');
});

test('CT-016 - Verificar relacionamento entre Fabricante e Família no cadastro', async ({ page }) => {
    await utils.acessarTelaModelos(page)

    const dialog = await utils.abrirDialogNovo(page)

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
    await utils.campoPorLabel(dialog, 'Molicar').fill('99999916-0');
    await utils.campoPorLabel(dialog, 'Modelo').fill('Modelo Teste CT16');
    await utils.campoPorLabel(dialog, 'Ano início').fill('2021');
    await utils.campoPorLabel(dialog, 'Ano fim').fill('2023');
    // Campo de Portas ainda não segue funcionamento dos outros campos
    await utils.campoPorLabel(dialog, 'Portas').fill('4');
    await utils.campoPorLabel(dialog, 'Cilindradas').fill('1000');
    await utils.campoPorLabel(dialog, 'Cavalos').fill('100');

    const selectCombustivel = utils.selectPorLabel(dialog, 'Combustível')
    const { valor: valorComb } = await utils.propsOptionSelect(page, selectCombustivel, 1)
    await selectCombustivel.selectOption(valorComb!);

    await dialog.locator('#btnSalvar').click();
    await expect(dialog).not.toBeVisible();

    // Linha na tabela deve ter o Fabricante e Família corretos
    const linha = page.locator('#tableModelos tbody tr').filter({ hasText: 'Modelo Teste CT16' })
    await expect(linha).toBeVisible();
    await expect(linha).toContainText(textoFab!);
    await expect(linha).toContainText(textoFam!);
});
