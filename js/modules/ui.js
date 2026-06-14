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
  elements.usedPoints.textContent = remainingData.used;
  elements.remainingPoints.textContent = Math.max(0, remainingData.remaining);
  elements.budgetLabel.textContent = `Distribua ${remainingData.budget} pontos`;
  elements.budgetWarning.textContent = remainingData.remaining < 0 ? 'Você ultrapassou o limite disponível.' : '';
}

export function updateTotals(totals) {
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

  const sideValues = ['For', 'Dex', 'Con', 'Int', 'Sab'];
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
  const diff = total - required;

  elements.totalMagiaVida.textContent = total;
  elements.requiredMagicLife.textContent = required;
  const diffLabel = document.getElementById('magicDifference');

  if (diff === 0) {
    diffLabel.textContent = 'OK';
    diffLabel.className = 'positive';
    elements.magicNote.textContent = `Total correto para nível ${level}.`;
  } else if (diff > 0) {
    diffLabel.textContent = `+${diff}`;
    diffLabel.className = 'negative';
    elements.magicNote.textContent = `Você ultrapassou o limite do sistema por ${diff} ponto(s).`;
  } else {
    diffLabel.textContent = diff.toString();
    diffLabel.className = 'negative';
    elements.magicNote.textContent = `Faltam ${Math.abs(diff)} ponto(s) para o limite do sistema.`;
  }
}

export function renderSummary() {
  const characterName = elements.nome.value || 'novo personagem';
  const characterMeta = [
    elements.raca.value,
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
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

      button.classList.add('active');
      const target = document.getElementById(button.dataset.target);
      if (target) {
        target.classList.add('active');
        window.dispatchEvent(new Event('resize'));
      }
    });
  });
}

export function animateRollButton(button) {
  button.classList.add('rolling');
  setTimeout(() => button.classList.remove('rolling'), 700);
}
