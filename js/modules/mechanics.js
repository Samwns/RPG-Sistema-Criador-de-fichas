export const raceData = {
  "Anão": {
    source: "SRD 5.1 · Legado",
    traits: "Visão no escuro, resiliência anã e treinamento tradicional.",
    subraces: {
      "Anão da Colina": { bonuses: { con: 2, sab: 1 }, trait: "Tenacidade aumenta a vida." },
      "Anão da Montanha": { bonuses: { con: 2, for: 2 }, trait: "Treinamento com armaduras." }
    }
  },
  "Elfo": {
    source: "SRD 5.1 · Legado",
    traits: "Ancestral feérico, transe, sentidos aguçados e visão no escuro.",
    subraces: {
      "Alto Elfo": { bonuses: { dex: 2, int: 1 }, trait: "Truque arcano e treinamento élfico." },
      "Elfo da Floresta": { bonuses: { dex: 2, sab: 1 }, trait: "Movimento ampliado e máscara da natureza." },
      "Drow": { bonuses: { dex: 2, car: 1 }, trait: "Visão superior e magia drow." }
    }
  },
  "Halfling": {
    source: "SRD 5.1 · Legado",
    traits: "Sorte, bravura e agilidade halfling.",
    subraces: {
      "Pés-Leves": { bonuses: { dex: 2, car: 1 }, trait: "Furtividade natural." },
      "Robusto": { bonuses: { dex: 2, con: 1 }, trait: "Resiliência contra veneno." }
    }
  },
  "Humano": {
    source: "SRD 5.1/5.2.1",
    traits: "Versatilidade, perícia adicional e grande variedade cultural.",
    subraces: {
      "Humano Versátil": { bonuses: { for: 1, dex: 1, con: 1, int: 1, sab: 1, car: 1 }, trait: "Aprimoramento equilibrado." },
      "Humano Heroico": { bonuses: { dex: 1, con: 1, car: 1 }, trait: "Adaptação 2024 simplificada para este sistema." }
    }
  },
  "Dragonborn": {
    source: "SRD 5.1/5.2.1",
    traits: "Sopro elemental e resistência ao tipo de energia escolhido.",
    subraces: {
      "Ancestral de Fogo": { bonuses: { for: 2, car: 1 }, trait: "Sopro e resistência a fogo." },
      "Ancestral de Frio": { bonuses: { for: 2, con: 1 }, trait: "Sopro e resistência a frio." },
      "Ancestral de Eletricidade": { bonuses: { for: 2, car: 1 }, trait: "Sopro e resistência elétrica." },
      "Ancestral de Ácido": { bonuses: { for: 2, con: 1 }, trait: "Sopro e resistência a ácido." },
      "Ancestral de Veneno": { bonuses: { con: 2, car: 1 }, trait: "Sopro e resistência a veneno." }
    }
  },
  "Gnomo": {
    source: "SRD 5.1 · Legado",
    traits: "Astúcia gnômica e visão no escuro.",
    subraces: {
      "Gnomo da Floresta": { bonuses: { int: 2, dex: 1 }, trait: "Ilusão menor e fala com animais pequenos." },
      "Gnomo das Rochas": { bonuses: { int: 2, con: 1 }, trait: "Conhecimento de artífice." }
    }
  },
  "Meio-Elfo": {
    source: "SRD 5.1 · Legado",
    traits: "Ancestral feérico, visão no escuro e versatilidade em perícias.",
    subraces: {
      "Herança Versátil": { bonuses: { car: 2, dex: 1, int: 1 }, trait: "Combina duas aptidões adicionais." }
    }
  },
  "Meio-Orc": {
    source: "SRD 5.1 · Legado",
    traits: "Resistência implacável, ataques selvagens e visão no escuro.",
    subraces: {
      "Herança Orc": { bonuses: { for: 2, con: 1 }, trait: "Força e resistência física." }
    }
  },
  "Tiefling": {
    source: "SRD 5.1/5.2.1",
    traits: "Visão no escuro, resistência a fogo e magia de linhagem.",
    subraces: {
      "Linhagem Infernal": { bonuses: { car: 2, int: 1 }, trait: "Magia infernal clássica." },
      "Linhagem Abissal": { bonuses: { car: 2, con: 1 }, trait: "Adaptação de magia caótica." }
    }
  },
  "Orc": {
    source: "SRD 5.2.1",
    traits: "Pico de adrenalina, resistência implacável e visão no escuro.",
    subraces: {
      "Orc Errante": { bonuses: { for: 2, con: 1 }, trait: "Mobilidade e vigor." }
    }
  },
  "Goliata": {
    source: "SRD 5.2.1",
    traits: "Forma poderosa, constituição robusta e ancestralidade gigante.",
    subraces: {
      "Gigante das Colinas": { bonuses: { for: 2, con: 1 }, trait: "Derruba criaturas com impacto." },
      "Gigante de Pedra": { bonuses: { con: 2, for: 1 }, trait: "Resistência e firmeza pétrea." },
      "Gigante de Gelo": { bonuses: { con: 2, sab: 1 }, trait: "Resistência e legado do frio." },
      "Gigante de Fogo": { bonuses: { for: 2, car: 1 }, trait: "Legado ígneo." },
      "Gigante das Nuvens": { bonuses: { car: 2, con: 1 }, trait: "Passo sobrenatural." },
      "Gigante das Tempestades": { bonuses: { sab: 2, for: 1 }, trait: "Retaliação trovejante." }
    }
  },
  "Forjado Bélico": {
    source: "Legado adaptado",
    traits: "Corpo construído, resistência e proteção integrada.",
    subraces: {
      "Sentinela": { bonuses: { con: 2, for: 1 }, trait: "Estrutura defensiva." },
      "Especialista": { bonuses: { con: 2, int: 1 }, trait: "Ferramentas integradas." }
    }
  },
  "Firbolg": {
    source: "Legado adaptado",
    traits: "Magia natural, fala com animais e força de gigante.",
    subraces: { "Guardião Silvestre": { bonuses: { sab: 2, for: 1 }, trait: "Proteção da floresta." } }
  },
  "Tabaxi": {
    source: "Legado adaptado",
    traits: "Agilidade felina, escalada e explosão de velocidade.",
    subraces: { "Viajante Felino": { bonuses: { dex: 2, car: 1 }, trait: "Curiosidade e mobilidade." } }
  },
  "Goblin": {
    source: "Legado adaptado",
    traits: "Agilidade, visão no escuro e fuga veloz.",
    subraces: {
      "Goblin Astuto": { bonuses: { dex: 2, int: 1 }, trait: "Movimento evasivo." },
      "Bugbear": { bonuses: { for: 2, dex: 1 }, trait: "Alcance e surpresa." },
      "Hobgoblin": { bonuses: { con: 2, int: 1 }, trait: "Disciplina marcial." }
    }
  },
  "Povo-Lagarto": {
    source: "Legado adaptado",
    traits: "Adaptação aquática, mordida e armadura natural.",
    subraces: { "Caçador dos Pântanos": { bonuses: { con: 2, sab: 1 }, trait: "Sobrevivência anfíbia." } }
  },
  "Minotauro": {
    source: "Legado adaptado",
    traits: "Chifres, investida e orientação em labirintos.",
    subraces: { "Chifres de Ferro": { bonuses: { for: 2, con: 1 }, trait: "Investida poderosa." } }
  }
};

