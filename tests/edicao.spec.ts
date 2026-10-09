import { test, expect } from '@playwright/test';
import utils from '../utils';

test('CT-026 - Editar modelo', async ({ page }) => {
    await utils.acessarTelaModelos(page)

    const primeiraLinha = page.locator('#tableModelos tbody tr').first()
    const nomeOriginal = await primeiraLinha.locator('td').nth(3).textContent()

    const dialog = await utils.abrirDialogEdicao(page, primeiraLinha)

    const inputModelo = utils.campoPorLabel(dialog, 'Modelo')
    await inputModelo.clear()
    await inputModelo.fill('Modelo Editado CT26')

    await dialog.locator('#btnSalvar').click()
    await expect(dialog).not.toBeVisible()

    // Novo valor deve aparecer na tabela
    await expect(
        page.locator('#tableModelos tbody td').filter({ hasText: 'Modelo Editado CT26' })
    ).toBeVisible()

    // Valor antigo não deve mais estar na linha editada
    const nomeAtualizado = await primeiraLinha.locator('td').nth(3).textContent()
    expect(nomeAtualizado).not.toBe(nomeOriginal)
});

test('CT-027 - Verificar dados apresentados na edição', async ({ page }) => {
    await utils.acessarTelaModelos(page)

    const primeiraLinha = page.locator('#tableModelos tbody tr').first()
    const fabricanteTabela = await primeiraLinha.locator('td').nth(1).textContent()
    const modeloTabela = await primeiraLinha.locator('td').nth(3).textContent()
    const combustivelTabela = await primeiraLinha.locator('td').nth(4).textContent()

    const dialog = await utils.abrirDialogEdicao(page, primeiraLinha)

    // Campo Modelo deve apresentar o valor cadastrado
    await expect(utils.campoPorLabel(dialog, 'Modelo')).toHaveValue(modeloTabela!.trim())

    // Fabricante selecionado deve corresponder ao da tabela
    const selectedFab = dialog.locator('#novoFabricante option:checked')
    const textoFabricante = await selectedFab.textContent()
    expect(textoFabricante?.trim()).toBe(fabricanteTabela!.trim())

    // Combustível exibido no formulário deve corresponder ao da tabela
    // Bug conhecido: combustível pode não ser apresentado corretamente
    const selectedComb = dialog.locator('select').nth(2).locator('option:checked')
    const textoCombustivel = await selectedComb.textContent()
    expect(textoCombustivel?.trim()).toBe(combustivelTabela!.trim())
});

test('CT-028 - Cancelar edição', async ({ page }) => {
    await utils.acessarTelaModelos(page)

    const primeiraLinha = page.locator('#tableModelos tbody tr').first()
    const nomeOriginal = await primeiraLinha.locator('td').nth(3).textContent()

    const dialog = await utils.abrirDialogEdicao(page, primeiraLinha)

    // Alterar o campo mas não salvar
    const inputModelo = utils.campoPorLabel(dialog, 'Modelo')
    await inputModelo.clear()
    await inputModelo.fill('Alteração que não deve ser salva')

    await dialog.locator('#btnCancelar').click()
    await expect(dialog).not.toBeVisible()

    // Valor original deve continuar na tabela
    const nomeAposCancelar = await primeiraLinha.locator('td').nth(3).textContent()
    expect(nomeAposCancelar?.trim()).toBe(nomeOriginal?.trim())
});

test('CT-029 - Título do formulário de edição', async ({ page }) => {
    await utils.acessarTelaModelos(page)

    const primeiraLinha = page.locator('#tableModelos tbody tr').first()
    const dialog = await utils.abrirDialogEdicao(page, primeiraLinha)

    // Título deve indicar que é uma edição, não um novo cadastro
    // Bug conhecido: o sistema exibe "Novo modelo" mesmo durante uma edição
    const titulo = dialog.locator('.modal-title')
    await expect(titulo).not.toHaveText('Novo modelo')
});
