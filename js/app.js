import {
  raceOptions,
  originOptions,
  classOptions,
  distInputs,
  raceBonusInputs,
  computeProfBonus,
  computeModifier,
  getRemainingPoints,
  requiredMagicLife,
  classData,
  xpThresholds,
  getXpProgress,
  getSubclassOptions,
  getMulticlassRequirement
} from './modules/mechanics.js';
import { spellCatalog, spellcastingClasses } from './modules/gameData.js';
import {
  elements,
  populateSelect,
  updateBudgetText,
  updateTotals,
  updateMagicLifeUI,
  renderSummary,
  setupTabs,
  animateRollButton
} from './modules/ui.js';
import { initDiceRoller, rollDice } from './modules/diceRoller.js';

let purchasedSkills = [];
let skillPhoto = '';
let editingSkillIndex = -1;
let bannerPhoto = '';
let inventory = [];
let themeColors = { primary: '#7EBAEE', secondary: '#F0A06F' };

const equipmentCatalog = [
  { id: 'longsword', name: 'Espada longa', category: 'Arma', cost: 6, die: 8, attribute: 'for', range: 'corpo a corpo', description: 'Arma versátil de corte.' },
  { id: 'shortbow', name: 'Arco curto', category: 'Arma', cost: 6, die: 6, attribute: 'dex', range: '24 m', description: 'Arma leve para ataques à distância.' },
  { id: 'dagger', name: 'Adaga', category: 'Arma', cost: 3, die: 4, attribute: 'dex', range: '6 m', description: 'Arma leve e arremessável.' },
  { id: 'greatsword', name: 'Espadão', category: 'Arma', cost: 9, die: 12, attribute: 'for', range: 'corpo a corpo', description: 'Arma pesada de duas mãos.' },
  { id: 'shield', name: 'Escudo', category: 'Armadura', cost: 5, armorBonus: 2, description: '+2 na classe de armadura.' },
  { id: 'leather', name: 'Armadura de couro', category: 'Armadura', cost: 5, armorBase: 11, dexterity: true, description: 'CA 11 + modificador de DEX.' },
  { id: 'chain', name: 'Cota de malha', category: 'Armadura', cost: 9, armorBase: 16, description: 'Define a CA base como 16.' },
  { id: 'healing', name: 'Poção de cura', category: 'Consumível', cost: 3, die: 4, healing: true, description: 'Recupera 2d4 + 2 pontos de vida.' },
  { id: 'rope', name: 'Corda de 15 m', category: 'Aventura', cost: 2, description: 'Ferramenta para exploração.' },
  { id: 'tools', name: 'Kit de ferramentas', category: 'Aventura', cost: 4, description: 'Ferramentas para testes especializados.' }
];

const raceBonuses = {
  'Forjado Bélico': { con: 2, for: 1 },
  'Autognomo': { int: 2, con: 1 },
  'Elfo da Floresta': { dex: 2, sab: 1 },
  'Alto Elfo': { dex: 2, int: 1 },
  'Drow': { dex: 2, car: 1 },
  'Gnomo das Rochas': { int: 2, con: 1 },
  'Gnomo da Floresta': { int: 2, sab: 1 },
  'Homem-Rato': { dex: 2, int: 1 },
  'Minotauro': { for: 2, con: 1 },
  'Lizardfolk': { con: 2, for: 1 },
  'Tabaxi': { dex: 2, car: 1 },
  'Halfling': { dex: 2, sab: 1 },
  'Goliata': { for: 2, con: 1 },
  'Firbolg': { sab: 2, int: 1 },
  'Orc': { for: 2, con: 1 },
  'Goblinoide': { dex: 2, int: 1 },
  'Bugbear': { for: 2, sab: 1 },
  'Tiefling': { car: 2, int: 1 },
  'Dragonborn': { for: 2, car: 1 },
  'Anão': { con: 2, for: 1 }
};

function getInputValues() {
  return distInputs.map(item => Number(document.getElementById(item.id).value || 0));
}

function formatSigned(value) {
  return Number(value) >= 0 ? `+ ${Number(value)}` : `- ${Math.abs(Number(value))}`;
}

function openDiceTab() {
  document.querySelector('[data-target="tab-dados"]')?.click();
}

function applySelectedRaceBonuses() {
  const bonuses = raceBonuses[elements.raca.value] || {};
  const inputs = {
    for: 'raceFor',
    dex: 'raceDex',
    con: 'raceCon',
    int: 'raceInt',
    sab: 'raceSab',
    car: 'raceCar'
  };
  Object.entries(inputs).forEach(([attribute, id]) => {
    document.getElementById(id).value = bonuses[attribute] || 0;
  });
  synchronize();
}

function updateDistribuicaoLimits() {
  const remaining = getRemainingPoints(elements.nivel.value, getInputValues()).remaining;
  distInputs.forEach(item => {
    const input = document.getElementById(item.id);
    const currentValue = Number(input.value || 0);
    input.max = Math.min(15, Math.max(0, currentValue + remaining));
    if (currentValue > Number(input.max)) {
      input.value = input.max;
    }
  });
}

function getTotals() {
  const raceBonus = raceBonusInputs.map(item => Number(document.getElementById(item.id).value || 0));
  return distInputs.map((item, index) => {
    const dist = Number(document.getElementById(item.id).value || 0);
    return 10 + dist + raceBonus[index];
  });
}

function clampAttributeValues(changedId) {
  const { remaining } = getRemainingPoints(elements.nivel.value, getInputValues());
  if (remaining < 0) {
    const input = document.getElementById(changedId);
    const currentValue = Number(input.value || 0);
    const overflow = -remaining;
    input.value = Math.max(0, currentValue - overflow);
  }
}

