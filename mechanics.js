export const raceOptions = [
  "Forjado Bélico", "Autognomo", "Elfo da Floresta", "Alto Elfo", "Drow", "Gnomo das Rochas", "Gnomo da Floresta", "Homem-Rato", "Minotauro", "Lizardfolk", "Tabaxi", "Halfling", "Goliata", "Firbolg", "Orc", "Goblinoide", "Bugbear", "Tiefling", "Dragonborn", "Anão"
];

export const originOptions = [
  "Acolhido", "Aventureiro Nato", "Criminoso Redimido", "Soldado Veterano"
];

export const classOptions = [
  "Bárbaro", "Guerreiro", "Paladino", "Patrulheiro", "Ladino", "Monge", "Bardo", "Clérigo", "Mago", "Feiticeiro", "Bruxo", "Druida"
];

export const distInputs = [
  { id: 'distFor', label: 'FOR' },
  { id: 'distDex', label: 'DEX' },
  { id: 'distCon', label: 'CON' },
  { id: 'distInt', label: 'INT' },
  { id: 'distSab', label: 'SAB' }
];

export const raceBonusInputs = [
  { id: 'raceFor' },
  { id: 'raceDex' },
  { id: 'raceCon' },
  { id: 'raceInt' },
  { id: 'raceSab' }
];

export function computeProfBonus(level) {
  const lvl = Number(level) || 1;
  if (lvl <= 4) return '+2';
  if (lvl <= 8) return '+3';
  if (lvl <= 12) return '+4';
  if (lvl <= 16) return '+5';
  return '+6';
}

export function computePointBudget(level) {
  const lvl = Number(level) || 1;
  return 30 + lvl * 2;
}

export function computeModifier(total) {
  const value = Number(total) || 0;
  const mod = Math.floor((value - 10) / 2);
  return mod >= 0 ? `+${mod}` : mod.toString();
}

export function requiredMagicLife(level) {
  const lvl = Number(level) || 1;
  return 20 + lvl * 2;
}

export function getRemainingPoints(level, values) {
  const used = values.reduce((sum, current) => sum + Number(current || 0), 0);
  const budget = computePointBudget(level);
  return { used, remaining: budget - used, budget };
}