export const raceOptions = Object.keys(raceData);

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
  "Bárbaro": { multiclass: { all: ["for"] }, hitDie: "d12", attackStat: "for", attackDie: "1d12", weaponStyle: "Arma pesada corpo a corpo", castingStat: "", subclasses: ["Caminho do Berserker", "Caminho do Guardião Totêmico"], core: ["Fúria", "Defesa sem Armadura", "Ataque Imprudente", "Ataque Extra", "Crítico Brutal"] },
  "Guerreiro": { multiclass: { any: ["for", "dex"] }, hitDie: "d10", attackStat: "for/dex", attackDie: "1d8 ou 1d12", weaponStyle: "Arma marcial versátil", castingStat: "", subclasses: ["Campeão", "Mestre de Manobras"], core: ["Estilo de Luta", "Retomar o Fôlego", "Surto de Ação", "Ataque Extra", "Indomável"] },
  "Paladino": { multiclass: { all: ["for", "car"] }, hitDie: "d10", attackStat: "for", attackDie: "1d8", weaponStyle: "Espada e escudo ou arma pesada", castingStat: "car", subclasses: ["Juramento de Devoção", "Juramento da Aurora"], core: ["Imposição das Mãos", "Punição Divina", "Aura de Proteção", "Ataque Extra", "Toque Purificador"] },
  "Patrulheiro": { multiclass: { all: ["dex", "sab"] }, hitDie: "d10", attackStat: "dex", attackDie: "1d8", weaponStyle: "Arco, duas armas ou arma leve", castingStat: "sab", subclasses: ["Caçador", "Guardião das Feras"], core: ["Inimigo Favorito", "Explorador Hábil", "Estilo de Luta", "Ataque Extra", "Incansável"] },
  "Ladino": { multiclass: { all: ["dex"] }, hitDie: "d8", attackStat: "dex", attackDie: "1d4 ou 1d6", weaponStyle: "Arma ágil/finesse para ataque furtivo", castingStat: "", subclasses: ["Ladrão", "Sombra Cortante"], core: ["Ataque Furtivo", "Especialização", "Ação Ardilosa", "Esquiva Sobrenatural", "Evasão"] },
  "Monge": { multiclass: { all: ["dex", "sab"] }, hitDie: "d8", attackStat: "dex", attackDie: "1d4 a 1d10", weaponStyle: "Golpes desarmados e armas simples", castingStat: "sab", subclasses: ["Mão Aberta", "Caminho da Sombra"], core: ["Artes Marciais", "Foco", "Movimento sem Armadura", "Ataque Extra", "Evasão"] },
  "Bardo": { multiclass: { all: ["car"] }, hitDie: "d8", attackStat: "dex/car", attackDie: "1d6", weaponStyle: "Arma leve ou truque de CAR", castingStat: "car", subclasses: ["Colégio do Conhecimento", "Colégio do Valor"], core: ["Inspiração de Bardo", "Versatilidade", "Especialização", "Fonte de Inspiração", "Segredos Mágicos"] },
  "Clérigo": { multiclass: { all: ["sab"] }, hitDie: "d8", attackStat: "sab/for", attackDie: "1d8", weaponStyle: "Arma simples ou magia de SAB", castingStat: "sab", subclasses: ["Domínio da Vida", "Domínio da Luz"], core: ["Conjuração", "Canalizar Divindade", "Destruir Mortos-Vivos", "Intervenção Divina"] },
  "Mago": { multiclass: { all: ["int"] }, hitDie: "d6", attackStat: "int", attackDie: "1d6", weaponStyle: "Truques e foco arcano", castingStat: "int", subclasses: ["Evocador", "Ilusionista"], core: ["Grimório", "Recuperação Arcana", "Memorizar Magia", "Maestria em Magia", "Magias Características"] },
  "Feiticeiro": { multiclass: { all: ["car"] }, hitDie: "d6", attackStat: "car", attackDie: "1d6", weaponStyle: "Truques e magia inata", castingStat: "car", subclasses: ["Feitiçaria Dracônica", "Magia Selvagem Controlada"], core: ["Conjuração Inata", "Fonte de Magia", "Metamagia", "Restauração Feiticeira"] },
  "Bruxo": { multiclass: { all: ["car"] }, hitDie: "d8", attackStat: "car", attackDie: "1d10", weaponStyle: "Rajada mística ou arma de pacto", castingStat: "car", subclasses: ["Patrono Corruptor", "Patrono Feérico"], core: ["Magia de Pacto", "Invocações Místicas", "Dádiva do Pacto", "Arcanos Místicos"] },
  "Druida": { multiclass: { all: ["sab"] }, hitDie: "d8", attackStat: "sab", attackDie: "1d8", weaponStyle: "Magia natural, cajado ou forma selvagem", castingStat: "sab", subclasses: ["Círculo da Terra", "Círculo da Lua"], core: ["Druídico", "Conjuração", "Forma Selvagem", "Corpo Atemporal", "Arquedruida"] }
};

