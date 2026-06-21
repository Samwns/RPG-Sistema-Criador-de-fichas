import { test, expect } from '@playwright/test';

async function clearApplication(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#equipmentShop .shop-item')).toHaveCount(20);
}

async function setValue(page, selector, value, eventName = 'input') {
  await page.evaluate(({ selector, value, eventName }) => {
    const input = document.querySelector(selector);
    input.value = value;
    input.dispatchEvent(new Event(eventName, { bubbles: true }));
  }, { selector, value, eventName });
}

async function clickHidden(page, selector) {
  await page.evaluate(selector => document.querySelector(selector).click(), selector);
}

async function openTab(page, target) {
  await page.locator(`[data-target="${target}"]`).click();
  await expect(page.locator(`#${target}`)).toHaveClass(/active/);
}

async function readCharacters(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('savedCharacters') || '[]'));
}

test.beforeEach(async ({ page }) => {
  await clearApplication(page);
});

test('creates, uses and persists a martial character', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.fill('#nome', 'Brakka Punho de Ferro');
  await setValue(page, '#nivel', 5, 'change');
  await setValue(page, '#distFor', 9);
  await openTab(page, 'tab-habilidades');
  await page.fill('#tituloHabilidade', 'Golpe Quebra-Escudo');
  await page.fill('#descricaoHabilidade', 'Um ataque pesado para romper a defesa inimiga.');
  await clickHidden(page, '#addSkill');

  const energyBefore = Number(await page.inputValue('#currentMana'));
  await clickHidden(page, '#skillCollection button');
  await expect(page.locator('#resourceMessage')).toContainText('Golpe Quebra-Escudo');
  expect(Number(await page.inputValue('#currentMana'))).toBeLessThan(energyBefore);

  await openTab(page, 'tab-loja');
  const sword = page.locator('#equipmentShop .shop-item').filter({ hasText: 'Espada longa' });
  await sword.getByRole('button', { name: 'Pontos' }).click();
  await openTab(page, 'tab-inventario');
  await expect(page.locator('#inventoryList')).toContainText('Espada longa');
  await page.locator('#inventoryList .inventory-item').filter({ hasText: 'Espada longa' }).getByRole('button', { name: 'Equipar' }).click();
  await expect(page.locator('#equippedList')).toContainText('Espada longa');

  await clickHidden(page, '#saveCharacter');
  await openTab(page, 'tab-ficha');
  await page.fill('#historia', 'Sobreviveu a cinco arenas e ainda procura seu antigo grupo.');
  await page.waitForTimeout(400);
  await page.reload();

  const [character] = await readCharacters(page);
  expect(character.nome).toBe('Brakka Punho de Ferro');
  expect(character.historia).toContain('cinco arenas');
  expect(character.purchasedSkills).toHaveLength(1);
  expect(character.inventory).toContain('longsword');
  expect(character.equippedItems).toContain('longsword');
  expect(errors).toEqual([]);
});

test('creates a mage and persists purchased, prepared and custom spells', async ({ page }) => {
  await page.fill('#nome', 'Lyra das Sete Luzes');
  await setValue(page, '#classe1', 'Mago', 'change');
  await setValue(page, '#nivel', 5, 'change');
  await setValue(page, '#nivelC1', 5);
  await setValue(page, '#spellClassFilter', 'Mago', 'change');
  await openTab(page, 'tab-magia');
  await page.locator('[data-magic-target="magic-shop"]').click();

  const buySpell = page.locator('#spellCatalog button:not(:disabled)').filter({ hasText: 'Comprar' }).first();
  await buySpell.click();
  await expect(page.locator('#ownedSpells .spell-card')).toHaveCount(1);
  const spellName = await page.locator('#ownedSpells h4').innerText();
  await page.locator('#ownedSpells button').filter({ hasText: 'Usar' }).click();
  await expect(page.locator('#resourceMessage')).toContainText(spellName);
  await openTab(page, 'tab-magia');

  await page.fill('#customSpellName', 'Prisma de Lyra');
  await page.fill('#customSpellDescription', 'Dispara um feixe prismático criado para a campanha.');
  await clickHidden(page, '#addCustomSpell');
  await expect(page.locator('#customSpellList')).toContainText('Prisma de Lyra');

  const prepareButton = page.locator('#ownedSpells button').filter({ hasText: 'Preparar' });
  await prepareButton.click();
  await clickHidden(page, '#saveCharacter');
  await page.waitForTimeout(400);
  await page.reload();

  const [character] = await readCharacters(page);
  expect(character.classe1).toBe('Mago');
  expect(character.purchasedSpells).toHaveLength(1);
  expect(character.customSpells.map(spell => spell.name)).toContain('Prisma de Lyra');
  expect(Object.values(character.storedFields).some(value => value.includes(character.purchasedSpells[0]))).toBe(true);
});

test('creates a Shattered Rebirth character and persists death and starter items', async ({ page }) => {
  await setValue(page, '#sistema', 'SR', 'change');
  await page.fill('#nome', 'Iria Fragmento Rubro');
  await setValue(page, '#currentHp', 0);

  await expect(page.locator('#plagueValue')).toHaveText('1');
  await expect(page.locator('#resourceMessage')).toContainText('Você retorna');
  expect(Number(await page.inputValue('#currentHp'))).toBeGreaterThan(0);
  await clickHidden(page, '#saveCharacter');
  await page.waitForTimeout(400);
  await page.reload();

  const [character] = await readCharacters(page);
  expect(character.sistema).toBe('SR');
  expect(character.plagueScore).toBe(1);
  expect(character.inventory).toEqual(expect.arrayContaining(['glassheart_effigy', 'shardbane_tonic']));
});

