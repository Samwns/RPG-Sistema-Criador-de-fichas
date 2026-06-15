import {
  raceOptions,
  originOptions,
  classOptions,
  distInputs,
  raceBonusInputs,
  computeProfBonus,
  computePointBudget,
  computeModifier,
  requiredMagicLife,
  getRemainingPoints
} from './mechanics.js';

export const elements = {
  nome: document.getElementById('nome'),
  jogador: document.getElementById('jogador'),
  sistema: document.getElementById('sistema'),
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
  availablePoints: document.getElementById('availablePoints'),
  usedPoints: document.getElementById('usedPoints'),
  remainingPoints: document.getElementById('remainingPoints'),
  budgetLabel: document.getElementById('budgetLabel'),
  budgetHelper: document.getElementById('budgetHelper'),
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
  totalCar: document.getElementById('totalCar'),
  modCar: document.getElementById('modCar'),
  pontosMagia: document.getElementById('pontosMagia'),
  pontosVida: document.getElementById('pontosVida'),
  totalMagiaVida: document.getElementById('totalMagiaVida'),
  requiredMagicLife: document.getElementById('requiredMagicLife'),
  magicNote: document.getElementById('magicNote'),
  historia: document.getElementById('historia'),
  habilidades: document.getElementById('habilidades'),
  photoInput: document.getElementById('photoInput'),
  photoPreview: document.getElementById('photoPreview'),
  saveButton: document.getElementById('saveCharacter'),
  newButton: document.getElementById('newCharacter'),
  clearAll: document.getElementById('clearAll'),
  savedList: document.getElementById('savedList'),
  rollResult: document.getElementById('rollResult'),
  resetButton: document.getElementById('resetButton'),
  createSheetButton: document.getElementById('createSheetButton'),
  tituloHabilidade: document.getElementById('tituloHabilidade'),
  descricaoHabilidade: document.getElementById('descricaoHabilidade'),
  descricaoClasse: document.getElementById('descricaoClasse'),
  summaryNome: document.getElementById('summaryNome'),
  summaryImage: document.getElementById('summaryImage'),
  summaryAbilityTitle: document.getElementById('summaryAbilityTitle'),
  summaryAbilityDesc: document.getElementById('summaryAbilityDesc'),
  summaryClassDesc: document.getElementById('summaryClassDesc')
};

export function populateSelect(select, options) {
  select.innerHTML = options.map(option => `<option value="${option}">${option}</option>`).join('');
}

export function updateBudgetText(remainingData) {
  const remaining = Math.max(0, remainingData.remaining);
  if (elements.availablePoints) elements.availablePoints.textContent = remainingData.budget;
  elements.usedPoints.textContent = remainingData.used;
  elements.remainingPoints.textContent = remaining;
  elements.budgetLabel.textContent = `Restam ${remaining} ponto${remaining === 1 ? '' : 's'}`;
  if (elements.budgetHelper) {
    elements.budgetHelper.textContent = `Disponíveis ${remainingData.budget} · usados ${remainingData.used}. Distribua em FOR, DEX, CON, INT, SAB e CAR.`;
  }
  elements.budgetWarning.textContent = remainingData.remaining < 0 ? 'Você ultrapassou o limite disponível.' : '';
}

export function updateTotals(totals) {
  elements.totalFor.textContent = totals[0];
  elements.totalDex.textContent = totals[1];
  elements.totalCon.textContent = totals[2];
  elements.totalInt.textContent = totals[3];
  elements.totalSab.textContent = totals[4];
  elements.totalCar.textContent = totals[5];

  elements.modFor.textContent = computeModifier(totals[0]);
  elements.modDex.textContent = computeModifier(totals[1]);
  elements.modCon.textContent = computeModifier(totals[2]);
  elements.modInt.textContent = computeModifier(totals[3]);
  elements.modSab.textContent = computeModifier(totals[4]);
  elements.modCar.textContent = computeModifier(totals[5]);

  const sideValues = ['For', 'Dex', 'Con', 'Int', 'Sab', 'Car'];
  sideValues.forEach((key, index) => {
    const score = document.getElementById(`side${key}`);
    const modifier = document.getElementById(`sideMod${key}`);
    if (score) score.textContent = totals[index];
    if (modifier) modifier.textContent = computeModifier(totals[index]);
  });
}