function handleRoll(type) {
  const button = document.querySelector(`button[data-type="${type}"]`);
  if (button) animateRollButton(button);

  const prof = Number(elements.profBonus.value.toString().replace('+', '')) || 0;
  const mods = {
    for: Number(elements.modFor.textContent.replace('+', '')),
    dex: Number(elements.modDex.textContent.replace('+', '')),
    int: Number(elements.modInt.textContent.replace('+', '')),
    sab: Number(elements.modSab.textContent.replace('+', '')),
    car: Number(elements.modCar.textContent.replace('+', ''))
  };

  let modifier = 0;
  let label = '';

  switch (type) {
    case 'for':
      modifier = mods.for + prof;
      label = 'Ataque físico';
      break;
    case 'dex':
      modifier = mods.dex + prof;
      label = 'Ataque à distância';
      break;
    case 'dexNoProf':
      modifier = mods.dex;
      label = 'Esquiva';
      break;
    case 'int':
      modifier = mods.int + prof;
      label = 'Ataque mágico';
      break;
    default:
      return;
  }

  openDiceTab();
  rollDice({
    sides: 20,
    count: 1,
    modifier,
    label,
    onComplete: ({ results, total }) => {
      elements.rollResult.innerHTML = `<span class="dice-icon">${results[0]}</span><span>${label}: ${total} (d20 ${results[0]} ${formatSigned(modifier)})</span>`;
    }
  });
}

function resetFicha() {
  elements.nome.value = '';
  elements.jogador.value = '';
  elements.sistema.value = 'D&D';
  elements.nivel.value = 1;
  elements.xp.value = 0;
  elements.vidaMaxima.value = 30;
  document.getElementById('currentHp').value = 30;
  document.getElementById('armorClass').value = 10;
  document.getElementById('speed').value = '9 m';
  document.getElementById('vision').value = 'normal';
  document.getElementById('hitDie').value = 'd10';
  document.getElementById('castingStat').value = 'int';
  document.getElementById('spellSlots').value = 0;
  elements.multiclasse.checked = false;
  elements.nivelC1.value = 1;
  elements.nivelC2.value = 1;
  elements.nivelC3.value = 0;
  distInputs.forEach(input => document.getElementById(input.id).value = 0);
  raceBonusInputs.forEach(input => document.getElementById(input.id).value = 0);
  elements.tituloHabilidade.value = '';
  elements.descricaoHabilidade.value = '';
  elements.descricaoClasse.value = '';
  purchasedSkills = [];
  inventory = [];
  bannerPhoto = '';
  applyDynamicTheme('#7EBAEE', '#F0A06F');
  resetSkillEditor();
  document.getElementById('skillRaca').value = '';
  document.getElementById('skillClasse1').value = '';
  document.getElementById('skillClasse2').value = '';
  document.getElementById('skillClasse3').value = '';
  document.getElementById('pericia1').value = '';
  document.getElementById('pericia2').value = '';
  elements.pontosMagia.value = 15;
  elements.pontosVida.value = 15;
  elements.historia.value = '';
  elements.habilidades.value = '';
  elements.photoInput.value = '';
  elements.photoPreview.innerHTML = 'Preview da foto';
  elements.photoPreview.dataset.photo = '';
  elements.photoPreview.innerHTML = 'Adicione a imagem do personagem';
  document.getElementById('bannerInput').value = '';
  applyBanner('');
  elements.rollResult.textContent = 'Clique em uma rolagem para ver o resultado.';
  document.querySelectorAll('[data-store]').forEach(input => {
    input.value = input.classList.contains('slot-counter') ? '0 / 0' : '';
  });
  renderEquipment();
  synchronize();
}

function getSkillLimit() {
  const level = Math.max(1, Number(elements.nivel.value) || 1);
  const distributedPoints = getInputValues().reduce((sum, value) => sum + value, 0);
  return Math.min(level, Math.floor(distributedPoints / 3));
}

function updateSkillBudget() {
  const limit = getSkillLimit();
  const used = purchasedSkills.length;
  const available = Math.max(0, limit - used);
  document.getElementById('skillLimit').textContent = limit;
  document.getElementById('skillUsed').textContent = used;
  document.getElementById('skillAvailable').textContent = available;

  const addButton = document.getElementById('addSkill');
  addButton.disabled = editingSkillIndex < 0 && available === 0;
  addButton.title = available === 0 && editingSkillIndex < 0
    ? 'Distribua mais pontos de atributo ou aumente o nível.'
    : '';
}

function resetSkillEditor() {
  skillPhoto = '';
  editingSkillIndex = -1;
  elements.tituloHabilidade.value = '';
  elements.descricaoHabilidade.value = '';
  document.getElementById('skillPhotoInput').value = '';
  document.getElementById('skillPhotoPreview').textContent = 'Foto da habilidade';
  document.getElementById('addSkill').textContent = 'Adicionar habilidade';
  document.getElementById('cancelSkillEdit').classList.add('hidden');
  document.getElementById('skillMessage').textContent = '';
}

