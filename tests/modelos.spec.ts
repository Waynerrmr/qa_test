import { test, expect } from '@playwright/test';
import utils from '../utils';

test('CT-002 - Acessar tela de modelos com dados', async ({ page }) => {
    await utils.acessarTelaModelos(page)

    // Há uma linha na tabela de modelos
    await expect(
        page.locator('#tableModelos td').first()
    ).toBeVisible();
});

test('CT-003 - Filtrar por Tipo', async ({ page }) => {
    let diferente = false
    await utils.acessarTelaModelos(page)

    // Encontrar select de Tipo
    const selectTipo = page.getByText('Tipo: Selecione...').locator('select')

    // texto e valor do select
    const { texto, valor } = await utils.propsOptionSelect(page, selectTipo, 1)

    // Selecionar opção
    await selectTipo.selectOption(valor);

    // Encontrar posição do Tipo na tabela
    const headers = await page.locator('#tableModelos th').allTextContents();
    const indexTipo = headers.indexOf('Tipo')

    // varrer todas as linhas para encontrar alguma célula com valor diferente
    const cells = await page.locator(`#tableModelos td:nth-child(${indexTipo + 1})`).all();
    for (const cell of cells) {
        diferente = await cell.textContent() !== texto || await cell.textContent() === null;
        if (diferente) break;
    }
    expect(diferente).toBe(false);
});

test('CT-004 - Filtrar por Fabricante', async ({ page }) => {
    let diferente = false
    await utils.acessarTelaModelos(page)

    // Encontrar select de Fabricante
    const selectFabricante = page.getByText('Fabricante: Selecione...').locator('select')

    // texto e valor do select
    const { texto, valor } = await utils.propsOptionSelect(page, selectFabricante, 1)

    // Selecionar opção
    await selectFabricante.selectOption(valor);

    // Encontrar posição do Fabricante na tabela
    const headers = await page.locator('#tableModelos th').allTextContents();
    const indexFabricante = headers.indexOf('Fabricante')

    // varrer todas as linhas para encontrar alguma célula com valor diferente
    const cells = await page.locator(`#tableModelos td:nth-child(${indexFabricante + 1})`).all();
    for (const cell of cells) {
        diferente = await cell.textContent() !== texto || await cell.textContent() === null;
        if (diferente) break;
    }
    expect(diferente).toBe(false);
});

test('CT-005 - Filtrar por Família', async ({ page }) => {
    let diferente = false
    await utils.acessarTelaModelos(page)

    const selectFabricante = page.getByText('Fabricante: Selecione...').locator('select')
    const selectFamilia = page.getByText('Família: Selecione...').locator('select')

    // 1º Fabricante, 2º Família
    const fabricanteSelectProps = await utils.propsOptionSelect(page, selectFabricante, 1)
    await selectFabricante.selectOption(fabricanteSelectProps.valor);

    const familiaSelectProps = await utils.propsOptionSelect(page, selectFamilia, 1)
    await selectFamilia.selectOption(familiaSelectProps.valor);

    // Encontrar posição do Fabricante na tabela
    const headers = await page.locator('#tableModelos th').allTextContents();
    const indexFabricante = headers.indexOf('Fabricante')
    // BUG conhecido: "Família" na tabela está sem acento
    const indexFamilia = headers.indexOf('Família')

    expect(indexFabricante).toBeGreaterThan(-1);
    expect(indexFamilia).toBeGreaterThan(-1);

    // varrer todas as linhas para encontrar alguma célula com valor diferente
    const cellsFab = await page.locator(`#tableModelos td:nth-child(${indexFabricante + 1})`).all();
    const cellsFam = await page.locator(`#tableModelos td:nth-child(${indexFamilia + 1})`).all();
    for (const cell of cellsFab) {
        diferente = await cell.textContent() !== fabricanteSelectProps.texto || await cell.textContent() === null;
        if (diferente) break;
    }
    expect(diferente).toBe(false);

    for (const cell of cellsFam) {
        diferente = await cell.textContent() !== familiaSelectProps.texto || await cell.textContent() === null;
        if (diferente) break;
    }
    expect(diferente).toBe(false);
});
