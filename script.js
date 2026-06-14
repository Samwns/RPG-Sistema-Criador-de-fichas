const raceOptions = [
  "Forjado Bélico", "Autognomo", "Elfo da Floresta", "Alto Elfo", "Drow", "Gnomo das Rochas", "Gnomo da Floresta", "Homem-Rato", "Minotauro", "Lizardfolk", "Tabaxi", "Halfling", "Goliata", "Firbolg", "Orc", "Goblinoide", "Bugbear", "Tiefling", "Dragonborn", "Anão"
];

const originOptions = [
  "Acolhido", "Aventureiro Nato", "Criminoso Redimido", "Soldado Veterano"
];

const classOptions = [
  "Bárbaro", "Guerreiro", "Paladino", "Patrulheiro", "Ladino", "Monge", "Bardo", "Clérigo", "Mago", "Feiticeiro", "Bruxo", "Druida"
];

const distInputs = [
  { id: 'distFor', label: 'FOR' },
  { id: 'distDex', label: 'DEX' },
  { id: 'distCon', label: 'CON' },
  { id: 'distInt', label: 'INT' },
  { id: 'distSab', label: 'SAB' }
];

const raceBonusInputs = [
  { id: 'raceFor' },
  { id: 'raceDex' },
  { id: 'raceCon' },
  { id: 'raceInt' },
  { id: 'raceSab' }
];

const elements = {
  nome: document.getElementById('nome'),
  jogador: document.getElementById('jogador'),
  nivel: document.getElementById('nivel'),
  xp: document.getElementById('xp'),
  profBonus: document.getElementById('profBonus'),
  vidaMaxima: document.getElementById('vidaMaxima'),
  raca: document.getElementById('raca'),
  origem: document.getElementById('origem'),
  classe1: document.getElementById('classe1'),
  nivelC1: document.getElementById('nivelC1'),
  multiclasse: document.getElementById('multiclasse'),
  multiclasseFields: document.getElementById('multiclasseFields'),
  classe2: document.getElementById('classe2'),
  nivelC2: document.getElementById('nivelC2'),
  classe3: document.getElementById('classe3'),
  nivelC3: document.getElementById('nivelC3'),
  usedPoints: document.getElementById('usedPoints'),
  remainingPoints: document.getElementById('remainingPoints'),
  budgetLabel: document.getElementById('budgetLabel'),
  budgetWarning: document.getElementById('budgetWarning'),
  totalFor: document.getElementById('totalFor'),
  totalDex: document.getElementById('totalDex'),
  totalCon: document.getElementById('totalCon'),
  totalInt: document.getElementById('totalInt'),
  totalSab: document.getElementById('totalSab'),
  modFor: document.getElementById('modFor'),
  modDex: document.getElementById('modDex'),
  modCon: document.getElementById('modCon'),
  modInt: document.getElementById('modInt'),
  modSab: document.getElementById('modSab'),
  pontosMagia: document.getElementById('pontosMagia'),
  pontosVida: document.getElementById('pontosVida'),
  totalMagiaVida: document.getElementById('totalMagiaVida'),
  rollResult: document.getElementById('rollResult'),
  resetButton: document.getElementById('resetButton')
};

const distState = {
  distFor: 0,
  distDex: 0,
  distCon: 0,
  distInt: 0,
  distSab: 0
};

function populateSelect(select, options) {
  select.innerHTML = options.map(option => `<option value="${option}">${option}</option>`).join('');
}

function computeProfBonus(level) {
  const lvl = Number(level) || 1;
  if (lvl <= 4) return '+2';
  if (lvl <= 8) return '+3';
  if (lvl <= 12) return '+4';
  if (lvl <= 16) return '+5';
  return '+6';
}

function computePointBudget(level) {
  const lvl = Number(level) || 1;
  return 30 + lvl * 2; // 40 pontos no nível 5, escala com nível
}

function computeModifier(total) {
  const value = Number(total) || 0;
  const mod = Math.floor((value - 10) / 2);
  return mod >= 0 ? `+${mod}` : mod.toString();
}

function getRemainingPoints() {
  const used = distInputs.reduce((sum, item) => sum + Number(document.getElementById(item.id).value || 0), 0);
  const budget = computePointBudget(elements.nivel.value);
  return { used, remaining: budget - used, budget };
}

function updateBudgetText() {
  const { used, remaining, budget } = getRemainingPoints();
  elements.usedPoints.textContent = used;
  elements.remainingPoints.textContent = Math.max(0, remaining);
  elements.budgetLabel.textContent = `Distribua ${budget} pontos`;
  elements.budgetWarning.textContent = remaining < 0 ? 'Você ultrapassou o limite disponível.' : '';
}

function clampAttributeValues(changedId) {
  const { used, remaining, budget } = getRemainingPoints();
  if (remaining < 0) {
    const input = document.getElementById(changedId);
    const currentValue = Number(input.value || 0);
    const overflow = -remaining;
    input.value = Math.max(0, currentValue - overflow);
  }
}

function updateDistribuicaoLimits() {
  const { remaining } = getRemainingPoints();
  distInputs.forEach(item => {
    const input = document.getElementById(item.id);
    const currentValue = Number(input.value || 0);
    const maxForInput = 15 + Math.max(0, remaining);
    input.max = Math.min(15, Math.max(0, currentValue + remaining));
    if (currentValue > Number(input.max)) {
      input.value = input.max;
    }
  });
}