function renderSkillCollection() {
  const collection = document.getElementById('skillCollection');
  collection.innerHTML = '';

  if (purchasedSkills.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'system-rule';
    empty.textContent = 'Nenhuma habilidade comprada ainda.';
    collection.appendChild(empty);
  }

  purchasedSkills.forEach((skill, index) => {
    const card = document.createElement('article');
    card.className = 'skill-card';

    const image = document.createElement('div');
    image.className = 'skill-card-image';
    if (skill.photo) {
      const img = document.createElement('img');
      img.src = skill.photo;
      img.alt = `Imagem da habilidade ${skill.name}`;
      image.appendChild(img);
    } else {
      image.textContent = String(index + 1).padStart(2, '0');
    }

    const copy = document.createElement('div');
    copy.className = 'skill-card-copy';
    const title = document.createElement('h4');
    title.textContent = skill.name;
    const description = document.createElement('p');
    description.textContent = skill.description;

    const actions = document.createElement('div');
    actions.className = 'skill-card-actions';
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => editSkill(index));
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Excluir';
    deleteButton.addEventListener('click', () => {
      purchasedSkills.splice(index, 1);
      if (editingSkillIndex === index) resetSkillEditor();
      renderSkillCollection();
      updateSkillBudget();
    });

    actions.append(editButton, deleteButton);
    copy.append(title, description, actions);
    card.append(image, copy);
    collection.appendChild(card);
  });

  const featured = purchasedSkills[0];
  if (featured) {
    elements.summaryAbilityTitle.textContent = featured.name;
    elements.summaryAbilityDesc.textContent = featured.description;
  }
}

function updateFeaturedSkillSummary() {
  const featured = purchasedSkills[0];
  if (!featured) return;
  elements.summaryAbilityTitle.textContent = featured.name;
  elements.summaryAbilityDesc.textContent = featured.description;
}

function editSkill(index) {
  const skill = purchasedSkills[index];
  if (!skill) return;
  editingSkillIndex = index;
  skillPhoto = skill.photo || '';
  elements.tituloHabilidade.value = skill.name;
  elements.descricaoHabilidade.value = skill.description;
  const preview = document.getElementById('skillPhotoPreview');
  preview.innerHTML = skillPhoto
    ? `<img src="${skillPhoto}" alt="Imagem da habilidade">`
    : 'Foto da habilidade';
  document.getElementById('addSkill').textContent = 'Salvar alterações';
  document.getElementById('cancelSkillEdit').classList.remove('hidden');
  document.getElementById('skillMessage').textContent = '';
  document.querySelector('.skill-builder').scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateSkillBudget();
}

