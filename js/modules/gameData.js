import { allClassOptions, classDisplayNames } from './mechanics.js';

export const spellcastingClasses = [
  "Bardo", "Clérigo", "Druida", "Paladino", "Patrulheiro", "Feiticeiro", "Bruxo", "Mago"
];

export const classGrantedSpells = {
  Bardo: [{ level: 1, spells: ["Zombaria Viciosa", "Luz", "Curar Ferimentos"] }, { level: 3, spells: ["Sugestão"] }, { level: 5, spells: ["Dissipar Magia"] }],
  "Clérigo": [{ level: 1, spells: ["Orientação", "Taumaturgia", "Curar Ferimentos"] }, { level: 3, spells: ["Arma Espiritual"] }, { level: 5, spells: ["Espíritos Guardiões"] }],
  Druida: [{ level: 1, spells: ["Orientação", "Falar com Animais", "Curar Ferimentos"] }, { level: 3, spells: ["Passos sem Pegadas"] }, { level: 5, spells: ["Dissipar Magia"] }],
  Paladino: [{ level: 2, spells: ["Curar Ferimentos", "Punição Ardente"] }, { level: 5, spells: ["Proteção contra a Morte"] }],
  Patrulheiro: [{ level: 2, spells: ["Golpe Enredante", "Falar com Animais"] }, { level: 5, spells: ["Passos sem Pegadas"] }],
  Feiticeiro: [{ level: 1, spells: ["Estouro Feiticeiro", "Orbe Cromático", "Escudo"] }, { level: 3, spells: ["Passo Nebuloso"] }, { level: 5, spells: ["Bola de Fogo"] }],
  Bruxo: [{ level: 1, spells: ["Rajada Mística", "Maldição", "Repreensão Infernal"] }, { level: 3, spells: ["Escuridão"] }, { level: 5, spells: ["Contramágica"] }],
  Mago: [{ level: 1, spells: ["Luz", "Mãos Mágicas", "Mísseis Mágicos", "Escudo"] }, { level: 3, spells: ["Passo Nebuloso"] }, { level: 5, spells: ["Bola de Fogo"] }, { level: 11, spells: ["Desintegrar"] }]
};

export const raceGrantedSpells = {
  "Alto Elfo": ["Mãos Mágicas"],
  Drow: ["Luz", "Escuridão"],
  "Linhagem Infernal": ["Taumaturgia", "Repreensão Infernal"],
  "Linhagem Abissal": ["Estouro Feiticeiro"],
  "Ancestral de Fogo": ["Punição Ardente"],
  "Gigante de Fogo": ["Luz"],
  "Gigante das Nuvens": ["Passo Nebuloso"]
};

export const abilityCatalog = [
  { className: "Geral", name: "Talento Adaptável", cost: 1, description: "Escolha uma perícia ou ferramenta e ganhe proficiência narrativa nela." },
  { className: "Bárbaro", name: "Investida Furiosa", cost: 1, description: "Ao entrar em fúria, avance até 3 m antes do primeiro ataque." },
  { className: "Guerreiro", name: "Golpe Preciso", cost: 1, description: "Uma vez por combate, adicione +2 ao ataque depois de ver o resultado do d20." },
  { className: "Paladino", name: "Punição Guardada", cost: 2, description: "Ao acertar, converta energia mágica em dano radiante extra definido pelo mestre." },
  { className: "Patrulheiro", name: "Marca do Caçador", cost: 1, description: "Marque um alvo e ganhe +1 no dano contra ele até trocar de alvo." },
  { className: "Ladino", name: "Sombra Oportunista", cost: 1, description: "Depois de se esconder, seu próximo ataque furtivo recebe +1 no dano." },
  { className: "Monge", name: "Passo do Vento", cost: 1, description: "Gaste foco para deslocar-se sem provocar reação narrativa." },
  { className: "Bardo", name: "Inspiração Cortante", cost: 2, description: "Reduza em 1d6 uma rolagem inimiga que você possa perceber." },
  { className: "Clérigo", name: "Canalizar Milagre", cost: 2, description: "Use energia divina para curar ou repelir criaturas profanas." },
  { className: "Druida", name: "Forma Selvagem Menor", cost: 2, description: "Assuma uma forma animal simples para exploração por curto período." },
  { className: "Feiticeiro", name: "Metamagia: Acelerar", cost: 3, description: "Uma magia simples pode ser conjurada como ação rápida, se o mestre permitir." },
  { className: "Bruxo", name: "Invocação: Visão Arcana", cost: 2, description: "Detecte traços mágicos próximos sem gastar espaço de magia." },
  { className: "Mago", name: "Recuperação Arcana", cost: 2, description: "Recupere parte da energia mágica após um descanso curto." },
  { className: "Gravebound", name: "Mão do Ossário", cost: 1, description: "Depois de retornar, ganhe vantagem narrativa para se levantar, agarrar ou bloquear passagem." },
  { className: "Shard Knight", name: "Postura de Vidro", cost: 1, description: "Até o fim da cena, descreva defesa rígida; o próximo contra-ataque recebe +1 no dano." },
  { className: "Plague Warden", name: "Sutura de Sinos", cost: 2, description: "Reduza sintomas de um Fragmentado na cena e permita uma tentativa segura de recuar." },
  { className: "Bell Seer", name: "Presságio Partido", cost: 2, description: "Antes de uma rolagem importante, declare uma visão curta para ganhar +2 ou revelar risco oculto." },
  { className: "Ashen Vagrant", name: "Nome Emprestado", cost: 1, description: "Passe por guarda, patrulha ou testemunha usando identidade roubada ou esquecida." }
];