function updateTotals() {
  const raceBonus = raceBonusInputs.map(item => Number(document.getElementById(item.id).value || 0));
  const totals = distInputs.map((item, index) => {
    const dist = Number(document.getElementById(item.id).value || 0);
    return 10 + dist + raceBonus[index];
  });

  elements.totalFor.textContent = totals[0];
  elements.totalDex.textContent = totals[1];
  elements.totalCon.textContent = totals[2];
  elements.totalInt.textContent = totals[3];
  elements.totalSab.textContent = totals[4];

  elements.modFor.textContent = computeModifier(totals[0]);
  elements.modDex.textContent = computeModifier(totals[1]);
  elements.modCon.textContent = computeModifier(totals[2]);
  elements.modInt.textContent = computeModifier(totals[3]);
  elements.modSab.textContent = computeModifier(totals[4]);
}

function updateMagicLifeTotal() {
  const magia = Number(elements.pontosMagia.value || 0);
  const vida = Number(elements.pontosVida.value || 0);
  elements.totalMagiaVida.textContent = magia + vida;
}

function toggleMulticlassFields() {
  elements.multiclasseFields.classList.toggle('hidden', !elements.multiclasse.checked);
}

function handleRoll(type) {
  const d20 = Math.floor(Math.random() * 20) + 1;
  const prof = Number(elements.profBonus.value.toString().replace('+', '')) || 0;
  const mods = {
    for: Number(elements.modFor.textContent.replace('+', '')),
    dex: Number(elements.modDex.textContent.replace('+', '')),
    int: Number(elements.modInt.textContent.replace('+', ''))
  };

  let modName = '';
  let modValue = 0;
  let total = 0;
  let description = '';
  let useProf = true;

  switch (type) {
    case 'for':
      modName = 'FOR';
      modValue = mods.for;
      description = `d20 [${d20}] + Mod ${modName} [${modValue}] + Prof [${prof}]`;
      total = d20 + modValue + prof;
      break;
    case 'dex':
      modName = 'DEX';
      modValue = mods.dex;
      description = `d20 [${d20}] + Mod ${modName} [${modValue}] + Prof [${prof}]`;
      total = d20 + modValue + prof;
      break;
    case 'dexNoProf':
      modName = 'DEX';
      modValue = mods.dex;
      description = `d20 [${d20}] + Mod ${modName} [${modValue}] (sem Prof)`;
      total = d20 + modValue;
      break;
    case 'int':
      modName = 'INT';
      modValue = mods.int;
      description = `d20 [${d20}] + Mod ${modName} [${modValue}] + Prof [${prof}]`;
      total = d20 + modValue + prof;
      break;
    default:
      return;
  }

  elements.rollResult.textContent = `Resultado: ${total} — ${description}`;
}

function resetFicha() {
  elements.nome.value = '';
  elements.jogador.value = '';
  elements.nivel.value = 5;
  elements.xp.value = 0;
  elements.vidaMaxima.value = 30;
  elements.multiclasse.checked = false;
  toggleMulticlassFields();
  elements.nivelC1.value = 5;
  elements.nivelC2.value = 1;
  elements.nivelC3.value = 1;
  distInputs.forEach(input => document.getElementById(input.id).value = 0);
  raceBonusInputs.forEach(input => document.getElementById(input.id).value = 0);
  document.getElementById('skillRaca').value = '';
  document.getElementById('skillClasse1').value = '';
  document.getElementById('skillClasse2').value = '';
  document.getElementById('skillClasse3').value = '';
  document.getElementById('pericia1').value = '';
  document.getElementById('pericia2').value = '';
  elements.pontosMagia.value = 15;
  elements.pontosVida.value = 15;
  elements.rollResult.textContent = 'Clique em uma rolagem para ver o resultado.';
  synchronize();
}

function synchronize() {
  elements.profBonus.value = computeProfBonus(elements.nivel.value);
  updateBudgetText();
  updateDistribuicaoLimits();
  updateTotals();
  updateMagicLifeTotal();
}

function setupTabs() {
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

      button.classList.add('active');
      const target = document.getElementById(button.dataset.target);
      if (target) target.classList.add('active');
    });
  });
}

function init() {
  populateSelect(elements.raca, raceOptions);
  populateSelect(elements.origem, originOptions);
  populateSelect(elements.classe1, classOptions);
  populateSelect(elements.classe2, classOptions);
  populateSelect(elements.classe3, classOptions);

  elements.nivel.addEventListener('input', () => {
    const levelValue = Number(elements.nivel.value) || 1;
    if (levelValue < 1) elements.nivel.value = 1;
    synchronize();
  });

  elements.nivelC1.addEventListener('input', () => {
    if (Number(elements.nivelC1.value) < 1) elements.nivelC1.value = 1;
  });

  elements.nivelC2.addEventListener('input', () => {
    if (Number(elements.nivelC2.value) < 1) elements.nivelC2.value = 1;
  });

  elements.nivelC3.addEventListener('input', () => {
    if (Number(elements.nivelC3.value) < 1) elements.nivelC3.value = 1;
  });

  elements.multiclasse.addEventListener('change', toggleMulticlassFields);

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

  elements.pontosMagia.addEventListener('input', updateMagicLifeTotal);
  elements.pontosVida.addEventListener('input', updateMagicLifeTotal);

  document.querySelectorAll('[data-action="dados"]').forEach(button => {
    button.addEventListener('click', () => handleRoll(button.dataset.type));
  });

  elements.resetButton.addEventListener('click', resetFicha);

  setupTabs();
  toggleMulticlassFields();
  synchronize();
}

init();