function saveSkillFromEditor() {
  const name = elements.tituloHabilidade.value.trim();
  const description = elements.descricaoHabilidade.value.trim();
  const message = document.getElementById('skillMessage');

  if (!name || !description) {
    message.textContent = 'Preencha o nome e a descrição da habilidade.';
    return;
  }

  if (editingSkillIndex < 0 && purchasedSkills.length >= getSkillLimit()) {
    message.textContent = 'Sem pontos disponíveis. Distribua 3 pontos de atributo ou aumente o nível.';
    return;
  }

  const skill = {
    id: editingSkillIndex >= 0
      ? purchasedSkills[editingSkillIndex].id
      : (crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`),
    name,
    description,
    photo: skillPhoto
  };

  if (editingSkillIndex >= 0) purchasedSkills[editingSkillIndex] = skill;
  else purchasedSkills.push(skill);

  resetSkillEditor();
  renderSkillCollection();
  updateSkillBudget();
}

function getEquipmentBudget() {
  return 10 + (Math.max(1, Number(elements.nivel.value) || 1) * 2);
}

function getEquipmentSpent() {
  return inventory.reduce((sum, itemId) => {
    return sum + (equipmentCatalog.find(item => item.id === itemId)?.cost || 0);
  }, 0);
}

function buyEquipment(itemId) {
  const item = equipmentCatalog.find(entry => entry.id === itemId);
  if (!item || inventory.includes(itemId)) return;
  if (getEquipmentSpent() + item.cost > getEquipmentBudget()) return;
  inventory.push(itemId);
  renderEquipment();
  synchronize();
}

function sellEquipment(itemId) {
  inventory = inventory.filter(id => id !== itemId);
  renderEquipment();
  synchronize();
}

function renderEquipment() {
  const shop = document.getElementById('equipmentShop');
  const inventoryList = document.getElementById('inventoryList');
  if (!shop || !inventoryList) return;

  const budget = getEquipmentBudget();
  const spent = getEquipmentSpent();
  document.getElementById('equipmentBudget').textContent = budget;
  document.getElementById('equipmentSpent').textContent = spent;
  document.getElementById('equipmentRemaining').textContent = Math.max(0, budget - spent);

  shop.innerHTML = '';
  equipmentCatalog.forEach(item => {
    const owned = inventory.includes(item.id);
    const card = document.createElement('article');
    card.className = 'shop-item';
    card.innerHTML = `
      <span>${item.category}</span>
      <h4>${item.name}</h4>
      <p>${item.description}</p>
      <div><b>${item.cost} pts</b></div>
    `;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = owned ? 'Comprado' : 'Comprar';
    button.disabled = owned || spent + item.cost > budget;
    button.addEventListener('click', () => buyEquipment(item.id));
    card.querySelector('div').appendChild(button);
    shop.appendChild(card);
  });

  inventoryList.innerHTML = '';
  if (inventory.length === 0) {
    inventoryList.innerHTML = '<p class="system-rule">Nenhum item comprado.</p>';
  }
  inventory.forEach(itemId => {
    const item = equipmentCatalog.find(entry => entry.id === itemId);
    if (!item) return;
    const row = document.createElement('article');
    row.className = 'inventory-item';
    row.innerHTML = `<div><b>${item.name}</b><span>${item.category} · ${item.description}</span></div>`;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Vender';
    button.addEventListener('click', () => sellEquipment(item.id));
    row.appendChild(button);
    inventoryList.appendChild(row);
  });

  renderWeaponList();
}

function renderWeaponList() {
  const weaponList = document.getElementById('weaponList');
  if (!weaponList) return;
  const weapons = inventory
    .map(itemId => equipmentCatalog.find(item => item.id === itemId))
    .filter(item => item?.category === 'Arma');

  weaponList.innerHTML = '';
  if (weapons.length === 0) {
    weaponList.innerHTML = '<p class="system-rule">Compre armas na aba Equipamento para usá-las aqui.</p>';
    return;
  }

  weapons.forEach(weapon => {
    const modifier = getAttributeModifier(weapon.attribute);
    const proficiency = Number(elements.profBonus.value.replace('+', '')) || 0;
    const attackBonus = modifier + proficiency;
    const card = document.createElement('article');
    card.className = 'weapon-card';
    card.innerHTML = `
      <h4>${weapon.name}</h4>
      <div class="weapon-tags">
        <span>Ataque ${formatSigned(attackBonus)}</span>
        <span>Dano 1d${weapon.die} ${formatSigned(modifier)}</span>
        <span>${weapon.range}</span>
      </div>
    `;
    const actions = document.createElement('div');
    actions.className = 'weapon-actions';
    const attackButton = document.createElement('button');
    attackButton.type = 'button';
    attackButton.textContent = 'Rolar ataque';
    attackButton.addEventListener('click', () => {
      openDiceTab();
      rollDice({
        sides: 20,
        count: 1,
        modifier: attackBonus,
        label: `Ataque com ${weapon.name}`,
        onComplete: ({ results, total }) => {
          elements.rollResult.innerHTML = `<span class="dice-icon">${results[0]}</span><span>${weapon.name}: ataque ${total}</span>`;
        }
      });
    });
    const damageButton = document.createElement('button');
    damageButton.type = 'button';
    damageButton.textContent = 'Rolar dano';
    damageButton.addEventListener('click', () => {
      openDiceTab();
      rollDice({
        sides: weapon.die,
        count: 1,
        modifier,
        label: `Dano de ${weapon.name}`,
        onComplete: ({ results, total }) => {
          elements.rollResult.innerHTML = `<span class="dice-icon">${results[0]}</span><span>${weapon.name}: dano ${total}</span>`;
        }
      });
    });
    actions.append(attackButton, damageButton);
    card.appendChild(actions);
    weaponList.appendChild(card);
  });
}

function getAttributeModifier(attribute) {
  const labels = {
    for: elements.modFor,
    dex: elements.modDex,
    int: elements.modInt,
    sab: elements.modSab,
    car: elements.modCar
  };
  return Number(labels[attribute]?.textContent.replace('+', '')) || 0;
}

function getCalculatedArmorClass() {
  const manual = Number(document.getElementById('armorClass').value) || 10;
  const dexterity = getAttributeModifier('dex');
  let calculated = manual;
  inventory.forEach(itemId => {
    const item = equipmentCatalog.find(entry => entry.id === itemId);
    if (!item) return;
    if (item.armorBase) calculated = Math.max(calculated, item.armorBase + (item.dexterity ? dexterity : 0));
    if (item.armorBonus) calculated += item.armorBonus;
  });
  return calculated;
}

function applyBanner(photo) {
  bannerPhoto = photo || '';
  const heroWave = document.getElementById('heroWave');
  heroWave.classList.toggle('has-banner', Boolean(bannerPhoto));
  heroWave.style.setProperty('--banner-image', bannerPhoto ? `url("${bannerPhoto}")` : 'none');
}

function applyDynamicTheme(primary, secondary) {
  themeColors = { primary, secondary };
  document.documentElement.style.setProperty('--blue', primary);
  document.documentElement.style.setProperty('--orange', secondary);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', primary);
}

function updateProgression() {
  const progress = getXpProgress(elements.xp.value);
  elements.nivel.value = progress.level;
  const bar = document.getElementById('xpProgress');
  bar.max = progress.needed;
  bar.value = progress.level === 20 ? progress.needed : progress.earned;
  document.getElementById('xpLevelLabel').textContent = `Nível ${progress.level}`;
  document.getElementById('xpNextLabel').textContent = progress.level === 20
    ? 'Nível máximo alcançado'
    : `${progress.remaining.toLocaleString('pt-BR')} XP para o nível ${progress.level + 1}`;
  if (!elements.multiclasse.checked) elements.nivelC1.value = progress.level;
}

function updateSubclassSelect(classSelect, levelInput, subclassSelect) {
  const previous = subclassSelect.value;
  const classLevel = Math.max(0, Number(levelInput.value) || 0);
  const unlocked = classLevel >= 3;
  subclassSelect.innerHTML = unlocked
    ? getSubclassOptions(classSelect.value).map(option => `<option value="${option}">${option}</option>`).join('')
    : `<option value="">${classLevel === 0 ? 'Classe opcional inativa' : 'Liberada no nível 3 da classe'}</option>`;
  subclassSelect.disabled = !unlocked;
  if (unlocked && [...subclassSelect.options].some(option => option.value === previous)) {
    subclassSelect.value = previous;
  }
}

function updateClassProgression() {
  const groups = [
    [elements.classe1, elements.nivelC1, document.getElementById('subclasse1')],
    [elements.classe2, elements.nivelC2, document.getElementById('subclasse2')],
    [elements.classe3, elements.nivelC3, document.getElementById('subclasse3')]
  ];
  groups.forEach(group => updateSubclassSelect(...group));

  const activeGroups = elements.multiclasse.checked
    ? groups.filter(([, input], index) => index < 2 || Number(input.value) > 0)
    : groups.slice(0, 1);
  const levelSum = activeGroups.reduce((sum, [, input]) => sum + (Number(input.value) || 0), 0);
  const totalLevel = Number(elements.nivel.value) || 1;
  const totals = getTotals();
  const scores = { for: totals[0], dex: totals[1], con: totals[2], int: totals[3], sab: totals[4], car: totals[5] };
  const problems = [];

  if (levelSum !== totalLevel) {
    problems.push(`Distribua exatamente ${totalLevel} nível(is) entre as classes; agora a soma é ${levelSum}.`);
  }
  if (new Set(activeGroups.map(([select]) => select.value)).size !== activeGroups.length) {
    problems.push('Escolha classes diferentes para a multiclasse.');
  }
  if (elements.multiclasse.checked) {
    activeGroups.forEach(([select]) => {
      const requirements = getMulticlassRequirement(select.value);
      const requiredAll = requirements.all || [];
      const requiredAny = requirements.any || [];
      const valid = requiredAll.every(attribute => scores[attribute] >= 13)
        && (!requiredAny.length || requiredAny.some(attribute => scores[attribute] >= 13));
      if (!valid) {
        const labels = requiredAll.length
          ? requiredAll.map(attribute => attribute.toUpperCase()).join(' e ')
          : requiredAny.map(attribute => attribute.toUpperCase()).join(' ou ');
        problems.push(`${select.value} exige ${labels} 13 para multiclasse.`);
      }
    });
  }

  document.getElementById('multiclassWarning').textContent = problems.join(' ');
  document.getElementById('hitDie').value = classData[elements.classe1.value]?.hitDie || 'd10';
}

function renderSpellCatalog() {
  const className = document.getElementById('spellClassFilter').value;
  const levelFilter = document.getElementById('spellLevelFilter').value;
  const catalog = document.getElementById('spellCatalog');
  const spells = spellCatalog.filter(spell => {
    return spell.classes.includes(className) && (levelFilter === 'all' || spell.level === Number(levelFilter));
  });
  catalog.innerHTML = '';
  if (!spells.length) {
    catalog.innerHTML = '<p class="system-rule">Nenhuma magia disponível para esse filtro.</p>';
    return;
  }
  spells.forEach(spell => {
    const card = document.createElement('article');
    card.className = 'spell-card';
    card.innerHTML = `<span>${spell.level === 0 ? 'Truque' : `${spell.level}º círculo`} · ${spell.school}</span><h4>${spell.name}</h4>`;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Preparar';
    button.addEventListener('click', () => prepareSpell(spell));
    card.appendChild(button);
    catalog.appendChild(card);
  });
}

function prepareSpell(spell) {
  const textarea = document.querySelector(`[data-store="spell-${spell.level}"]`);
  if (!textarea) return;
  const current = textarea.value.split('\n').map(value => value.trim()).filter(Boolean);
  if (!current.includes(spell.name)) current.push(spell.name);
  textarea.value = current.join('\n');
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function extractThemeFromImage(source) {
  if (!source) return;
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = 64;
    canvas.height = 64;
    context.drawImage(image, 0, 0, 64, 64);
    const data = context.getImageData(0, 0, 64, 64).data;
    const colors = [];

    for (let index = 0; index < data.length; index += 64) {
      const [r, g, b, alpha] = [data[index], data[index + 1], data[index + 2], data[index + 3]];
      if (alpha < 180) continue;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max - min;
      const brightness = (r + g + b) / 3;
      if (saturation < 28 || brightness < 35 || brightness > 235) continue;
      colors.push({ r, g, b, saturation, brightness });
    }

    if (colors.length < 2) return;
    colors.sort((a, b) => b.saturation - a.saturation);
    const primary = colors[0];
    const secondary = colors
      .slice(1)
      .sort((a, b) => themeColorScore(b, primary) - themeColorScore(a, primary))[0];
    applyDynamicTheme(rgbToHex(primary), rgbToHex(secondary));
  };
  image.src = source;
}

function colorDistance(a, b) {
  return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
}

function themeColorScore(color, primary) {
  return (colorDistance(color, primary) * 3)
    + (color.saturation * .8)
    - (Math.abs(color.brightness - 155) * 1.2);
}

function rgbToHex({ r, g, b }) {
  const brightness = (r + g + b) / 3;
  const scale = brightness > 205 ? 205 / brightness : brightness < 75 ? 75 / brightness : 1;
  return `#${[r, g, b].map(value => {
    return Math.min(255, Math.round(value * scale)).toString(16).padStart(2, '0');
  }).join('')}`;
}

function updateSpellStats() {
  const castingStat = document.getElementById('castingStat').value;
  const modifier = getAttributeModifier(castingStat);
  const proficiency = Number(elements.profBonus.value.replace('+', '')) || 0;
  const labels = { int: 'INT', sab: 'SAB', car: 'CAR' };
  document.getElementById('spellSaveDc').textContent = 8 + proficiency + modifier;
  document.getElementById('spellAttackBonus').textContent = formatSigned(proficiency + modifier).replace(' ', '');
  document.getElementById('spellCastingStat').textContent = labels[castingStat];
  document.getElementById('spellSlotTotal').textContent = document.getElementById('spellSlots').value || 0;
}

function synchronize() {
  updateProgression();
  elements.profBonus.value = computeProfBonus(elements.nivel.value);
  updateBudgetText(getRemainingPoints(elements.nivel.value, getInputValues()));
  updateDistribuicaoLimits();
  updateTotals(getTotals());
  updateMagicLifeUI(elements.pontosMagia.value, elements.pontosVida.value, elements.nivel.value);
  renderSummary();
  updateFeaturedSkillSummary();
  updateSkillBudget();
  updateSpellStats();
  updateClassProgression();
  renderEquipment();

  const combatHp = document.getElementById('combatHp');
  const combatProf = document.getElementById('combatProf');
  const combatInit = document.getElementById('combatInit');
  const combatDefense = document.getElementById('combatDefense');
  if (combatHp) combatHp.textContent = elements.vidaMaxima.value || 0;
  if (combatProf) combatProf.textContent = elements.profBonus.value;
  if (combatInit) combatInit.textContent = elements.modDex.textContent;
  if (combatDefense) combatDefense.textContent = getCalculatedArmorClass();
  document.getElementById('combatSpeed').textContent = document.getElementById('speed').value || '-';
  document.getElementById('combatVision').textContent = document.getElementById('vision').value || '-';
  document.getElementById('combatHitDie').textContent = document.getElementById('hitDie').value;
}

function loadSavedCharacters() {
  const saved = JSON.parse(localStorage.getItem('savedCharacters') || '[]');
  elements.savedList.innerHTML = saved.length === 0 ? '<p>Nenhum personagem salvo.</p>' : '';
  saved.forEach((character, index) => {
    const card = document.createElement('div');
    card.className = 'saved-card';
    if (character.banner) {
      card.style.setProperty('--saved-banner', `url("${character.banner}")`);
      card.classList.add('has-saved-banner');
    }

    const header = document.createElement('div');
    header.className = 'saved-card-header';
    header.innerHTML = `<strong>${character.nome || 'Personagem sem nome'} (${character.sistema || 'D&D'})</strong>`;

    const controls = document.createElement('div');
    controls.className = 'saved-card-controls';
    controls.innerHTML = `
      <button type="button" data-action="load" data-index="${index}">Carregar</button>
      <button type="button" data-action="delete" data-index="${index}">Excluir</button>
    `;

    header.appendChild(controls);
    card.appendChild(header);

    const details = document.createElement('div');
    details.innerHTML = `
      <p><strong>Raça:</strong> ${character.raca || '-'}</p>
      <p><strong>Classe:</strong> ${character.classe1 || '-'}</p>
      <p><strong>História:</strong> ${character.historia ? character.historia.slice(0, 120) + '...' : '-'}</p>
    `;
    card.appendChild(details);

    if (character.photo) {
      const img = document.createElement('img');
      img.src = character.photo;
      img.alt = `Retrato de ${character.nome}`;
      img.className = 'saved-photo';
      card.appendChild(img);
    }

    elements.savedList.appendChild(card);
  });

  document.querySelectorAll('[data-action="load"]').forEach(button => {
    button.addEventListener('click', event => {
      const index = Number(event.target.dataset.index);
      loadCharacter(index);
      const tab = document.querySelector('[data-target="tab-ficha"]');
      if (tab) tab.click();
    });
  });

  document.querySelectorAll('[data-action="delete"]').forEach(button => {
    button.addEventListener('click', event => {
      const index = Number(event.target.dataset.index);
      deleteCharacter(index);
    });
  });
}

function saveCharacter() {
  const current = getCharacterData();
  const saved = JSON.parse(localStorage.getItem('savedCharacters') || '[]');
  saved.push(current);
  localStorage.setItem('savedCharacters', JSON.stringify(saved));
  loadSavedCharacters();
}

function deleteCharacter(index) {
  const saved = JSON.parse(localStorage.getItem('savedCharacters') || '[]');
  saved.splice(index, 1);
  localStorage.setItem('savedCharacters', JSON.stringify(saved));
  loadSavedCharacters();
}

function clearAllCharacters() {
  localStorage.removeItem('savedCharacters');
  loadSavedCharacters();
}

function getCharacterData() {
  return {
    sistema: elements.sistema.value,
    nome: elements.nome.value,
    jogador: elements.jogador.value,
    nivel: elements.nivel.value,
    xp: elements.xp.value,
    profBonus: elements.profBonus.value,
    vidaMaxima: elements.vidaMaxima.value,
    currentHp: document.getElementById('currentHp').value,
    armorClass: document.getElementById('armorClass').value,
    speed: document.getElementById('speed').value,
    vision: document.getElementById('vision').value,
    hitDie: document.getElementById('hitDie').value,
    raca: elements.raca.value,
    origem: elements.origem.value,
    classe1: elements.classe1.value,
    nivelC1: elements.nivelC1.value,
    subclasse1: document.getElementById('subclasse1').value,
    multiclasse: elements.multiclasse.checked,
    classe2: elements.classe2.value,
    nivelC2: elements.nivelC2.value,
    subclasse2: document.getElementById('subclasse2').value,
    classe3: elements.classe3.value,
    nivelC3: elements.nivelC3.value,
    subclasse3: document.getElementById('subclasse3').value,
    distFor: document.getElementById('distFor').value,
    distDex: document.getElementById('distDex').value,
    distCon: document.getElementById('distCon').value,
    distInt: document.getElementById('distInt').value,
    distSab: document.getElementById('distSab').value,
    raceFor: document.getElementById('raceFor').value,
    raceDex: document.getElementById('raceDex').value,
    raceCon: document.getElementById('raceCon').value,
    raceInt: document.getElementById('raceInt').value,
    raceSab: document.getElementById('raceSab').value,
    raceCar: document.getElementById('raceCar').value,
    distCar: document.getElementById('distCar').value,
    pontosMagia: elements.pontosMagia.value,
    pontosVida: elements.pontosVida.value,
    castingStat: document.getElementById('castingStat').value,
    spellSlots: document.getElementById('spellSlots').value,
    historia: elements.historia.value,
    habilidades: elements.habilidades.value,
    tituloHabilidade: elements.tituloHabilidade.value,
    descricaoHabilidade: elements.descricaoHabilidade.value,
    descricaoClasse: elements.descricaoClasse.value,
    purchasedSkills,
    inventory,
    themeColors,
    storedFields: Object.fromEntries(
      [...document.querySelectorAll('[data-store]')].map(input => [input.dataset.store, input.value])
    ),
    skillRaca: document.getElementById('skillRaca').value,
    skillClasse1: document.getElementById('skillClasse1').value,
    skillClasse2: document.getElementById('skillClasse2').value,
    skillClasse3: document.getElementById('skillClasse3').value,
    pericia1: document.getElementById('pericia1').value,
    pericia2: document.getElementById('pericia2').value,
    photo: elements.photoPreview.dataset.photo || '',
    banner: bannerPhoto
  };
}

function loadCharacter(index) {
  const saved = JSON.parse(localStorage.getItem('savedCharacters') || '[]');
  const character = saved[index];
  if (!character) return;

  elements.sistema.value = character.sistema || 'D&D';
  elements.nome.value = character.nome || '';
  elements.jogador.value = character.jogador || '';
  elements.nivel.value = character.nivel || 1;
  elements.xp.value = character.xp || 0;
  elements.vidaMaxima.value = character.vidaMaxima || 30;
  document.getElementById('currentHp').value = character.currentHp || character.vidaMaxima || 30;
  document.getElementById('armorClass').value = character.armorClass || 10;
  document.getElementById('speed').value = character.speed || '9 m';
  document.getElementById('vision').value = character.vision || 'normal';
  document.getElementById('hitDie').value = character.hitDie || 'd10';
  elements.raca.value = character.raca || 'Forjado Bélico';
  elements.origem.value = character.origem || 'Acolhido';
  elements.classe1.value = character.classe1 || 'Bárbaro';
  elements.nivelC1.value = character.nivelC1 || 1;
  elements.multiclasse.checked = character.multiclasse || false;
  toggleMulticlassFields();
  elements.classe2.value = character.classe2 || 'Bárbaro';
  elements.nivelC2.value = character.nivelC2 || 1;
  elements.classe3.value = character.classe3 || 'Bárbaro';
  elements.nivelC3.value = character.nivelC3 || 0;
  updateClassProgression();
  document.getElementById('subclasse1').value = character.subclasse1 || document.getElementById('subclasse1').value;
  document.getElementById('subclasse2').value = character.subclasse2 || document.getElementById('subclasse2').value;
  document.getElementById('subclasse3').value = character.subclasse3 || document.getElementById('subclasse3').value;
  document.getElementById('distFor').value = character.distFor || 0;
  document.getElementById('distDex').value = character.distDex || 0;
  document.getElementById('distCon').value = character.distCon || 0;
  document.getElementById('distInt').value = character.distInt || 0;
  document.getElementById('distSab').value = character.distSab || 0;
  document.getElementById('distCar').value = character.distCar || 0;
  document.getElementById('raceFor').value = character.raceFor || 0;
  document.getElementById('raceDex').value = character.raceDex || 0;
  document.getElementById('raceCon').value = character.raceCon || 0;
  document.getElementById('raceInt').value = character.raceInt || 0;
  document.getElementById('raceSab').value = character.raceSab || 0;
  document.getElementById('raceCar').value = character.raceCar || 0;
  elements.pontosMagia.value = character.pontosMagia || 15;
  elements.pontosVida.value = character.pontosVida || 15;
  document.getElementById('castingStat').value = character.castingStat || 'int';
  document.getElementById('spellSlots').value = character.spellSlots || 0;
  elements.historia.value = character.historia || '';
  elements.habilidades.value = character.habilidades || '';
  elements.tituloHabilidade.value = character.tituloHabilidade || '';
  elements.descricaoHabilidade.value = character.descricaoHabilidade || '';
  elements.descricaoClasse.value = character.descricaoClasse || '';
  purchasedSkills = Array.isArray(character.purchasedSkills) ? character.purchasedSkills : [];
  inventory = Array.isArray(character.inventory) ? character.inventory : [];
  themeColors = character.themeColors || { primary: '#7EBAEE', secondary: '#F0A06F' };
  resetSkillEditor();
  renderSkillCollection();
  document.getElementById('skillRaca').value = character.skillRaca || '';
  document.getElementById('skillClasse1').value = character.skillClasse1 || '';
  document.getElementById('skillClasse2').value = character.skillClasse2 || '';
  document.getElementById('skillClasse3').value = character.skillClasse3 || '';
  document.getElementById('pericia1').value = character.pericia1 || '';
  document.getElementById('pericia2').value = character.pericia2 || '';
  Object.entries(character.storedFields || {}).forEach(([key, value]) => {
    const input = document.querySelector(`[data-store="${key}"]`);
    if (input) input.value = value;
  });

  if (character.photo) {
    elements.photoPreview.innerHTML = `<img src="${character.photo}" alt="Personagem" />`;
    elements.photoPreview.dataset.photo = character.photo;
  } else {
    elements.photoPreview.innerHTML = 'Preview da foto';
    elements.photoPreview.dataset.photo = '';
  }

  applyBanner(character.banner || '');
  applyDynamicTheme(themeColors.primary, themeColors.secondary);
  renderEquipment();

  synchronize();
}

function toggleMulticlassFields() {
  elements.multiclasseFields.classList.toggle('hidden', !elements.multiclasse.checked);
  if (!elements.multiclasse.checked) elements.nivelC1.value = elements.nivel.value;
  synchronize();
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    elements.photoPreview.innerHTML = `<img src="${reader.result}" alt="Foto do personagem" />`;
    elements.photoPreview.dataset.photo = reader.result;
    if (!bannerPhoto) extractThemeFromImage(reader.result);
    renderSummary();
  };
  reader.readAsDataURL(file);
}

function handleSkillPhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    skillPhoto = reader.result;
    document.getElementById('skillPhotoPreview').innerHTML = `<img src="${reader.result}" alt="Imagem da habilidade">`;
  };
  reader.readAsDataURL(file);
}

function handleBannerUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    applyBanner(reader.result);
    extractThemeFromImage(reader.result);
  };
  reader.readAsDataURL(file);
}

function init() {
  populateSelect(elements.raca, raceOptions);
  populateSelect(elements.origem, originOptions);
  populateSelect(elements.classe1, classOptions);
  populateSelect(elements.classe2, classOptions);
  populateSelect(elements.classe3, classOptions);
  populateSelect(document.getElementById('spellClassFilter'), spellcastingClasses);
  document.getElementById('spellClassFilter').value = spellcastingClasses.includes(elements.classe1.value)
    ? elements.classe1.value
    : 'Mago';

  elements.xp.addEventListener('input', () => {
    if (Number(elements.xp.value) < 0) elements.xp.value = 0;
    synchronize();
  });

  elements.nivel.addEventListener('change', () => {
    const requestedLevel = Math.min(20, Math.max(1, Number(elements.nivel.value) || 1));
    elements.xp.value = xpThresholds[requestedLevel - 1];
    synchronize();
  });

  [elements.nivelC1, elements.nivelC2].forEach(input => {
    input.addEventListener('input', () => {
      if (Number(input.value) < 1) input.value = 1;
      synchronize();
    });
  });
  elements.nivelC3.addEventListener('input', () => {
    if (Number(elements.nivelC3.value) < 0) elements.nivelC3.value = 0;
    synchronize();
  });

  elements.multiclasse.addEventListener('change', toggleMulticlassFields);
  elements.raca.addEventListener('change', applySelectedRaceBonuses);
  [elements.classe1, elements.classe2, elements.classe3].forEach(select => {
    select.addEventListener('change', () => {
      if (select === elements.classe1 && spellcastingClasses.includes(select.value)) {
        document.getElementById('spellClassFilter').value = select.value;
        renderSpellCatalog();
      }
      synchronize();
    });
  });
  document.getElementById('spellClassFilter').addEventListener('change', renderSpellCatalog);
  document.getElementById('spellLevelFilter').addEventListener('change', renderSpellCatalog);

  [
    elements.nome,
    elements.raca,
    elements.classe1,
    elements.vidaMaxima,
    document.getElementById('armorClass'),
    document.getElementById('speed'),
    document.getElementById('vision'),
    document.getElementById('hitDie'),
    document.getElementById('castingStat'),
    document.getElementById('spellSlots'),
    elements.tituloHabilidade,
    elements.descricaoHabilidade,
    elements.descricaoClasse
  ].forEach(input => {
    input.addEventListener('input', synchronize);
    input.addEventListener('change', synchronize);
  });

  distInputs.forEach(item => {
    const input = document.getElementById(item.id);
    input.addEventListener('input', () => {
      if (Number(input.value) < 0) input.value = 0;
      if (Number(input.value) > 15) input.value = 15;
      clampAttributeValues(item.id);
      synchronize();
    });
  });

  raceBonusInputs.forEach(item => {
    const input = document.getElementById(item.id);
    input.addEventListener('input', () => {
      if (Number(input.value) < 0) input.value = 0;
      synchronize();
    });
  });

  elements.pontosMagia.addEventListener('input', () => updateMagicLifeUI(elements.pontosMagia.value, elements.pontosVida.value, elements.nivel.value));
  elements.pontosVida.addEventListener('input', () => updateMagicLifeUI(elements.pontosMagia.value, elements.pontosVida.value, elements.nivel.value));

  document.querySelectorAll('[data-action="dados"]').forEach(button => {
    button.addEventListener('click', () => handleRoll(button.dataset.type));
  });

  elements.photoInput.addEventListener('change', handlePhotoUpload);
  document.getElementById('bannerInput').addEventListener('change', handleBannerUpload);
  document.getElementById('skillPhotoInput').addEventListener('change', handleSkillPhotoUpload);
  document.getElementById('addSkill').addEventListener('click', saveSkillFromEditor);
  document.getElementById('cancelSkillEdit').addEventListener('click', resetSkillEditor);
  elements.saveButton.addEventListener('click', saveCharacter);
  elements.newButton.addEventListener('click', resetFicha);
  elements.clearAll.addEventListener('click', clearAllCharacters);
  elements.resetButton.addEventListener('click', resetFicha);
  elements.createSheetButton.addEventListener('click', () => {
    const tab = document.querySelector('[data-target="tab-ficha"]');
    if (tab) tab.click();
  });

  document.querySelectorAll('[data-store]').forEach(input => {
    const key = `input-${input.dataset.store}`;
    input.value = localStorage.getItem(key) ?? input.value;
    input.addEventListener('input', event => {
      localStorage.setItem(key, event.target.value);
    });
  });

  setupTabs();
  initDiceRoller();
  toggleMulticlassFields();
  applySelectedRaceBonuses();
  loadSavedCharacters();
  renderSkillCollection();
  renderSpellCatalog();
  synchronize();
}

init();
