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
  },
  "Fragmentado": {
    source: "Shattered Rebirth",
    traits: "A Praga Estilhaçada parou no meio do corpo. Você retorna após a queda, mas perde pedaços de si.",
    subraces: {
      "Cristal Azul": { bonuses: { sab: 2, con: 1 }, trait: "Lucidez fria; reduz pânico e delírio em cenas de horror." },
      "Cristal Escarlate": { bonuses: { for: 2, con: 1 }, trait: "Fúria preservada; empurra o corpo além da dor." },
      "Cristal Amarelo": { bonuses: { int: 2, dex: 1 }, trait: "Mente corrosiva; percebe padrões da praga e pontos fracos." }
    }
  },
  "Vidrano": {
    source: "Shattered Rebirth",
    traits: "Descendentes de cidades muradas que nasceram com vidro vivo sob a pele.",
    subraces: {
      "Muralhado": { bonuses: { con: 2, car: 1 }, trait: "Presença severa e resistência a rejeição social." },
      "Sino Vazio": { bonuses: { dex: 2, sab: 1 }, trait: "Ouve o tilintar antes dos surtos e emboscadas." }
    }
  },
  "Cinzerroto": {
    source: "Shattered Rebirth",
    traits: "Sobreviventes de pilhas de cadáveres, reconstruídos por cinza, farpas e memória quebrada.",
    subraces: {
      "Ossário": { bonuses: { con: 2, for: 1 }, trait: "Difícil de derrubar; marcas da morte viram armadura narrativa." },
      "Coração Opaco": { bonuses: { car: 2, sab: 1 }, trait: "Mantém empatia mesmo com lembranças faltando." }
    }
  }
};

export const systemNames = {
  DND: "D&D",
  SHATTERED_REBIRTH: "SR",
  OSR: "OSR",
  T20: "T20",
  CYBERPUNK: "CBP",
  ARCANE: "ARC",
  OTHER: "OTH"
};

export const systemLabels = {
  "D&D": "D&D",
  SR: "SR",
  OSR: "OSR",
  T20: "T20",
  CBP: "CBP",
  ARC: "ARC",
  OTH: "OTH"
};

export const legacySystemMap = {
  DND: systemNames.DND,
  "D&D": systemNames.DND,
  "Shattered Rebirth": systemNames.SHATTERED_REBIRTH,
  Outro: systemNames.OTHER
};

export const systemOptions = Object.values(systemNames);

const raceSystemTags = {
  Fragmentado: [systemNames.SHATTERED_REBIRTH],
  Vidrano: [systemNames.SHATTERED_REBIRTH],
  Cinzerroto: [systemNames.SHATTERED_REBIRTH]
};

Object.keys(raceData).forEach(name => {
  if (!raceSystemTags[name]) raceSystemTags[name] = [systemNames.DND];
});

