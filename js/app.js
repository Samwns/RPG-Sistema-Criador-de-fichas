import {
  raceOptions,
  originOptions,
  classOptions,
  distInputs,
  raceBonusInputs,
  computeProfBonus,
  computeModifier,
  getRemainingPoints,
  requiredMagicLife
} from './modules/mechanics.js';
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
import { initDiceRoller } from './modules/diceRoller.js';

let purchasedSkills = [];
let skillPhoto = '';
let editingSkillIndex = -1;

function getInputValues() {
  return distInputs.map(item => Number(document.getElementById(item.id).value || 0));
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

  const d20 = Math.floor(Math.random() * 20) + 1;
  const prof = Number(elements.profBonus.value.toString().replace('+', '')) || 0;
  const mods = {
    for: Number(elements.modFor.textContent.replace('+', '')),
    dex: Number(elements.modDex.textContent.replace('+', '')),
    int: Number(elements.modInt.textContent.replace('+', ''))
  };

  let total = 0;
  let description = '';

  switch (type) {
    case 'for':
      total = d20 + mods.for + prof;
      description = `d20 [${d20}] + Mod FOR [${mods.for}] + Prof [${prof}]`;
      break;
    case 'dex':
      total = d20 + mods.dex + prof;
      description = `d20 [${d20}] + Mod DEX [${mods.dex}] + Prof [${prof}]`;
      break;
    case 'dexNoProf':
      total = d20 + mods.dex;
      description = `d20 [${d20}] + Mod DEX [${mods.dex}] (sem Prof)`;
      break;
    case 'int':
      total = d20 + mods.int + prof;
      description = `d20 [${d20}] + Mod INT [${mods.int}] + Prof [${prof}]`;
      break;
    default:
      return;
  }

  const resultText = `Resultado: ${total} — ${description}`;
  elements.rollResult.innerHTML = `
    <span class="dice-icon">${d20}</span>
    <span>${resultText}</span>
  `;
}

