export const raceOptions = [
  "Forjado Bélico", "Autognomo", "Elfo da Floresta", "Alto Elfo", "Drow", "Gnomo das Rochas", "Gnomo da Floresta", "Homem-Rato", "Minotauro", "Lizardfolk", "Tabaxi", "Halfling", "Goliata", "Firbolg", "Orc", "Goblinoide", "Bugbear", "Tiefling", "Dragonborn", "Anão"
];

export const originOptions = [
  "Acolhido", "Aventureiro Nato", "Criminoso Redimido", "Soldado Veterano"
];

export const classOptions = [
  "Bárbaro", "Guerreiro", "Paladino", "Patrulheiro", "Ladino", "Monge", "Bardo", "Clérigo", "Mago", "Feiticeiro", "Bruxo", "Druida"
];

export const xpThresholds = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000,
  305000, 355000
];

export const classData = {
  "Bárbaro": { multiclass: { all: ["for"] }, hitDie: "d12", subclass: "Caminho do Berserker" },
  "Guerreiro": { multiclass: { any: ["for", "dex"] }, hitDie: "d10", subclass: "Campeão" },
  "Paladino": { multiclass: { all: ["for", "car"] }, hitDie: "d10", subclass: "Juramento de Devoção" },
  "Patrulheiro": { multiclass: { all: ["dex", "sab"] }, hitDie: "d10", subclass: "Caçador" },
  "Ladino": { multiclass: { all: ["dex"] }, hitDie: "d8", subclass: "Ladrão" },
  "Monge": { multiclass: { all: ["dex", "sab"] }, hitDie: "d8", subclass: "Mão Aberta" },
  "Bardo": { multiclass: { all: ["car"] }, hitDie: "d8", subclass: "Colégio do Conhecimento" },
  "Clérigo": { multiclass: { all: ["sab"] }, hitDie: "d8", subclass: "Domínio da Vida" },
  "Mago": { multiclass: { all: ["int"] }, hitDie: "d6", subclass: "Evocador" },
  "Feiticeiro": { multiclass: { all: ["car"] }, hitDie: "d6", subclass: "Feitiçaria Dracônica" },
  "Bruxo": { multiclass: { all: ["car"] }, hitDie: "d8", subclass: "Patrono Corruptor" },
  "Druida": { multiclass: { all: ["sab"] }, hitDie: "d8", subclass: "Círculo da Terra" }
};

export const distInputs = [
  { id: 'distFor', label: 'FOR' },
  { id: 'distDex', label: 'DEX' },
  { id: 'distCon', label: 'CON' },
  { id: 'distInt', label: 'INT' },
  { id: 'distSab', label: 'SAB' },
  { id: 'distCar', label: 'CAR' }
];

export const raceBonusInputs = [
  { id: 'raceFor' },
  { id: 'raceDex' },
  { id: 'raceCon' },
  { id: 'raceInt' },
  { id: 'raceSab' },
  { id: 'raceCar' }
];

export function computeProfBonus(level) {
  const lvl = Number(level) || 1;
  if (lvl <= 4) return '+2';
  if (lvl <= 8) return '+3';
  if (lvl <= 12) return '+4';
  if (lvl <= 16) return '+5';
  return '+6';
}

export function getLevelFromXp(xp) {
  const value = Math.max(0, Number(xp) || 0);
  let level = 1;
  xpThresholds.forEach((threshold, index) => {
    if (value >= threshold) level = index + 1;
  });
  return Math.min(20, level);
}

export function getXpProgress(xp) {
  const value = Math.max(0, Number(xp) || 0);
  const level = getLevelFromXp(value);
  const current = xpThresholds[level - 1];
  const next = level < 20 ? xpThresholds[level] : current;
  return {
    level,
    current,
    next,
    earned: Math.max(0, value - current),
    needed: Math.max(1, next - current),
    remaining: Math.max(0, next - value)
  };
}

export function getSubclassOptions(className) {
  const subclass = classData[className]?.subclass;
  return subclass ? [subclass, "Subclasse personalizada"] : ["Subclasse personalizada"];
}

export function getMulticlassRequirement(className) {
  return classData[className]?.multiclass || { all: [] };
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
