import { allClassOptions, classDisplayNames } from './mechanics.js';

export const spellcastingClasses = [
  "Bardo", "Clérigo", "Druida", "Paladino", "Patrulheiro", "Feiticeiro", "Bruxo", "Mago",
  "Plague Warden", "Bell Seer", "Ashen Vagrant", "Feiticeira"
];

export const classGrantedSpells = {
  Bardo: [{ level: 1, spells: ["Zombaria Viciosa", "Luz", "Curar Ferimentos"] }, { level: 3, spells: ["Sugestão"] }, { level: 5, spells: ["Dissipar Magia"] }],
  "Clérigo": [{ level: 1, spells: ["Orientação", "Taumaturgia", "Curar Ferimentos"] }, { level: 3, spells: ["Arma Espiritual"] }, { level: 5, spells: ["Espíritos Guardiões"] }],
  Druida: [{ level: 1, spells: ["Orientação", "Falar com Animais", "Curar Ferimentos"] }, { level: 3, spells: ["Passos sem Pegadas"] }, { level: 5, spells: ["Dissipar Magia"] }],
  Paladino: [{ level: 2, spells: ["Curar Ferimentos", "Punição Ardente"] }, { level: 5, spells: ["Proteção contra a Morte"] }],
  Patrulheiro: [{ level: 2, spells: ["Golpe Enredante", "Falar com Animais"] }, { level: 5, spells: ["Passos sem Pegadas"] }],
  Feiticeiro: [{ level: 1, spells: ["Estouro Feiticeiro", "Orbe Cromático", "Escudo"] }, { level: 3, spells: ["Passo Nebuloso"] }, { level: 5, spells: ["Bola de Fogo"] }],
  Bruxo: [{ level: 1, spells: ["Rajada Mística", "Maldição", "Repreensão Infernal"] }, { level: 3, spells: ["Escuridão"] }, { level: 5, spells: ["Contramágica"] }],
  Mago: [{ level: 1, spells: ["Luz", "Mãos Mágicas", "Mísseis Mágicos", "Escudo"] }, { level: 3, spells: ["Passo Nebuloso"] }, { level: 5, spells: ["Bola de Fogo"] }, { level: 11, spells: ["Desintegrar"] }],
  "Plague Warden": [{ level: 1, spells: ["Ouvir a Praga", "Sutura de Cristal"] }, { level: 3, spells: ["Círculo de Sinos"] }, { level: 5, spells: ["Purificação Dolorosa"] }],
  "Bell Seer": [{ level: 1, spells: ["Eco do Vidro", "Presságio Partido"] }, { level: 3, spells: ["Mapa de Memórias"] }, { level: 5, spells: ["Futuro Fraturado"] }],
  "Ashen Vagrant": [{ level: 1, spells: ["Passo de Cinzas", "Rosto Emprestado"] }, { level: 3, spells: ["Manto da Muralha"] }, { level: 5, spells: ["Retorno sem Nome"] }],
  Feiticeira: [{ level: 1, spells: ["Estouro Feiticeiro", "Orbe Cromático", "Escudo"] }, { level: 3, spells: ["Passo Nebuloso", "Imagem Espelhada"] }, { level: 5, spells: ["Bola de Fogo", "Acelerar"] }]
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
      description: `${localizedClassName}: ${description}`
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

spellCatalog.push(
  { name: "Raio de Fogo", level: 0, school: "Evocação", classes: ["Feiticeiro", "Mago"], effect: "Causa dano de fogo à distância." },
  { name: "Toque Arrepiante", level: 0, school: "Necromancia", classes: ["Feiticeiro", "Bruxo", "Mago"], effect: "Causa dano necrótico e dificulta cura." },
  { name: "Chicote de Espinhos", level: 0, school: "Transmutação", classes: ["Druida"], effect: "Causa dano e puxa o alvo." },
  { name: "Chama Sagrada", level: 0, school: "Evocação", classes: ["Clérigo"], effect: "Causa dano radiante contra DEX." },
  { name: "Prestidigitação", level: 0, school: "Transmutação", classes: ["Bardo", "Feiticeiro", "Mago"], effect: "Produz pequenos efeitos mágicos utilitários." },
  { name: "Ilusão Menor", level: 0, school: "Ilusão", classes: ["Bardo", "Feiticeiro", "Bruxo", "Mago"], effect: "Cria um som ou imagem ilusória breve." },
  { name: "Mensagem", level: 0, school: "Transmutação", classes: ["Bardo", "Feiticeiro", "Mago"], effect: "Envia uma frase curta em segredo." },
  { name: "Resistência", level: 0, school: "Abjuração", classes: ["Clérigo", "Druida"], effect: "Fortalece uma salvaguarda por pouco tempo." },
  { name: "Armadura Arcana", level: 1, school: "Abjuração", classes: ["Feiticeiro", "Mago"], effect: "Cria proteção mágica sem armadura." },
  { name: "Bênção", level: 1, school: "Encantamento", classes: ["Clérigo", "Paladino"], effect: "Fortalece ataques e salvaguardas de aliados." },
  { name: "Comando", level: 1, school: "Encantamento", classes: ["Clérigo", "Paladino"], effect: "Obriga uma criatura a seguir uma ordem curta." },
  { name: "Enfeitiçar Pessoa", level: 1, school: "Encantamento", classes: ["Bardo", "Druida", "Feiticeiro", "Bruxo", "Mago"], effect: "Torna um humanoide amistoso temporariamente." },
  { name: "Onda Trovejante", level: 1, school: "Evocação", classes: ["Bardo", "Druida", "Feiticeiro", "Mago"], effect: "Causa dano trovejante e empurra em área." },
  { name: "Névoa Obscurecente", level: 1, school: "Conjuração", classes: ["Druida", "Patrulheiro", "Feiticeiro", "Mago"], effect: "Cria uma área fortemente obscurecida." },
  { name: "Palavra Curativa", level: 1, school: "Evocação", classes: ["Bardo", "Clérigo", "Druida"], effect: "Cura um aliado à distância." },
  { name: "Ajuda", level: 2, school: "Abjuração", classes: ["Clérigo", "Paladino"], effect: "Aumenta temporariamente a vida máxima de aliados." },
  { name: "Imobilizar Pessoa", level: 2, school: "Encantamento", classes: ["Bardo", "Clérigo", "Druida", "Feiticeiro", "Bruxo", "Mago"], effect: "Paralisa um humanoide que falhar na resistência." },
  { name: "Invisibilidade", level: 2, school: "Ilusão", classes: ["Bardo", "Feiticeiro", "Bruxo", "Mago"], effect: "Deixa uma criatura invisível até agir agressivamente." },
  { name: "Levitação", level: 2, school: "Transmutação", classes: ["Feiticeiro", "Mago"], effect: "Eleva uma criatura ou objeto verticalmente." },
  { name: "Raio Ardente", level: 2, school: "Evocação", classes: ["Feiticeiro", "Mago"], effect: "Dispara vários raios que causam dano de fogo." },
  { name: "Silêncio", level: 2, school: "Ilusão", classes: ["Bardo", "Clérigo", "Patrulheiro"], effect: "Impede som e conjuração verbal em uma área." },
  { name: "Teia", level: 2, school: "Conjuração", classes: ["Feiticeiro", "Mago"], effect: "Cria terreno difícil que pode restringir criaturas." },
  { name: "Animar Mortos", level: 3, school: "Necromancia", classes: ["Clérigo", "Mago"], effect: "Ergue um servo morto-vivo sob controle." },
  { name: "Clarividência", level: 3, school: "Adivinhação", classes: ["Bardo", "Clérigo", "Feiticeiro", "Mago"], effect: "Permite observar magicamente um lugar distante." },
  { name: "Medo", level: 3, school: "Ilusão", classes: ["Bardo", "Feiticeiro", "Bruxo", "Mago"], effect: "Amedronta criaturas em uma área cônica." },
  { name: "Padrão Hipnótico", level: 3, school: "Ilusão", classes: ["Bardo", "Feiticeiro", "Bruxo", "Mago"], effect: "Incapacita criaturas fascinadas pelo padrão." },
  { name: "Revivificar", level: 3, school: "Necromancia", classes: ["Clérigo", "Paladino"], effect: "Traz de volta uma criatura morta recentemente." },
  { name: "Voo", level: 3, school: "Transmutação", classes: ["Feiticeiro", "Bruxo", "Mago"], effect: "Concede deslocamento de voo temporário." },
  { name: "Confusão", level: 4, school: "Encantamento", classes: ["Bardo", "Druida", "Feiticeiro", "Mago"], effect: "Desorganiza as ações de criaturas em área." },
  { name: "Invisibilidade Maior", level: 4, school: "Ilusão", classes: ["Bardo", "Feiticeiro", "Mago"], effect: "Mantém invisibilidade mesmo durante ataques." },
  { name: "Metamorfose", level: 4, school: "Transmutação", classes: ["Bardo", "Druida", "Feiticeiro", "Mago"], effect: "Transforma uma criatura em outra forma." },
  { name: "Muralha de Fogo", level: 4, school: "Evocação", classes: ["Druida", "Feiticeiro", "Mago"], effect: "Cria uma barreira que causa dano de fogo." },
  { name: "Coluna de Chamas", level: 5, school: "Evocação", classes: ["Clérigo"], effect: "Causa dano de fogo e radiante em uma coluna." },
  { name: "Criar Passagem", level: 5, school: "Transmutação", classes: ["Mago"], effect: "Abre uma passagem temporária em superfície sólida." },
  { name: "Muralha de Força", level: 5, school: "Evocação", classes: ["Mago"], effect: "Cria uma barreira invisível quase impenetrável." },
  { name: "Telecinésia", level: 5, school: "Transmutação", classes: ["Feiticeiro", "Mago"], effect: "Move criaturas e objetos com força mental." },
  { name: "Globo de Invulnerabilidade", level: 6, school: "Abjuração", classes: ["Feiticeiro", "Mago"], effect: "Bloqueia magias de círculos inferiores." },
  { name: "Relâmpago em Cadeia", level: 6, school: "Evocação", classes: ["Feiticeiro", "Mago"], effect: "Causa dano elétrico que salta entre alvos." },
  { name: "Dedo da Morte", level: 7, school: "Necromancia", classes: ["Feiticeiro", "Bruxo", "Mago"], effect: "Causa enorme dano necrótico a uma criatura." },
  { name: "Viagem Planar", level: 7, school: "Conjuração", classes: ["Clérigo", "Druida", "Feiticeiro", "Bruxo", "Mago"], effect: "Transporta o grupo para outro plano." },
  { name: "Dominar Monstro", level: 8, school: "Encantamento", classes: ["Bardo", "Feiticeiro", "Bruxo", "Mago"], effect: "Controla as ações de uma criatura." },
  { name: "Terremoto", level: 8, school: "Evocação", classes: ["Clérigo", "Druida", "Feiticeiro"], effect: "Devasta uma grande área com tremores." },
  { name: "Chuva de Meteoros", level: 9, school: "Evocação", classes: ["Feiticeiro", "Mago"], effect: "Causa dano massivo de fogo e impacto em grandes áreas." },
  { name: "Ressurreição Verdadeira", level: 9, school: "Necromancia", classes: ["Clérigo", "Druida"], effect: "Restaura completamente uma criatura morta." },
  { name: "Ouvir a Praga", level: 0, school: "Adivinhação", classes: ["Plague Warden"], effect: "Detecta surtos, farpas e infectados próximos." },
  { name: "Sutura de Cristal", level: 1, school: "Abjuração", classes: ["Plague Warden"], effect: "Cura feridas e estabiliza o crescimento de farpas." },
  { name: "Círculo de Sinos", level: 2, school: "Abjuração", classes: ["Plague Warden", "Bell Seer"], effect: "Cria proteção contra medo e avanço da praga." },
  { name: "Purificação Dolorosa", level: 3, school: "Necromancia", classes: ["Plague Warden"], effect: "Remove uma condição ao custo de dano controlado." },
  { name: "Eco do Vidro", level: 0, school: "Adivinhação", classes: ["Bell Seer"], effect: "Revela uma lembrança presa em cristal próximo." },
  { name: "Presságio Partido", level: 1, school: "Adivinhação", classes: ["Bell Seer"], effect: "Concede vantagem narrativa em uma decisão imediata." },
  { name: "Mapa de Memórias", level: 2, school: "Adivinhação", classes: ["Bell Seer"], effect: "Reconstrói caminhos por lembranças fragmentadas." },
  { name: "Futuro Fraturado", level: 3, school: "Adivinhação", classes: ["Bell Seer"], effect: "Permite evitar uma consequência prevista na cena." },
  { name: "Passo de Cinzas", level: 0, school: "Conjuração", classes: ["Ashen Vagrant"], effect: "Move o conjurador por uma curta nuvem de cinzas." },
  { name: "Rosto Emprestado", level: 1, school: "Ilusão", classes: ["Ashen Vagrant"], effect: "Imita aparência e gestos de outra pessoa." },
  { name: "Manto da Muralha", level: 2, school: "Ilusão", classes: ["Ashen Vagrant"], effect: "Oculta aliados de patrulhas e observadores." },
  { name: "Retorno sem Nome", level: 3, school: "Necromancia", classes: ["Ashen Vagrant"], effect: "Escapa de uma consequência social ou mortal imediata." }
);

spellCatalog.push(
  { name: "Dança das Luzes", level: 0, school: "Evocação", classes: ["Bardo", "Feiticeiro", "Mago"], effect: "Cria pequenas luzes móveis sob controle." },
  { name: "Consertar", level: 0, school: "Transmutação", classes: ["Bardo", "Clérigo", "Druida", "Feiticeiro", "Mago"], effect: "Repara uma quebra ou rasgo pequeno em um objeto." },
  { name: "Amizade", level: 0, school: "Encantamento", classes: ["Bardo", "Feiticeiro", "Bruxo", "Mago"], effect: "Concede vantagem social breve com consequência posterior." },
  { name: "Proteção contra Lâminas", level: 0, school: "Abjuração", classes: ["Bardo", "Feiticeiro", "Bruxo", "Mago"], effect: "Reduz temporariamente dano físico recebido." },
  { name: "Alarme", level: 1, school: "Abjuração", classes: ["Mago"], effect: "Avisa quando uma criatura entra na área protegida." },
  { name: "Compreender Idiomas", level: 1, school: "Adivinhação", classes: ["Bardo", "Feiticeiro", "Bruxo", "Mago"], effect: "Permite compreender idiomas falados e escritos." },
  { name: "Disco Flutuante", level: 1, school: "Conjuração", classes: ["Mago"], effect: "Cria uma plataforma flutuante que transporta carga." },
  { name: "Encontrar Familiar", level: 1, school: "Conjuração", classes: ["Mago"], effect: "Convoca um espírito familiar em forma animal." },
  { name: "Identificar", level: 1, school: "Adivinhação", classes: ["Bardo", "Mago"], effect: "Revela propriedades de um objeto ou efeito mágico." },
  { name: "Queda Suave", level: 1, school: "Transmutação", classes: ["Bardo", "Feiticeiro", "Mago"], effect: "Reduz a velocidade de queda de várias criaturas." },
  { name: "Riso Horrível", level: 1, school: "Encantamento", classes: ["Bardo", "Mago"], effect: "Derruba e incapacita temporariamente uma criatura." },
  { name: "Salto", level: 1, school: "Transmutação", classes: ["Druida", "Patrulheiro", "Feiticeiro", "Mago"], effect: "Amplia muito a distância dos saltos." },
  { name: "Alterar-se", level: 2, school: "Transmutação", classes: ["Feiticeiro", "Mago"], effect: "Muda o corpo para adaptação, aparência ou arma natural." },
  { name: "Arrombar", level: 2, school: "Transmutação", classes: ["Bardo", "Feiticeiro", "Mago"], effect: "Abre magicamente fechaduras e travas." },
  { name: "Detectar Pensamentos", level: 2, school: "Adivinhação", classes: ["Bardo", "Feiticeiro", "Mago"], effect: "Lê pensamentos superficiais de criaturas próximas." },
  { name: "Imagem Espelhada", level: 2, school: "Ilusão", classes: ["Feiticeiro", "Bruxo", "Mago"], effect: "Cria duplicatas ilusórias que confundem ataques." },
  { name: "Nublar", level: 2, school: "Ilusão", classes: ["Feiticeiro", "Mago"], effect: "Deixa a imagem do conjurador borrada e difícil de atingir." },
  { name: "Ver Invisibilidade", level: 2, school: "Adivinhação", classes: ["Bardo", "Feiticeiro", "Mago"], effect: "Permite enxergar criaturas e objetos invisíveis." },
  { name: "Acelerar", level: 3, school: "Transmutação", classes: ["Feiticeiro", "Mago"], effect: "Aumenta velocidade, defesa e capacidade de ação." },
  { name: "Forma Gasosa", level: 3, school: "Transmutação", classes: ["Feiticeiro", "Bruxo", "Mago"], effect: "Transforma uma criatura em névoa móvel." },
  { name: "Lentidão", level: 3, school: "Transmutação", classes: ["Feiticeiro", "Mago"], effect: "Reduz movimento, defesa e ações de vários alvos." },
  { name: "Proteção contra Energia", level: 3, school: "Abjuração", classes: ["Clérigo", "Druida", "Patrulheiro", "Feiticeiro", "Mago"], effect: "Concede resistência a um tipo de dano elemental." },
  { name: "Respirar na Água", level: 3, school: "Transmutação", classes: ["Druida", "Patrulheiro", "Feiticeiro", "Mago"], effect: "Permite ao grupo respirar debaixo d'água." },
  { name: "Olho Arcano", level: 4, school: "Adivinhação", classes: ["Mago"], effect: "Cria um sensor invisível móvel para exploração." },
  { name: "Tempestade de Gelo", level: 4, school: "Evocação", classes: ["Druida", "Feiticeiro", "Mago"], effect: "Causa dano de frio e impacto em uma área." },
  { name: "Conhecimento Lendário", level: 5, school: "Adivinhação", classes: ["Bardo", "Clérigo", "Mago"], effect: "Revela histórias e informações sobre um alvo importante." },
  { name: "Sonho", level: 5, school: "Ilusão", classes: ["Bardo", "Bruxo", "Mago"], effect: "Envia uma mensagem ou pesadelo através dos sonhos." },
  { name: "Contingência", level: 6, school: "Evocação", classes: ["Mago"], effect: "Prepara uma magia para disparar sob condição definida." },
  { name: "Criar Mortos-Vivos", level: 6, school: "Necromancia", classes: ["Clérigo", "Bruxo", "Mago"], effect: "Cria servos mortos-vivos mais poderosos." },
  { name: "Mansão Magnífica", level: 7, school: "Conjuração", classes: ["Bardo", "Mago"], effect: "Cria uma residência extradimensional segura." },
  { name: "Labirinto", level: 8, school: "Conjuração", classes: ["Mago"], effect: "Exila temporariamente uma criatura em um labirinto planar." },
  { name: "Parar o Tempo", level: 9, school: "Transmutação", classes: ["Feiticeiro", "Mago"], effect: "Concede turnos extras enquanto o restante do mundo fica suspenso." }
);

spellCatalog.forEach(spell => {
  if (spell.classes.includes("Feiticeiro") && !spell.classes.includes("Feiticeira")) spell.classes.push("Feiticeira");
});