function resetFicha() {
  elements.nome.value = '';
  elements.jogador.value = '';
  elements.sistema.value = 'D&D';
  elements.nivel.value = 5;
  elements.xp.value = 0;
  elements.vidaMaxima.value = 30;
  elements.multiclasse.checked = false;
  elements.nivelC1.value = 5;
  elements.nivelC2.value = 1;
  elements.nivelC3.value = 1;
  distInputs.forEach(input => document.getElementById(input.id).value = 0);
  raceBonusInputs.forEach(input => document.getElementById(input.id).value = 0);
  elements.tituloHabilidade.value = '';
  elements.descricaoHabilidade.value = '';
  elements.descricaoClasse.value = '';
  purchasedSkills = [];
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
  elements.rollResult.textContent = 'Clique em uma rolagem para ver o resultado.';
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

function synchronize() {
  elements.profBonus.value = computeProfBonus(elements.nivel.value);
  updateBudgetText(getRemainingPoints(elements.nivel.value, getInputValues()));
  updateDistribuicaoLimits();
  updateTotals(getTotals());
  updateMagicLifeUI(elements.pontosMagia.value, elements.pontosVida.value, elements.nivel.value);
  renderSummary();
  updateFeaturedSkillSummary();
  updateSkillBudget();

  const combatHp = document.getElementById('combatHp');
  const combatProf = document.getElementById('combatProf');
  const combatInit = document.getElementById('combatInit');
  const combatDefense = document.getElementById('combatDefense');
  if (combatHp) combatHp.textContent = elements.vidaMaxima.value || 0;
  if (combatProf) combatProf.textContent = elements.profBonus.value;
  if (combatInit) combatInit.textContent = elements.modDex.textContent;
  if (combatDefense) {
    combatDefense.textContent = 10 + Number(elements.modDex.textContent.replace('+', ''));
  }
}

function loadSavedCharacters() {
  const saved = JSON.parse(localStorage.getItem('savedCharacters') || '[]');
  elements.savedList.innerHTML = saved.length === 0 ? '<p>Nenhum personagem salvo.</p>' : '';
  saved.forEach((character, index) => {
    const card = document.createElement('div');
    card.className = 'saved-card';

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
      img.alt = `${character.nome} photo`;
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
    raca: elements.raca.value,
    origem: elements.origem.value,
    classe1: elements.classe1.value,
    nivelC1: elements.nivelC1.value,
    multiclasse: elements.multiclasse.checked,
    classe2: elements.classe2.value,
    nivelC2: elements.nivelC2.value,
    classe3: elements.classe3.value,
    nivelC3: elements.nivelC3.value,
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
    pontosMagia: elements.pontosMagia.value,
    pontosVida: elements.pontosVida.value,
    historia: elements.historia.value,
    habilidades: elements.habilidades.value,
    tituloHabilidade: elements.tituloHabilidade.value,
    descricaoHabilidade: elements.descricaoHabilidade.value,
    descricaoClasse: elements.descricaoClasse.value,
    purchasedSkills,
    skillRaca: document.getElementById('skillRaca').value,
    skillClasse1: document.getElementById('skillClasse1').value,
    skillClasse2: document.getElementById('skillClasse2').value,
    skillClasse3: document.getElementById('skillClasse3').value,
    pericia1: document.getElementById('pericia1').value,
    pericia2: document.getElementById('pericia2').value,
    photo: elements.photoPreview.dataset.photo || ''
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
  elements.raca.value = character.raca || 'Forjado Bélico';
  elements.origem.value = character.origem || 'Acolhido';
  elements.classe1.value = character.classe1 || 'Bárbaro';
  elements.nivelC1.value = character.nivelC1 || 1;
  elements.multiclasse.checked = character.multiclasse || false;
  toggleMulticlassFields();
  elements.classe2.value = character.classe2 || 'Bárbaro';
  elements.nivelC2.value = character.nivelC2 || 1;
  elements.classe3.value = character.classe3 || 'Bárbaro';
  elements.nivelC3.value = character.nivelC3 || 1;
  document.getElementById('distFor').value = character.distFor || 0;
  document.getElementById('distDex').value = character.distDex || 0;
  document.getElementById('distCon').value = character.distCon || 0;
  document.getElementById('distInt').value = character.distInt || 0;
  document.getElementById('distSab').value = character.distSab || 0;
  document.getElementById('raceFor').value = character.raceFor || 0;
  document.getElementById('raceDex').value = character.raceDex || 0;
  document.getElementById('raceCon').value = character.raceCon || 0;
  document.getElementById('raceInt').value = character.raceInt || 0;
  document.getElementById('raceSab').value = character.raceSab || 0;
  elements.pontosMagia.value = character.pontosMagia || 15;
  elements.pontosVida.value = character.pontosVida || 15;
  elements.historia.value = character.historia || '';
  elements.habilidades.value = character.habilidades || '';
  elements.tituloHabilidade.value = character.tituloHabilidade || '';
  elements.descricaoHabilidade.value = character.descricaoHabilidade || '';
  elements.descricaoClasse.value = character.descricaoClasse || '';
  purchasedSkills = Array.isArray(character.purchasedSkills) ? character.purchasedSkills : [];
  resetSkillEditor();
  renderSkillCollection();
  document.getElementById('skillRaca').value = character.skillRaca || '';
  document.getElementById('skillClasse1').value = character.skillClasse1 || '';
  document.getElementById('skillClasse2').value = character.skillClasse2 || '';
  document.getElementById('skillClasse3').value = character.skillClasse3 || '';
  document.getElementById('pericia1').value = character.pericia1 || '';
  document.getElementById('pericia2').value = character.pericia2 || '';

  if (character.photo) {
    elements.photoPreview.innerHTML = `<img src="${character.photo}" alt="Personagem" />`;
    elements.photoPreview.dataset.photo = character.photo;
  } else {
    elements.photoPreview.innerHTML = 'Preview da foto';
    elements.photoPreview.dataset.photo = '';
  }

  synchronize();
}

function toggleMulticlassFields() {
  elements.multiclasseFields.classList.toggle('hidden', !elements.multiclasse.checked);
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    elements.photoPreview.innerHTML = `<img src="${reader.result}" alt="Foto do personagem" />`;
    elements.photoPreview.dataset.photo = reader.result;
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

function init() {
  populateSelect(elements.raca, raceOptions);
  populateSelect(elements.origem, originOptions);
  populateSelect(elements.classe1, classOptions);
  populateSelect(elements.classe2, classOptions);
  populateSelect(elements.classe3, classOptions);

  elements.nivel.addEventListener('input', () => {
    if (Number(elements.nivel.value) < 1) elements.nivel.value = 1;
    synchronize();
  });

  elements.nivelC1.addEventListener('input', () => { if (Number(elements.nivelC1.value) < 1) elements.nivelC1.value = 1; });
  elements.nivelC2.addEventListener('input', () => { if (Number(elements.nivelC2.value) < 1) elements.nivelC2.value = 1; });
  elements.nivelC3.addEventListener('input', () => { if (Number(elements.nivelC3.value) < 1) elements.nivelC3.value = 1; });

  elements.multiclasse.addEventListener('change', toggleMulticlassFields);

  [
    elements.nome,
    elements.raca,
    elements.classe1,
    elements.vidaMaxima,
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
    input.value = localStorage.getItem(key) || '';
    input.addEventListener('input', event => {
      localStorage.setItem(key, event.target.value);
    });
  });

  setupTabs();
  initDiceRoller();
  toggleMulticlassFields();
  loadSavedCharacters();
  renderSkillCollection();
  synchronize();
}

init();