export const universalLevelFeatures = {
  1: "Fundamentos da classe",
  2: "Recurso central aprimorado",
  3: "Escolha de subclasse",
  4: "Melhoria de atributo ou talento",
  5: "Salto de poder do segundo patamar",
  6: "Recurso de subclasse",
  7: "Defesa ou utilidade avançada",
  8: "Melhoria de atributo ou talento",
  9: "Proficiência +4 e novo patamar de recursos",
  10: "Recurso de subclasse",
  11: "Poder heroico",
  12: "Melhoria de atributo ou talento",
  13: "Proficiência +5 e recurso avançado",
  14: "Recurso de subclasse",
  15: "Aprimoramento superior",
  16: "Melhoria de atributo ou talento",
  17: "Poder épico",
  18: "Recurso de classe superior",
  19: "Dádiva épica ou melhoria de atributo",
  20: "Ápice da classe"
};

export const raceAbilityBySubrace = {
  "Anão da Colina": "Tenacidade anã: PV adicional por nível.",
  "Anão da Montanha": "Treinamento de armadura e porte robusto.",
  "Alto Elfo": "Truque arcano e treinamento élfico.",
  "Elfo da Floresta": "Máscara da natureza e deslocamento superior.",
  Drow: "Magia drow e visão no escuro superior.",
  "Pés-Leves": "Furtividade natural.",
  Robusto: "Resiliência contra veneno.",
  "Humano Versátil": "Perícia ou talento inicial adaptado.",
  "Humano Heroico": "Impulso heroico uma vez por descanso.",
  "Ancestral de Fogo": "Sopro elemental e resistência a fogo.",
  "Ancestral de Frio": "Sopro elemental e resistência a frio.",
  "Ancestral de Eletricidade": "Sopro elemental e resistência elétrica.",
  "Ancestral de Ácido": "Sopro elemental e resistência a ácido.",
  "Ancestral de Veneno": "Sopro elemental e resistência a veneno.",
  "Gnomo da Floresta": "Ilusão menor e fala com animais pequenos.",
  "Gnomo das Rochas": "Conhecimento de artífice.",
  "Herança Versátil": "Combina duas aptidões adicionais.",
  "Herança Orc": "Força e resistência física.",
  "Linhagem Infernal": "Resistência a fogo e magia infernal.",
  "Linhagem Abissal": "Resistência a fogo e magia infernal.",
  "Orc Errante": "Mobilidade e vigor.",
  "Gigante das Colinas": "Derruba criaturas com impacto.",
  "Gigante de Pedra": "Resistência e firmeza pétrea.",
  "Gigante de Gelo": "Resistência e legado do frio.",
  "Gigante de Fogo": "Legado ígneo.",
  "Gigante das Nuvens": "Passo sobrenatural de ancestral gigante.",
  "Gigante das Tempestades": "Retaliação trovejante.",
  Sentinela: "Proteção integrada.",
  Especialista: "Ferramentas integradas.",
  "Guardião Silvestre": "Magia natural e invisibilidade curta.",
  "Viajante Felino": "Explosão de velocidade felina.",
  "Goblin Astuto": "Movimento evasivo.",
  Bugbear: "Alcance e surpresa.",
  Hobgoblin: "Disciplina marcial.",
  "Caçador dos Pântanos": "Sobrevivência anfíbia.",
  "Chifres de Ferro": "Investida poderosa."
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
  return classData[className]?.subclasses || ["Subclasse personalizada"];
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