test('keeps multiple characters independent and deletes only the selected one', async ({ page }) => {
  await page.fill('#nome', 'Aldren Guardiao');
  await clickHidden(page, '#saveCharacter');
  await clickHidden(page, '#newCharacter');
  await page.fill('#nome', 'Mira Passo Leve');
  await setValue(page, '#classe1', 'Ladino', 'change');
  await clickHidden(page, '#saveCharacter');

  let characters = await readCharacters(page);
  expect(characters.map(character => character.nome)).toEqual(['Aldren Guardiao', 'Mira Passo Leve']);

  await clickHidden(page, '.saved-card:first-child [data-action="load"]');
  await page.fill('#historia', 'Defensor da ponte do norte.');
  await page.waitForTimeout(400);
  characters = await readCharacters(page);
  expect(characters[0].historia).toContain('ponte do norte');
  expect(characters[1].historia).toBe('');

  page.once('dialog', dialog => dialog.accept());
  await clickHidden(page, '.saved-card:nth-child(2) [data-action="delete"]');
  characters = await readCharacters(page);
  expect(characters.map(character => character.nome)).toEqual(['Aldren Guardiao']);
  const deletedId = characters.find(character => character.nome === 'Mira Passo Leve')?.id;
  const localCopies = await page.evaluate(() => [
    localStorage.getItem('savedCharactersBackup'),
    localStorage.getItem('deletedCharactersBackup'),
    localStorage.getItem('lastCharacterDraft'),
    localStorage.getItem('lastCharacterDraftBackup')
  ].filter(Boolean).join(' '));
  expect(localCopies).not.toContain(deletedId || 'Mira Passo Leve');
});

test('buys and sells every store item when the character has enough gold', async ({ page }) => {
  await setValue(page, '#goldAmount', 10_000);
  const result = await page.evaluate(() => {
    const names = [...document.querySelectorAll('#equipmentShop h4')].map(title => title.textContent);
    const failed = [];
    for (const name of names) {
      const card = [...document.querySelectorAll('#equipmentShop .shop-item')]
        .find(item => item.querySelector('h4').textContent === name);
      const buy = [...card.querySelectorAll('button')].find(button => button.textContent === 'Gold');
      if (!buy || buy.disabled) {
        failed.push(`${name}: compra indisponivel`);
        continue;
      }
      buy.click();
      const row = [...document.querySelectorAll('#inventoryList .inventory-item, #consumableList .inventory-item')]
        .find(item => item.textContent.includes(name));
      const sell = row && [...row.querySelectorAll('button')].find(button => button.textContent === 'Vender');
      if (!sell) failed.push(`${name}: nao entrou no inventario`);
      else sell.click();
    }
    return { total: names.length, failed };
  });

  expect(result.total).toBeGreaterThan(15);
  expect(result.failed).toEqual([]);
});

test('consumes one-use items, refunds sales and clamps combat resources', async ({ page }) => {
  await setValue(page, '#goldAmount', 1_000);
  await openTab(page, 'tab-loja');

  const potion = page.locator('#equipmentShop .shop-item').filter({ hasText: 'Poção de cura' });
  await potion.getByRole('button', { name: 'Gold' }).click();
  expect(Number(await page.inputValue('#goldAmount'))).toBe(970);
  await openTab(page, 'tab-inventario');
  await page.locator('#consumableList .inventory-item').filter({ hasText: 'Poção de cura' }).getByRole('button', { name: 'Usar' }).click();
  await expect(page.locator('#consumableList')).not.toContainText('Poção de cura');

  await openTab(page, 'tab-loja');
  const sword = page.locator('#equipmentShop .shop-item').filter({ hasText: 'Espada longa' });
  await sword.getByRole('button', { name: 'Gold' }).click();
  expect(Number(await page.inputValue('#goldAmount'))).toBe(910);
  await openTab(page, 'tab-inventario');
  await page.locator('#inventoryList .inventory-item').filter({ hasText: 'Espada longa' }).getByRole('button', { name: 'Vender' }).click();
  expect(Number(await page.inputValue('#goldAmount'))).toBe(970);

  await openTab(page, 'tab-magia');
  await setValue(page, '#resourceAmount', 999);
  await page.getByRole('button', { name: 'Receber dano' }).click();
  expect(Number(await page.inputValue('#currentHp'))).toBe(0);
  await page.getByRole('button', { name: 'Receber cura' }).click();
  expect(Number(await page.inputValue('#currentHp'))).toBe(Number(await page.locator('#combatHp').innerText()));
  await page.getByRole('button', { name: /Gastar/ }).click();
  expect(Number(await page.inputValue('#currentMana'))).toBe(0);
  await page.getByRole('button', { name: /Recuperar/ }).click();
  expect(Number(await page.inputValue('#currentMana'))).toBe(Number(await page.locator('#maxMana').innerText()));
});