const generatedRaceGroups = [
  {
    system: systemNames.DND,
    source: "D&D · expansão da mesa",
    names: ["Aasimar", "Genasi", "Kenku", "Tritão", "Centauro", "Changeling", "Shifter", "Kalashtar", "Harengon", "Fada", "Sátiro", "Leonino", "Vedalken", "Simic Híbrido", "Gith", "Yuan-ti", "Kobold", "Tortle", "Owlin", "Draco-Elfo"]
  },
  {
    system: systemNames.SHATTERED_REBIRTH,
    source: "SR · Praga Estilhaçada",
    names: [
      "Sangue de Prisma", "Eco de Vidro", "Morto-Lúcido", "Muralha Quebrada", "Coro Azul", "Coro Amarelo", "Coro Escarlate", "Lágrima de Quartzo", "Peregrino Rachado", "Carne de Espelho", "Vulto Estilhaçado", "Filho do Ossário", "Cinza de Sino", "Vidrano-Elfo", "Fragmentado-Anão", "Coração de Caco", "Olho de Safira",
      "Humano Fragmentado", "Elfo Estilhaçado", "Anão de Cristal", "Halfling do Sino", "Dragonborn Rachado", "Gnomo Prismático", "Tiefling de Caco", "Orc Vidrado", "Goliata de Quartzo", "Forjado de Vidro", "Tabaxi Escarlate", "Firbolg Azul", "Goblin Amarelo", "Minotauro Espelhado", "Povo-Lagarto de Prisma", "Aasimar Quebrado", "Genasi Vitrificado", "Kenku do Tilintar", "Centauro de Ossário", "Changeling Opaco", "Shifter de Farpas", "Kalashtar Ecoado", "Harengon de Cinza", "Fada do Vidro", "Sátiro Rachado", "Leonino de Quartzo", "Vedalken do Coro", "Kobold Cristalino", "Tortle de Muralha", "Owlin do Sino"
    ]
  },
  {
    system: systemNames.OSR,
    source: "OSR · exploração clássica",
    names: ["Homem-Corvo", "Anão Profundo", "Elfo Crepuscular", "Pequenino de Toca", "Povo-Fungo", "Homem-Javali", "Sombra Viva", "Homem-Cobra", "Meio-Gigante", "Povo-Toupeira", "Nascido da Névoa", "Osso-Andante"]
  },
  {
    system: systemNames.T20,
    source: "T20 · fantasia épica",
    names: ["Kallyanach", "Dahllan", "Hynne", "Osteon", "Medusa", "Sereia Tritão", "Sílfide", "Trog", "Moreau", "Golem Arcano"]
  },
  {
    system: systemNames.CYBERPUNK,
    source: "CBP · futuro urbano",
    names: ["Humano Chrome", "Sintético", "Clone Livre", "Ciborgue Pesado", "Nômade Orbital", "Mutante Neon", "Hacker Neural", "Replicante", "Meio-Máquina", "Bioforjado", "Fantasma Digital"]
  },
  {
    system: systemNames.ARCANE,
    source: "ARC · fantasia arcana",
    names: ["Astralino", "Umbraférico", "Solariano", "Lunarita", "Cristalino", "Povo-Runa", "Meio-Elemental", "Draco-Fada", "Anão-Forjado", "Elfo-Sombra"]
  }
];

const raceAttributePairs = [
  ["for", "con"], ["dex", "sab"], ["int", "dex"], ["car", "sab"], ["con", "car"], ["sab", "int"]
];

generatedRaceGroups.forEach(group => {
  group.names.forEach((name, index) => {
    const [primary, secondary] = raceAttributePairs[index % raceAttributePairs.length];
    raceData[name] = {
      source: group.source,
      traits: `Raça extra de ${group.system} para mesas maiores, com traços mistos e espaço para adaptação do mestre.`,
      subraces: {
        [`${name} Puro`]: { bonuses: { [primary]: 2, [secondary]: 1 }, trait: "Herança direta e traço cultural forte." },
        [`${name} Mestiço`]: { bonuses: { [secondary]: 2, [primary]: 1 }, trait: "Mistura de sangue, técnica e tradição de outro povo." }
      }
    };
    raceSystemTags[name] = [group.system];
  });
});

export { raceSystemTags };

export const raceOptions = Object.keys(raceData);
export const shatteredRebirthRaceOptions = raceOptions.filter(name => raceSystemTags[name]?.includes(systemNames.SHATTERED_REBIRTH));
export const baseRaceOptions = raceOptions.filter(name => raceSystemTags[name]?.includes(systemNames.DND));

export const originOptions = [
  "Acolhido", "Aventureiro Nato", "Criminoso Redimido", "Soldado Veterano"
];

export const classOptions = [
  "Bárbaro", "Guerreiro", "Paladino", "Patrulheiro", "Ladino", "Monge", "Bardo", "Clérigo", "Mago", "Feiticeiro", "Bruxo", "Druida",
  "Artífice", "Cavaleiro Rúnico", "Samurai", "Psi Warrior", "Lâmina Cantante", "Arqueiro Arcano", "Arauto Divino", "Xamã", "Necromante", "Duelista", "Místico", "Caçador de Monstros", "Guardião Ancestral", "Corsário", "Inquisidor", "Cronomante", "Cavaleiro Dracônico", "Herbalista"
];

export const shatteredRebirthClassOptions = [
  "Gravebound", "Shard Knight", "Plague Warden", "Bell Seer", "Ashen Vagrant",
  "Glass Monk", "Choir Butcher", "Pale Binder", "Shard Alchemist", "Wall Hunter", "Cinder Saint", "Blue Veil", "Red Penitent", "Yellow Exorcist", "Memory Thief", "Corpse Cartographer", "Mirror Pilgrim", "Ruin Confessor", "Bell Duelist", "Crystal Beggar"
];