export function updateMagicLifeUI(magic, life, level) {
  const total = Number(magic || 0) + Number(life || 0);
  const required = requiredMagicLife(level);
  const remaining = required - total;
  const energyLabel = (document.querySelector('[data-energy-label]')?.textContent || 'mana').toLowerCase();

  elements.totalMagiaVida.textContent = total;
  elements.requiredMagicLife.textContent = required;
  const diffLabel = document.getElementById('magicDifference');
  const resourceBudgetLabel = document.getElementById('resourceBudgetLabel');
  if (resourceBudgetLabel) {
    const visibleRemaining = Math.max(0, remaining);
    resourceBudgetLabel.textContent = `Restam ${visibleRemaining} ponto${visibleRemaining === 1 ? '' : 's'}`;
  }

  if (remaining === 0) {
    diffLabel.textContent = '0';
    diffLabel.className = 'positive';
    elements.magicNote.textContent = `Tudo distribuído. Cada ponto vale +2 PV ou +2 ${energyLabel} antes dos bônus extras.`;
  } else if (remaining < 0) {
    diffLabel.textContent = `${remaining}`;
    diffLabel.className = 'negative';
    elements.magicNote.textContent = `Você ultrapassou o limite por ${Math.abs(remaining)} ponto(s).`;
  } else {
    diffLabel.textContent = remaining.toString();
    diffLabel.className = 'positive';
    elements.magicNote.textContent = `Restam ${remaining} ponto(s) para distribuir entre vida e ${energyLabel}.`;
  }
}

export function renderSummary() {
  const characterName = elements.nome.value || 'novo personagem';
  const characterMeta = [
    elements.raca.value,
    document.getElementById('subraca')?.value,
    elements.classe1.value,
    `nível ${elements.nivel.value || 1}`
  ].filter(Boolean).join(' · ');

  elements.summaryNome.textContent = characterName;
  elements.summaryAbilityTitle.textContent = elements.tituloHabilidade.value || 'Título da habilidade';
  elements.summaryAbilityDesc.textContent = elements.descricaoHabilidade.value || 'A descrição da habilidade do personagem aparecerá aqui.';
  elements.summaryClassDesc.textContent = elements.descricaoClasse.value || 'A descrição da classe personalizada aparecerá aqui.';

  const heroName = document.getElementById('heroCharacterName');
  const heroMeta = document.getElementById('heroCharacterMeta');
  if (heroName) heroName.textContent = characterName;
  if (heroMeta) heroMeta.textContent = characterMeta || 'Escolha raça, classe e nível';

  if (elements.photoPreview.dataset.photo) {
    elements.summaryImage.innerHTML = `<img src="${elements.photoPreview.dataset.photo}" alt="Foto do personagem" />`;
  } else {
    elements.summaryImage.innerHTML = 'Sem imagem';
  }
}

export function setupTabs() {
  document.querySelectorAll('.tab-button, .utility-tab-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab-button, .utility-tab-button').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

      button.classList.add('active');
      const target = document.getElementById(button.dataset.target);
      if (target) {
        target.classList.add('active');
        window.dispatchEvent(new Event('resize'));
      }
    });
  });

  document.querySelectorAll('.system-tab').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.system-tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.system-panel').forEach(panel => panel.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(button.dataset.systemTarget)?.classList.add('active');
    });
  });
}

export function animateRollButton(button) {
  button.classList.add('rolling');
  setTimeout(() => button.classList.remove('rolling'), 700);
}