const generatedAbilityPatterns = [
  ["Técnica Inicial", 1, "ganhe +1 narrativo em uma ação central da classe durante a cena."],
  ["Reação Tática", 1, "quando sofrer pressão, reposicione-se ou proteja um aliado próximo."],
  ["Golpe Assinado", 2, "adicione dano, controle ou condição leve ao próximo acerto relevante."],
  ["Rito de Campo", 2, "prepare uma vantagem de exploração, social ou investigação ligada ao tema da classe."],
  ["Ápice Momentâneo", 3, "uma vez por descanso, transforme uma falha importante em sucesso com custo narrativo."]
];

allClassOptions.forEach(className => {
  generatedAbilityPatterns.forEach(([suffix, cost, description]) => {
    const localizedClassName = classDisplayNames[className] || className;
    const name = `${suffix} de ${localizedClassName}`;
    if (abilityCatalog.some(ability => ability.name === name)) return;
    abilityCatalog.push({
      className,
      name,
      cost,
      description: `${className}: ${description}`
    });
  });
});

export const spellCatalog = [
  { name: "Luz", level: 0, school: "Evocação", classes: ["Bardo", "Clérigo", "Feiticeiro", "Mago"] },
  { name: "Mãos Mágicas", level: 0, school: "Conjuração", classes: ["Bardo", "Feiticeiro", "Bruxo", "Mago"] },
  { name: "Orientação", level: 0, school: "Adivinhação", classes: ["Clérigo", "Druida"] },
  { name: "Rajada Mística", level: 0, school: "Evocação", classes: ["Bruxo"] },
  { name: "Taumaturgia", level: 0, school: "Transmutação", classes: ["Clérigo"] },
  { name: "Zombaria Viciosa", level: 0, school: "Encantamento", classes: ["Bardo"] },
  { name: "Curar Ferimentos", level: 1, school: "Abjuração", classes: ["Bardo", "Clérigo", "Druida", "Paladino", "Patrulheiro"] },
  { name: "Detectar Magia", level: 1, school: "Adivinhação", classes: ["Bardo", "Clérigo", "Druida", "Paladino", "Patrulheiro", "Feiticeiro", "Mago"] },
  { name: "Escudo", level: 1, school: "Abjuração", classes: ["Feiticeiro", "Mago"] },
  { name: "Falar com Animais", level: 1, school: "Adivinhação", classes: ["Bardo", "Druida", "Patrulheiro"] },
  { name: "Mísseis Mágicos", level: 1, school: "Evocação", classes: ["Feiticeiro", "Mago"] },
  { name: "Repreensão Infernal", level: 1, school: "Evocação", classes: ["Bruxo"] },
  { name: "Sono", level: 1, school: "Encantamento", classes: ["Bardo", "Feiticeiro", "Mago"] },
  { name: "Arma Espiritual", level: 2, school: "Evocação", classes: ["Clérigo"] },
  { name: "Escuridão", level: 2, school: "Evocação", classes: ["Feiticeiro", "Bruxo", "Mago"] },
  { name: "Passo Nebuloso", level: 2, school: "Conjuração", classes: ["Feiticeiro", "Bruxo", "Mago"] },
  { name: "Passos sem Pegadas", level: 2, school: "Abjuração", classes: ["Druida", "Patrulheiro"] },
  { name: "Restauração Menor", level: 2, school: "Abjuração", classes: ["Bardo", "Clérigo", "Druida", "Paladino", "Patrulheiro"] },
  { name: "Sugestão", level: 2, school: "Encantamento", classes: ["Bardo", "Feiticeiro", "Bruxo", "Mago"] },
  { name: "Bola de Fogo", level: 3, school: "Evocação", classes: ["Feiticeiro", "Mago"] },
  { name: "Contramágica", level: 3, school: "Abjuração", classes: ["Feiticeiro", "Bruxo", "Mago"] },
  { name: "Dissipar Magia", level: 3, school: "Abjuração", classes: ["Bardo", "Clérigo", "Druida", "Paladino", "Feiticeiro", "Bruxo", "Mago"] },
  { name: "Espíritos Guardiões", level: 3, school: "Conjuração", classes: ["Clérigo"] },
  { name: "Relâmpago", level: 3, school: "Evocação", classes: ["Feiticeiro", "Mago"] },
  { name: "Porta Dimensional", level: 4, school: "Conjuração", classes: ["Bardo", "Feiticeiro", "Bruxo", "Mago"] },
  { name: "Pele de Pedra", level: 4, school: "Transmutação", classes: ["Druida", "Patrulheiro", "Feiticeiro", "Mago"] },
  { name: "Proteção contra a Morte", level: 4, school: "Abjuração", classes: ["Clérigo", "Paladino"] },
  { name: "Banimento", level: 4, school: "Abjuração", classes: ["Clérigo", "Paladino", "Feiticeiro", "Bruxo", "Mago"] },
  { name: "Comunhão com a Natureza", level: 5, school: "Adivinhação", classes: ["Druida", "Patrulheiro"] },
  { name: "Cone de Frio", level: 5, school: "Evocação", classes: ["Feiticeiro", "Mago"] },
  { name: "Curar Ferimentos em Massa", level: 5, school: "Abjuração", classes: ["Bardo", "Clérigo", "Druida"] },
  { name: "Imobilizar Monstro", level: 5, school: "Encantamento", classes: ["Bardo", "Feiticeiro", "Bruxo", "Mago"] },
  { name: "Orbe Cromático", level: 1, school: "Evocação", classes: ["Feiticeiro", "Mago"], effect: "Ataque elemental com tipo de dano escolhido." },
  { name: "Sussurros Dissonantes", level: 1, school: "Encantamento", classes: ["Bardo"], effect: "Dano psíquico e movimento de fuga." },
  { name: "Faca de Gelo", level: 1, school: "Conjuração", classes: ["Druida", "Feiticeiro", "Mago"], effect: "Projétil de gelo que explode em área." },
  { name: "Raio de Enfermidade", level: 1, school: "Necromancia", classes: ["Feiticeiro", "Mago"], effect: "Dano venenoso com chance de envenenar." },
  { name: "Punição Ardente", level: 1, school: "Evocação", classes: ["Paladino"], effect: "Ataque causa dano de fogo persistente." },
  { name: "Golpe Enredante", level: 1, school: "Conjuração", classes: ["Patrulheiro"], effect: "Vinculos vegetais restringem o alvo." },
  { name: "Maldição", level: 1, school: "Encantamento", classes: ["Bruxo"], effect: "Aumenta o dano contra uma criatura marcada." },
  { name: "Estouro Feiticeiro", level: 0, school: "Evocação", classes: ["Feiticeiro"], effect: "Truque de energia variável." },
  { name: "Luz Estelar", level: 0, school: "Evocação", classes: ["Bardo", "Druida"], effect: "Luz ofensiva que dificulta invisibilidade." },
  { name: "Elementalismo", level: 0, school: "Transmutação", classes: ["Druida", "Feiticeiro", "Mago"], effect: "Pequenos efeitos ligados aos elementos." },
  { name: "Sopro do Dragão", level: 2, school: "Transmutação", classes: ["Feiticeiro", "Mago"], effect: "Concede um sopro elemental temporário." },
  { name: "Pico Mental", level: 2, school: "Adivinhação", classes: ["Feiticeiro", "Bruxo", "Mago"], effect: "Dano psíquico e rastreamento do alvo." },
  { name: "Força Fantasmagórica", level: 2, school: "Ilusão", classes: ["Bardo", "Feiticeiro", "Mago"], effect: "Cria uma ilusão percebida por um único alvo." },
  { name: "Esfera Vitriólica", level: 4, school: "Evocação", classes: ["Feiticeiro", "Mago"], effect: "Explosão ácida com dano posterior." },
  { name: "Encantar Monstro", level: 4, school: "Encantamento", classes: ["Bardo", "Druida", "Feiticeiro", "Bruxo", "Mago"], effect: "Enfeitiça uma criatura de qualquer tipo." },
  { name: "Aura de Vida", level: 4, school: "Abjuração", classes: ["Clérigo", "Paladino"], effect: "Protege aliados contra energia necrótica." },
  { name: "Invocar Dragão", level: 5, school: "Conjuração", classes: ["Mago"], effect: "Invoca um espírito dracônico aliado." },
  { name: "Desintegrar", level: 6, school: "Transmutação", classes: ["Feiticeiro", "Mago"], effect: "Raio de grande dano de força." },
  { name: "Cura Completa", level: 6, school: "Abjuração", classes: ["Clérigo", "Druida"], effect: "Restaura grande quantidade de vida." },
  { name: "Teleporte", level: 7, school: "Conjuração", classes: ["Bardo", "Feiticeiro", "Mago"], effect: "Transporta o grupo para um destino distante." },
  { name: "Regeneração", level: 7, school: "Transmutação", classes: ["Bardo", "Clérigo", "Druida"], effect: "Restaura vida continuamente e membros perdidos." },
  { name: "Tsunami", level: 8, school: "Conjuração", classes: ["Druida"], effect: "Uma muralha de água avança pelo campo." },
  { name: "Palavra de Poder: Atordoar", level: 8, school: "Encantamento", classes: ["Bardo", "Feiticeiro", "Bruxo", "Mago"], effect: "Atordoa uma criatura vulnerável." },
  { name: "Desejo", level: 9, school: "Conjuração", classes: ["Feiticeiro", "Mago"], effect: "Replica magias ou altera a realidade sob risco." },
  { name: "Palavra de Poder: Curar", level: 9, school: "Encantamento", classes: ["Bardo", "Clérigo"], effect: "Restauração extrema e remoção de condições." }
];