export const osrClassOptions = ["Dungeon Delver", "Torchbearer", "Hex Ranger", "Oathless Knight", "Grave Robber", "Witch Finder", "Mold Druid", "Iron Theurge", "Cave Prophet", "Relic Seeker", "Rat Duelist", "Old King"];
export const tormentaClassOptions = ["Arcanista", "Bucaneiro", "Caçador T20", "Cavaleiro T20", "Inventor", "Nobre", "Druida T20", "Lutador", "Samurai T20", "Frade", "Miragem", "Gladiador"];
export const cyberpunkClassOptions = ["Solo", "Netrunner", "Techie", "Medtech", "Fixer", "Nomad", "Rockerboy", "Corporate", "Media", "Chrome Monk", "Drone Shepherd", "Street Witch", "Black ICE Saint"];
export const arcaneClassOptions = ["Runesmith", "Starcaller", "Voidblade", "Moon Oracle", "Sun Herald", "Spellbreaker", "Fate Weaver", "Dream Knight", "Soul Cartographer", "Leyline Warden", "Prism Duelist", "Golem Binder", "Ink Sorcerer"];

export const allClassOptions = [
  ...classOptions,
  ...shatteredRebirthClassOptions,
  ...osrClassOptions,
  ...tormentaClassOptions,
  ...cyberpunkClassOptions,
  ...arcaneClassOptions
];

export const classSystemTags = Object.fromEntries([
  ...classOptions.map(name => [name, [systemNames.DND]]),
  ...shatteredRebirthClassOptions.map(name => [name, [systemNames.SHATTERED_REBIRTH]]),
  ...osrClassOptions.map(name => [name, [systemNames.OSR]]),
  ...tormentaClassOptions.map(name => [name, [systemNames.T20]]),
  ...cyberpunkClassOptions.map(name => [name, [systemNames.CYBERPUNK]]),
  ...arcaneClassOptions.map(name => [name, [systemNames.ARCANE]])
]);

const manualClassNames = new Set([
  "Bárbaro", "Guerreiro", "Paladino", "Patrulheiro", "Ladino", "Monge", "Bardo", "Clérigo", "Mago", "Feiticeiro", "Bruxo", "Druida",
  "Gravebound", "Shard Knight", "Plague Warden", "Bell Seer", "Ashen Vagrant"
]);

function buildGeneratedClassData(name, index) {
  const attackStats = ["for", "dex", "sab", "int", "car", "for/dex", "dex/car", "sab/int"];
  const hitDice = ["d6", "d8", "d10", "d12"];
  const saves = [["for", "con"], ["dex", "int"], ["sab", "car"], ["int", "sab"], ["dex", "car"], ["con", "sab"]];
  const attackStat = attackStats[index % attackStats.length];
  const castingStat = attackStat.includes("int") ? "int" : attackStat.includes("sab") ? "sab" : attackStat.includes("car") ? "car" : "";
  return {
    multiclass: attackStat.includes("/")
      ? { any: attackStat.split("/") }
      : { all: [attackStat || "for"] },
    saves: saves[index % saves.length],
    hitDie: hitDice[index % hitDice.length],
    attackStat,
    attackDie: index % 3 === 0 ? "1d10" : index % 3 === 1 ? "1d8" : "1d6",
    weaponStyle: `Estilo de ${name}: combate, exploração e recurso próprio adaptável ao sistema`,
    castingStat,
    subclasses: [`${name} da Vanguarda`, `${name} do Véu`, `${name} do Juramento`],
    core: [`Base de ${name}`, `${name} Aprimorado`, `Tradição de ${name}`, `Golpe de ${name}`, `Ápice de ${name}`]
  };
}

export const xpThresholds = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000,
  305000, 355000
];

export const classData = {
  "Bárbaro": { multiclass: { all: ["for"] }, saves: ["for", "con"], hitDie: "d12", attackStat: "for", attackDie: "1d12", weaponStyle: "Arma pesada corpo a corpo", castingStat: "", subclasses: ["Caminho do Berserker", "Caminho do Guardião Totêmico"], core: ["Fúria", "Defesa sem Armadura", "Ataque Imprudente", "Ataque Extra", "Crítico Brutal"] },
  "Guerreiro": { multiclass: { any: ["for", "dex"] }, saves: ["for", "con"], hitDie: "d10", attackStat: "for/dex", attackDie: "1d8 ou 1d12", weaponStyle: "Arma marcial versátil", castingStat: "", subclasses: ["Campeão", "Mestre de Manobras"], core: ["Estilo de Luta", "Retomar o Fôlego", "Surto de Ação", "Ataque Extra", "Indomável"] },
  "Paladino": { multiclass: { all: ["for", "car"] }, saves: ["sab", "car"], hitDie: "d10", attackStat: "for", attackDie: "1d8", weaponStyle: "Espada e escudo ou arma pesada", castingStat: "car", subclasses: ["Juramento de Devoção", "Juramento da Aurora"], core: ["Imposição das Mãos", "Punição Divina", "Aura de Proteção", "Ataque Extra", "Toque Purificador"] },
  "Patrulheiro": { multiclass: { all: ["dex", "sab"] }, saves: ["for", "dex"], hitDie: "d10", attackStat: "dex", attackDie: "1d8", weaponStyle: "Arco, duas armas ou arma leve", castingStat: "sab", subclasses: ["Caçador", "Guardião das Feras"], core: ["Inimigo Favorito", "Explorador Hábil", "Estilo de Luta", "Ataque Extra", "Incansável"] },
  "Ladino": { multiclass: { all: ["dex"] }, saves: ["dex", "int"], hitDie: "d8", attackStat: "dex", attackDie: "1d4 ou 1d6", weaponStyle: "Arma ágil/finesse para ataque furtivo", castingStat: "", subclasses: ["Ladrão", "Sombra Cortante"], core: ["Ataque Furtivo", "Especialização", "Ação Ardilosa", "Esquiva Sobrenatural", "Evasão"] },
  "Monge": { multiclass: { all: ["dex", "sab"] }, saves: ["for", "dex"], hitDie: "d8", attackStat: "dex", attackDie: "1d4 a 1d10", weaponStyle: "Golpes desarmados e armas simples", castingStat: "sab", subclasses: ["Mão Aberta", "Caminho da Sombra"], core: ["Artes Marciais", "Foco", "Movimento sem Armadura", "Ataque Extra", "Evasão"] },
  "Bardo": { multiclass: { all: ["car"] }, saves: ["dex", "car"], hitDie: "d8", attackStat: "dex/car", attackDie: "1d6", weaponStyle: "Arma leve ou truque de CAR", castingStat: "car", subclasses: ["Colégio do Conhecimento", "Colégio do Valor"], core: ["Inspiração de Bardo", "Versatilidade", "Especialização", "Fonte de Inspiração", "Segredos Mágicos"] },
  "Clérigo": { multiclass: { all: ["sab"] }, saves: ["sab", "car"], hitDie: "d8", attackStat: "sab/for", attackDie: "1d8", weaponStyle: "Arma simples ou magia de SAB", castingStat: "sab", subclasses: ["Domínio da Vida", "Domínio da Luz"], core: ["Conjuração", "Canalizar Divindade", "Destruir Mortos-Vivos", "Intervenção Divina"] },
  "Mago": { multiclass: { all: ["int"] }, saves: ["int", "sab"], hitDie: "d6", attackStat: "int", attackDie: "1d6", weaponStyle: "Truques e foco arcano", castingStat: "int", subclasses: ["Evocador", "Ilusionista"], core: ["Grimório", "Recuperação Arcana", "Memorizar Magia", "Maestria em Magia", "Magias Características"] },
  "Feiticeiro": { multiclass: { all: ["car"] }, saves: ["con", "car"], hitDie: "d6", attackStat: "car", attackDie: "1d6", weaponStyle: "Truques e magia inata", castingStat: "car", subclasses: ["Feitiçaria Dracônica", "Magia Selvagem Controlada"], core: ["Conjuração Inata", "Fonte de Magia", "Metamagia", "Restauração Feiticeira"] },
  "Bruxo": { multiclass: { all: ["car"] }, saves: ["sab", "car"], hitDie: "d8", attackStat: "car", attackDie: "1d10", weaponStyle: "Rajada mística ou arma de pacto", castingStat: "car", subclasses: ["Patrono Corruptor", "Patrono Feérico"], core: ["Magia de Pacto", "Invocações Místicas", "Dádiva do Pacto", "Arcanos Místicos"] },
  "Druida": { multiclass: { all: ["sab"] }, saves: ["int", "sab"], hitDie: "d8", attackStat: "sab", attackDie: "1d8", weaponStyle: "Magia natural, cajado ou forma selvagem", castingStat: "sab", subclasses: ["Círculo da Terra", "Círculo da Lua"], core: ["Druídico", "Conjuração", "Forma Selvagem", "Corpo Atemporal", "Arquedruida"] },
  "Gravebound": { multiclass: { all: ["con"] }, saves: ["con", "sab"], hitDie: "d12", attackStat: "for/con", attackDie: "1d12", weaponStyle: "Armas pesadas, carne morta e resistência brutal", castingStat: "", subclasses: ["Corpse Saint", "Pit Revenant", "Bone Lantern"], core: ["Undying Flesh", "Corpse Rise", "Grave Debt", "Shatter Resist", "Last Memory"] },
  "Shard Knight": { multiclass: { any: ["for", "dex"] }, saves: ["for", "con"], hitDie: "d10", attackStat: "for/dex", attackDie: "1d10", weaponStyle: "Lâminas rachadas, escudos de vidro e duelos lentos", castingStat: "", subclasses: ["Glass Bastion", "Red Edge", "Mirror Duelist"], core: ["Crystal Guard", "Splinter Counter", "Heavy Step", "Shardbreaker", "Crown of Cuts"] },
  "Plague Warden": { multiclass: { all: ["sab"] }, saves: ["sab", "con"], hitDie: "d8", attackStat: "sab/dex", attackDie: "1d8", weaponStyle: "Ferramentas de contenção, sinos e lâminas cirúrgicas", castingStat: "sab", subclasses: ["Bell Doctor", "Yellow Choir", "Mercy Cleaver"], core: ["Plague Sense", "Lull the Chime", "Warding Rite", "Cleanse Shards", "Silent Ward"] },
  "Bell Seer": { multiclass: { all: ["int"] }, saves: ["int", "sab"], hitDie: "d6", attackStat: "int", attackDie: "1d6", weaponStyle: "Presságios, vidro ressonante e rituais mentais", castingStat: "int", subclasses: ["Blue Oracle", "Broken Choir", "Dream Cartographer"], core: ["Hear the Glass", "Echo Casting", "Memory Map", "Fracture Vision", "Half-Sung Fate"] },
  "Ashen Vagrant": { multiclass: { all: ["dex"] }, saves: ["dex", "car"], hitDie: "d8", attackStat: "dex/car", attackDie: "1d6", weaponStyle: "Adagas, truques sujos e mobilidade de estrada", castingStat: "car", subclasses: ["Road Heretic", "Wall Exile", "Cinder Trickster"], core: ["Hunted Step", "Borrowed Face", "Rotten Luck", "Escape the Pile", "Nameless Return"] }
};

Object.assign(
  classData,
  Object.fromEntries(
    allClassOptions
      .filter(name => !manualClassNames.has(name))
      .map((name, index) => [name, buildGeneratedClassData(name, index)])
  )
);

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
  17: "Proficiência +6 e poder épico",
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
  "Chifres de Ferro": "Investida poderosa.",
  "Cristal Azul": "Lucidez fragmentada.",
  "Cristal Escarlate": "Fúria de vidro.",
  "Cristal Amarelo": "Percepção corrosiva.",
  Muralhado: "Sangue das muralhas.",
  "Sino Vazio": "Audição do tilintar.",
  "Ossário": "Carne de ossário.",
  "Coração Opaco": "Empatia persistente."
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
  return 30 + Math.max(0, lvl - 1) * 2;
}

export function getRemainingPoints(level, values) {
  const used = values.reduce((sum, current) => sum + Number(current || 0), 0);
  const budget = computePointBudget(level);
  return { used, remaining: budget - used, budget };
}
