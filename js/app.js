import {
  raceOptions,
  raceData,
  originOptions,
  classOptions,
  distInputs,
  raceBonusInputs,
  computeProfBonus,
  computeModifier,
  getRemainingPoints,
  requiredMagicLife,
  classData,
  xpThresholds,
  getXpProgress,
  getSubclassOptions,
  getMulticlassRequirement,
  universalLevelFeatures,
  raceAbilityBySubrace
} from './modules/mechanics.js';
import { spellCatalog, spellcastingClasses, classGrantedSpells, raceGrantedSpells, abilityCatalog } from './modules/gameData.js';
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
import { initDiceRoller, rollDice } from './modules/diceRoller.js';

let purchasedSkills = [];
let skillPhoto = '';
let editingSkillIndex = -1;
let bannerPhoto = '';
let inventory = [];
let customItems = [];
let purchasedSpells = [];
let customSpells = [];
let themeColors = { primary: '#7EBAEE', secondary: '#F0A06F' };
let isRestoringCharacter = false;
let draftTimer = null;

const casterManaByClass = {
  Bardo: 6,
  "Clérigo": 6,
  Druida: 6,
  Mago: 6,
  Feiticeiro: 6,
  Bruxo: 5,
  Paladino: 3,
  Patrulheiro: 3,
  Monge: 2
};

const legacyRaceMap = {
  'Alto Elfo': ['Elfo', 'Alto Elfo'],
  'Elfo da Floresta': ['Elfo', 'Elfo da Floresta'],
  Drow: ['Elfo', 'Drow'],
  'Gnomo das Rochas': ['Gnomo', 'Gnomo das Rochas'],
  'Gnomo da Floresta': ['Gnomo', 'Gnomo da Floresta'],
  Bugbear: ['Goblin', 'Bugbear'],
  Goblinoide: ['Goblin', 'Goblin Astuto'],
  Lizardfolk: ['Povo-Lagarto', 'Caçador dos Pântanos']
};

const equipmentCatalog = [
  { id: 'longsword', name: 'Espada longa', category: 'Arma', cost: 6, die: 8, attribute: 'for', range: 'corpo a corpo', description: 'Arma versátil de corte.' },
  { id: 'shortbow', name: 'Arco curto', category: 'Arma', cost: 6, die: 6, attribute: 'dex', range: '24 m', description: 'Arma leve para ataques à distância.' },
  { id: 'dagger', name: 'Adaga', category: 'Arma', cost: 3, die: 4, attribute: 'dex', range: '6 m', description: 'Arma leve e arremessável.' },
  { id: 'greatsword', name: 'Espadão', category: 'Arma', cost: 9, die: 12, attribute: 'for', range: 'corpo a corpo', description: 'Arma pesada de duas mãos.' },
  { id: 'shield', name: 'Escudo', category: 'Armadura', cost: 5, armorBonus: 2, description: '+2 na classe de armadura.' },
  { id: 'leather', name: 'Armadura de couro', category: 'Armadura', cost: 5, armorBase: 11, dexterity: true, description: 'CA 11 + modificador de DEX.' },
  { id: 'chain', name: 'Cota de malha', category: 'Armadura', cost: 9, armorBase: 16, description: 'Define a CA base como 16.' },
  { id: 'healing', name: 'Poção de cura', category: 'Consumível', cost: 3, die: 4, healing: true, description: 'Recupera 2d4 + 2 pontos de vida.' },
  { id: 'rope', name: 'Corda de 15 m', category: 'Aventura', cost: 2, description: 'Ferramenta para exploração.' },
  { id: 'tools', name: 'Kit de ferramentas', category: 'Aventura', cost: 4, description: 'Ferramentas para testes especializados.' },
  { id: 'flame_tongue', name: 'Língua Flamejante', category: 'Arma', rarity: 'Raro', cost: 18, die: 8, attribute: 'for', damageBonus: 2, range: 'corpo a corpo', description: 'Espada mágica inspirada em D&D. +2 no dano e deixa o ataque com chama narrativa.' },
  { id: 'moonbow', name: 'Arco da Lua Prateada', category: 'Arma', rarity: 'Raro', cost: 17, die: 8, attribute: 'dex', attackBonus: 1, damageBonus: 1, range: '45 m', description: '+1 no ataque e dano. Brilha contra criaturas das trevas.' },
  { id: 'guardian_plate', name: 'Placa do Guardião', category: 'Armadura', rarity: 'Raro', cost: 20, armorBase: 18, armorBonus: 1, description: 'CA 18 + 1 mágico. Item pesado para linha de frente.' },
  { id: 'cloak_stars', name: 'Manto das Estrelas', category: 'Acessório', rarity: 'Raro', cost: 14, armorBonus: 1, spellBonus: 1, description: '+1 CA e +1 em CD/ataque de magia enquanto equipado.' },
  { id: 'boots_wind', name: 'Botas do Vento', category: 'Acessório', rarity: 'Incomum', cost: 10, speedBonus: 3, description: '+3 m de deslocamento e vantagem narrativa em saltos.' },
  { id: 'staff_archmage', name: 'Cajado do Arquimago', category: 'Foco', rarity: 'Lendário', cost: 34, die: 6, attribute: 'int', attackBonus: 2, damageBonus: 2, spellBonus: 2, range: '1,5 m', description: '+2 em ataques, dano de arma e magia. Foco lendário.' },
  { id: 'ring_wish', name: 'Anel do Desejo Guardado', category: 'Acessório', rarity: 'Lendário', cost: 40, spellBonus: 3, description: '+3 em magia e espaço narrativo para um milagre raro controlado pelo mestre.' },
  { id: 'amulet_health', name: 'Amuleto da Vitalidade', category: 'Acessório', rarity: 'Raro', cost: 16, maxHpBonus: 10, description: '+10 PV máximos enquanto estiver no inventário.' }
];

function getEquipmentCatalog() {
  return [...equipmentCatalog, ...customItems];
}

const featureDescriptions = {
  "Tenacidade anã: PV adicional por nível.": "Seu corpo aguenta mais punição. Some PV extra conforme o nível e descreva resistência física fora de combate.",
  "Treinamento de armadura e porte robusto.": "Você está acostumado a equipamento pesado e marcha longa. Armaduras não atrapalham tarefas narrativas simples.",
  "Truque arcano e treinamento élfico.": "Você conhece um truque mágico e recebe treinamento élfico com armas, percepção e tradição arcana.",
  "Máscara da natureza e deslocamento superior.": "Você se esconde melhor em ambientes naturais e se move com leveza por terreno selvagem.",
  "Magia drow e visão no escuro superior.": "Você enxerga longe no escuro e aprende magia ligada a sombra, luz feérica e presença subterrânea.",
  "Furtividade natural.": "Você consegue se esconder atrás de criaturas maiores e usar sua pequena estatura como vantagem em infiltração.",
  "Resiliência contra veneno.": "Você recebe resistência narrativa contra venenos, comida ruim e ambientes tóxicos leves.",
  "Perícia ou talento inicial adaptado.": "Escolha uma perícia, ferramenta ou talento simples para representar a versatilidade humana.",
  "Impulso heroico uma vez por descanso.": "Uma vez por descanso, transforme esforço decisivo em bônus narrativo para ataque, teste ou salvaguarda.",
  "Resistência a fogo e magia infernal.": "Você resiste a fogo e aprende magia de linhagem infernal conforme avança.",
  "Passo sobrenatural de ancestral gigante.": "Você encurta distância com um passo mágico curto, útil para reposicionamento e cenas verticais.",
  "Retaliação trovejante.": "Quando sofre impacto, pode responder com energia trovejante ancestral em uma cena dramática.",
  "Proteção integrada.": "Seu corpo construído funciona como defesa natural e permite acoplar armadura com aparência própria.",
  "Ferramentas integradas.": "Você carrega ferramentas no próprio corpo e ganha vantagem narrativa em reparos, ofícios ou artifício.",
  "Sopro elemental e resistência a fogo.": "Você exala uma rajada elemental de fogo e resiste a dano ou perigos flamejantes.",
  "Sopro elemental e resistência a frio.": "Você exala frio cortante e suporta clima extremo, gelo e dano frio com mais facilidade.",
  "Sopro elemental e resistência elétrica.": "Você solta descarga elétrica em área e resiste a choques, tempestades e magia elétrica.",
  "Sopro elemental e resistência a ácido.": "Você cospe ácido corrosivo e resiste a substâncias cáusticas ou dano ácido.",
  "Sopro elemental e resistência a veneno.": "Você libera veneno em área e resiste melhor a toxinas, doenças simples e venenos.",
  "Ilusão menor e fala com animais pequenos.": "Você conjura pequenas ilusões e conversa de forma simples com animais miúdos.",
  "Conhecimento de artífice.": "Você entende mecanismos, ferramentas e invenções; ótimo para investigação técnica.",
  "Combina duas aptidões adicionais.": "Escolha duas aptidões extras para refletir a mistura de culturas e treinamento do meio-elfo.",
  "Força e resistência física.": "Você suporta golpes fatais por pura teimosia e causa impacto maior em críticos corpo a corpo.",
  "Mobilidade e vigor.": "Você avança com adrenalina, ignora parte do cansaço e mantém pressão física constante.",
  "Derruba criaturas com impacto.": "Seu legado gigante permite empurrar ou derrubar inimigos quando acerta com força.",
  "Resistência e firmeza pétrea.": "Você reduz impacto de golpes e fica difícil de mover contra sua vontade.",
  "Resistência e legado do frio.": "Você suporta frio extremo e transforma resistência em presença calma sob pressão.",
  "Legado ígneo.": "Seu sangue gigante carrega calor sobrenatural, útil contra frio e para efeitos de chama.",
  "Magia natural e invisibilidade curta.": "Você usa magia silvestre para se ocultar brevemente e falar com a natureza.",
  "Explosão de velocidade felina.": "Você dobra o ritmo em disparadas curtas, escaladas e perseguições.",
  "Movimento evasivo.": "Você se esconde, recua ou se reposiciona rapidamente usando tamanho e astúcia.",
  "Alcance e surpresa.": "Seus braços longos e instinto de emboscada dão vantagem narrativa no primeiro impacto.",
  "Disciplina marcial.": "Treinamento de formação ajuda aliados e melhora decisões táticas sob pressão.",
  "Sobrevivência anfíbia.": "Você nada bem, prende o fôlego por mais tempo e usa mordida/armadura natural.",
  "Investida poderosa.": "Ao correr em linha reta, seus chifres transformam movimento em impacto de controle.",
  "Fúria": "Entre em fúria para receber vantagem narrativa em força, resistir melhor a dano físico e causar mais impacto corpo a corpo.",
  "Defesa sem Armadura": "Quando estiver sem armadura pesada, sua resistência e agilidade ajudam a compor a defesa.",
  "Ataque Imprudente": "Você pode atacar com brutalidade, ganhando pressão ofensiva em troca de se expor até o próximo turno.",
  "Ataque Extra": "Ao usar a ação de ataque, você pode atacar uma segunda vez quando o nível da classe liberar.",
  "Crítico Brutal": "Seus acertos críticos ficam mais perigosos e adicionam dano extra conforme a classe avança.",
  "Estilo de Luta": "Escolha um foco marcial como defesa, arquearia, duelo ou armas pesadas para ganhar bônus constante.",
  "Retomar o Fôlego": "Recupere fôlego em combate e restaure parte dos PV sem depender de magia.",
  "Surto de Ação": "Ganhe uma ação extra em um momento decisivo do combate.",
  "Indomável": "Refaça uma salvaguarda falha e represente pura teimosia heroica.",
  "Imposição das Mãos": "Use uma reserva de cura divina para restaurar PV ou aliviar uma condição.",
  "Punição Divina": "Ao acertar um ataque, gaste energia sagrada para causar dano radiante extra.",
  "Aura de Proteção": "Aliados próximos se beneficiam da sua presença e somam seu CAR em defesas importantes.",
  "Toque Purificador": "Remova efeitos mágicos hostis com um toque abençoado.",
  "Inimigo Favorito": "Marque ou estude uma presa para rastrear melhor e causar pressão extra contra ela.",
  "Explorador Hábil": "Você ganha perícias de exploração, movimento e sobrevivência em terreno difícil.",
  "Incansável": "Você resiste melhor a desgaste, cansaço e longas viagens.",
  "Ataque Furtivo": "Uma vez por turno, cause dano extra quando tiver vantagem ou aliado ameaçando o alvo.",
  "Especialização": "Dobre a proficiência em perícias escolhidas e vire referência naquele campo.",
  "Ação Ardilosa": "Use ação rápida para correr, desengajar ou se esconder.",
  "Esquiva Sobrenatural": "Reduza o dano de um ataque que você possa perceber.",
  "Evasão": "Em efeitos de área, sua agilidade reduz ou evita totalmente o dano.",
  "Artes Marciais": "Use DEX em golpes desarmados e ataque com fluidez após atacar.",
  "Foco": "Gaste pontos de foco para técnicas especiais de movimento, defesa e ataque.",
  "Movimento sem Armadura": "Sem armadura, seu deslocamento aumenta e seus movimentos ficam acrobáticos.",
  "Inspiração de Bardo": "Conceda dado de inspiração a aliados para melhorar testes, ataques ou defesas.",
  "Versatilidade": "Você aprende muitos truques sociais, mágicos e práticos.",
  "Fonte de Inspiração": "Recupere inspirações com mais frequência conforme a classe avança.",
  "Segredos Mágicos": "Aprenda magias de outras listas e amplie seu repertório.",
  "Conjuração": "Você prepara ou conhece magias da classe e usa o atributo de conjuração indicado.",
  "Canalizar Divindade": "Concentre energia divina em um efeito forte de domínio, cura, luz ou banimento.",
  "Destruir Mortos-Vivos": "Sua fé pode afastar e destruir mortos-vivos fracos.",
  "Intervenção Divina": "Peça auxílio direto da divindade em momentos extremos.",
  "Grimório": "Seu livro guarda magias conhecidas; copiar e preparar magias é parte central do mago.",
  "Recuperação Arcana": "Depois de descanso curto, recupere parte dos recursos mágicos.",
  "Memorizar Magia": "Troque uma magia preparada com estudo rápido quando tiver tempo e grimório.",
  "Maestria em Magia": "Conjure certas magias de baixo círculo com domínio superior.",
  "Magias Características": "Escolha magias marcantes que definem sua identidade arcana.",
  "Conjuração Inata": "Sua magia vem do sangue, pacto interno ou poder espontâneo.",
  "Fonte de Magia": "Converta pontos mágicos e espaços para alimentar metamagia.",
  "Metamagia": "Modifique alcance, alvo, velocidade ou forma de uma magia.",
  "Restauração Feiticeira": "Recupere energia mágica em momentos de pausa.",
  "Magia de Pacto": "Seus espaços de magia são poucos, fortes e voltam rapidamente.",
  "Invocações Místicas": "Escolha melhorias permanentes dadas pelo pacto.",
  "Dádiva do Pacto": "Receba uma arma, tomo, familiar ou talismã ligado ao patrono.",
  "Arcanos Místicos": "Ganhe magias únicas de círculos altos concedidas pelo patrono.",
  "Druídico": "Você conhece a linguagem secreta dos druidas e sinais naturais.",
  "Forma Selvagem": "Assuma formas animais para combate, exploração ou infiltração.",
  "Corpo Atemporal": "A natureza desacelera seu envelhecimento e desgaste.",
  "Arquedruida": "Você domina Forma Selvagem e magia natural no ápice da classe."
};

const subclassDescriptions = {
  "Caminho do Berserker": "Foco em fúria ofensiva. No nível 3, suas explosões de dano ficam mais constantes e agressivas.",
  "Caminho do Guardião Totêmico": "Foco em resistência e proteção. Escolha um espírito-guia para ganhar defesa, mobilidade ou suporte.",
  "Campeão": "Subclasse simples e forte: melhora acertos críticos, atletismo e consistência marcial.",
  "Mestre de Manobras": "Use manobras para empurrar, desarmar, proteger aliados e controlar o campo.",
  "Juramento de Devoção": "Paladino clássico de honra, luz e proteção contra corrupção.",
  "Juramento da Aurora": "Juramento adaptado de luz e renascimento, com cura e pressão contra trevas.",
  "Caçador": "Escolha técnicas contra presas específicas e fortaleça dano ou defesa em combate.",
  "Guardião das Feras": "Receba vínculo com companheiro animal e ações coordenadas.",
  "Ladrão": "Especialista em infiltração, objetos, escalada e uso criativo do cenário.",
  "Sombra Cortante": "Ladino focado em emboscada, medo e movimentação entre sombras.",
  "Mão Aberta": "Controle inimigos com golpes desarmados, derrubões e empurrões.",
  "Caminho da Sombra": "Misture disciplina marcial com furtividade e técnicas de escuridão.",
  "Colégio do Conhecimento": "Bardo perito, cheio de segredos, perícias e interrupções sociais.",
  "Colégio do Valor": "Bardo de batalha que inspira aliados e participa da linha de frente.",
  "Domínio da Vida": "Clérigo focado em cura, proteção e restauração.",
  "Domínio da Luz": "Clérigo focado em fogo, revelação e expulsão das trevas.",
  "Evocador": "Mago que molda explosões para causar dano sem destruir aliados.",
  "Ilusionista": "Mago que distorce percepção, cria distrações e controla informação.",
  "Feitiçaria Dracônica": "Feiticeiro com resistência, presença e dano ligados a ancestral dracônico.",
  "Magia Selvagem Controlada": "Feiticeiro que manipula surtos caóticos com risco e recompensa.",
  "Patrono Corruptor": "Bruxo com poder sombrio, resistência e magia destrutiva.",
  "Patrono Feérico": "Bruxo de encanto, ilusão e barganhas com cortes feéricas.",
  "Círculo da Terra": "Druida conjurador ligado a biomas e recuperação natural.",
  "Círculo da Lua": "Druida focado em Forma Selvagem forte e combate animal."
};

const spellSchoolDescriptions = {
  Abjuração: "Protege, cura, bane ou desfaz efeitos perigosos.",
  Adivinhação: "Revela informação, rastreia ou antecipa ameaças.",
  Conjuração: "Invoca criaturas, objetos, energia ou desloca alvos.",
  Encantamento: "Influência mental, emoção, controle ou inspiração.",
  Evocação: "Energia direta: fogo, luz, força, cura ou explosões.",
  Ilusão: "Engana sentidos e cria imagens, sons ou presenças falsas.",
  Necromancia: "Manipula vida, morte, veneno ou energia sombria.",
  Transmutação: "Altera corpo, matéria, movimento ou propriedades."
};

function describeFeature(name) {
  return featureDescriptions[name] || "Recurso automático já liberado na ficha. Defina o detalhe final com o mestre e registre qualquer limite de uso na descrição.";
}

function describeSubclass(name) {
  return subclassDescriptions[name] || "Subclasse jogável com recursos no nível 3, 6, 10 e 14. Defina detalhes com o mestre antes da campanha.";
}

function describeSpell(spell) {
  return spell.effect || spellSchoolDescriptions[spell.school] || "Magia pronta do sistema com efeito definido pelo círculo e pela classe.";
}

function getInputValues() {
  return distInputs.map(item => Number(document.getElementById(item.id).value || 0));
}

function formatSigned(value) {
  return Number(value) >= 0 ? `+ ${Number(value)}` : `- ${Math.abs(Number(value))}`;
}

function formatAttributeLabel(attribute) {
  const labels = { for: 'FOR', dex: 'DEX', con: 'CON', int: 'INT', sab: 'SAB', car: 'CAR' };
  return String(attribute || '')
    .split('/')
    .map(part => labels[part] || part.toUpperCase())
    .join('/');
}

function getBestClassAttackAttribute(data) {
  const options = String(data?.attackStat || 'for')
    .split('/')
    .filter(Boolean);
  return options.reduce((best, attribute) => {
    return getAttributeModifier(attribute) > getAttributeModifier(best) ? attribute : best;
  }, options[0] || 'for');
}

function getClassAttackDie(data) {
  return Number(String(data?.attackDie || '1d6').match(/d(\d+)/)?.[1] || 6);
}

function getDieAverage(sides) {
  return (Number(sides) + 1) / 2;
}

function getClassHitDieSides(className) {
  return Number(String(classData[className]?.hitDie || 'd8').replace('d', '')) || 8;
}

function getAutoPowerProfile(power = {}) {
  const level = Math.max(1, Number(elements.nivel.value) || 1);
  const className = elements.classe1.value;
  const classDie = getClassAttackDie(classData[className]);
  const die = power.die === 'auto' || !power.die ? classDie : Number(power.die);
  const baseCount = Math.max(1, Math.ceil(level / 5));
  const diceCount = Number(power.diceCount) > 0 ? Number(power.diceCount) : baseCount;
  const attribute = getBestClassAttackAttribute(classData[className]);
  const bonus = Number(power.bonus || 0) || getAttributeModifier(attribute);
  const manaCost = Number(power.manaCost || 0) || Math.max(0, Number(power.level || 0));
  return { die, diceCount, bonus, manaCost };
}

function openDiceTab() {
  document.querySelector('[data-target="tab-dados"]')?.click();
}

function applySelectedRaceBonuses() {
  const race = raceData[elements.raca.value];
  const subraceSelect = document.getElementById('subraca');
  const previous = subraceSelect.value;
  const subraces = Object.keys(race?.subraces || {});
  subraceSelect.innerHTML = subraces.map(name => `<option value="${name}">${name}</option>`).join('');
  if (subraces.includes(previous)) subraceSelect.value = previous;
  const subrace = race?.subraces?.[subraceSelect.value];
  const bonuses = subrace?.bonuses || {};
  const inputs = {
    for: 'raceFor',
    dex: 'raceDex',
    con: 'raceCon',
    int: 'raceInt',
    sab: 'raceSab',
    car: 'raceCar'
  };
  Object.entries(inputs).forEach(([attribute, id]) => {
    document.getElementById(id).value = bonuses[attribute] || 0;
  });
  document.getElementById('raceDescription').textContent = race
    ? `${race.source} · ${race.traits} ${subrace?.trait || ''}`
    : '';
  synchronize();
}

function applySelectedSubraceBonuses() {
  const subrace = raceData[elements.raca.value]?.subraces?.[document.getElementById('subraca').value];
  const bonuses = subrace?.bonuses || {};
  const ids = { for: 'raceFor', dex: 'raceDex', con: 'raceCon', int: 'raceInt', sab: 'raceSab', car: 'raceCar' };
  Object.entries(ids).forEach(([attribute, id]) => {
    document.getElementById(id).value = bonuses[attribute] || 0;
  });
  const race = raceData[elements.raca.value];
  document.getElementById('raceDescription').textContent = `${race?.source || ''} · ${race?.traits || ''} ${subrace?.trait || ''}`;
  synchronize();
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

  const prof = Number(elements.profBonus.value.toString().replace('+', '')) || 0;
  const mods = {
    for: Number(elements.modFor.textContent.replace('+', '')),
    dex: Number(elements.modDex.textContent.replace('+', '')),
    con: Number(elements.modCon.textContent.replace('+', '')),
    int: Number(elements.modInt.textContent.replace('+', '')),
    sab: Number(elements.modSab.textContent.replace('+', '')),
    car: Number(elements.modCar.textContent.replace('+', ''))
  };

  let modifier = 0;
  let label = '';

  switch (type) {
    case 'for':
      modifier = mods.for + prof;
      label = 'Ataque físico';
      break;
    case 'dex':
      modifier = mods.dex + prof;
      label = 'Ataque à distância';
      break;
    case 'dexNoProf':
      modifier = mods.dex;
      label = 'Esquiva';
      break;
    case 'dodge':
      modifier = mods.dex + prof;
      label = 'Esquiva treinada';
      break;
    case 'reflex':
      modifier = mods.dex + prof;
      label = 'Defesa de reflexos';
      break;
    case 'fortitude':
      modifier = mods.con + prof;
      label = 'Defesa de fortitude';
      break;
    case 'will':
      modifier = mods.sab + prof;
      label = 'Defesa de vontade';
      break;
    case 'concentration':
      modifier = mods.con + prof;
      label = 'Concentração';
      break;
    case 'int':
      modifier = mods.int + prof;
      label = 'Ataque mágico';
      break;
    default:
      return;
  }

  openDiceTab();
  rollDice({
    sides: 20,
    count: 1,
    modifier,
    label,
    onComplete: ({ results, total }) => {
      elements.rollResult.innerHTML = `<span class="dice-icon">${results[0]}</span><span>${label}: ${total} (d20 ${results[0]} ${formatSigned(modifier)})</span>`;
    }
  });
}

function resetFicha() {
  elements.nome.value = '';
  elements.jogador.value = '';
  elements.sistema.value = 'D&D';
  elements.nivel.value = 1;
  elements.xp.value = 0;
  elements.vidaMaxima.value = 30;
  document.getElementById('currentHp').value = 30;
  document.getElementById('armorClass').value = 10;
  document.getElementById('speed').value = '9 m';
  document.getElementById('vision').value = 'normal';
  document.getElementById('hitDie').value = 'd10';
  document.getElementById('castingStat').value = 'int';
  document.getElementById('spellSlots').value = 0;
  document.getElementById('currentMana').value = 15;
  elements.multiclasse.checked = false;
  elements.nivelC1.value = 1;
  elements.nivelC2.value = 1;
  elements.nivelC3.value = 0;
  distInputs.forEach(input => document.getElementById(input.id).value = 0);
  raceBonusInputs.forEach(input => document.getElementById(input.id).value = 0);
  elements.tituloHabilidade.value = '';
  elements.descricaoHabilidade.value = '';
  elements.descricaoClasse.value = '';
  purchasedSkills = [];
  inventory = [];
  customItems = [];
  purchasedSpells = [];
  customSpells = [];
  bannerPhoto = '';
  applyDynamicTheme('#7EBAEE', '#F0A06F');
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
  elements.photoPreview.innerHTML = 'Adicione a imagem do personagem';
  document.getElementById('bannerInput').value = '';
  document.getElementById('bannerUrl').value = '';
  document.getElementById('photoUrl').value = '';
  document.getElementById('skillPhotoUrl').value = '';
  applyBanner('');
  elements.rollResult.textContent = 'Clique em uma rolagem para ver o resultado.';
  document.querySelectorAll('[data-store]').forEach(input => {
    input.value = input.classList.contains('slot-counter') ? '0 / 0' : '';
  });
  renderEquipment();
  renderSpellCatalog();
  renderCustomSpells();
  synchronize();
}

function getSkillLimit() {
  const level = Math.max(1, Number(elements.nivel.value) || 1);
  const distributedPoints = getInputValues().reduce((sum, value) => sum + value, 0);
  return Math.min(level, Math.floor(distributedPoints / 3));
}

function getSkillCost(skill) {
  return Math.max(1, Number(skill?.cost) || 1);
}

function getSkillSpent() {
  return purchasedSkills.reduce((sum, skill) => sum + getSkillCost(skill), 0);
}

function updateSkillBudget() {
  const limit = getSkillLimit();
  const used = getSkillSpent();
  const available = Math.max(0, limit - used);
  document.getElementById('skillLimit').textContent = limit;
  document.getElementById('skillUsed').textContent = used;
  document.getElementById('skillAvailable').textContent = available;

  const addButton = document.getElementById('addSkill');
  addButton.disabled = editingSkillIndex < 0 && available < 1;
  addButton.title = available === 0 && editingSkillIndex < 0
    ? 'Distribua mais pontos de atributo ou aumente o nível.'
    : '';
}

function resetSkillEditor() {
  skillPhoto = '';
  editingSkillIndex = -1;
  elements.tituloHabilidade.value = '';
  elements.descricaoHabilidade.value = '';
  document.getElementById('skillOrigin').value = 'Classe';
  document.getElementById('skillEffectType').value = 'damage';
  document.getElementById('skillDamageDie').value = 'auto';
  document.getElementById('skillDiceCount').value = 0;
  document.getElementById('skillFlatBonus').value = 0;
  document.getElementById('skillManaCost').value = 0;
  document.getElementById('skillPhotoInput').value = '';
  document.getElementById('skillPhotoUrl').value = '';
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
    const price = document.createElement('span');
    price.className = 'skill-price';
    const profile = getAutoPowerProfile(skill);
    price.textContent = `Compra ${getSkillCost(skill)} · Mana ${profile.manaCost} · ${formatPowerEffect(skill)}`;
    const description = document.createElement('p');
    description.textContent = skill.description;

    const actions = document.createElement('div');
    actions.className = 'skill-card-actions';
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => editSkill(index));
    const useButton = document.createElement('button');
    useButton.type = 'button';
    useButton.textContent = 'Usar';
    useButton.addEventListener('click', () => usePower(skill, useButton));
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Excluir';
    deleteButton.addEventListener('click', () => {
      purchasedSkills.splice(index, 1);
      if (editingSkillIndex === index) resetSkillEditor();
      renderSkillCollection();
      updateSkillBudget();
      renderAbilityCatalog();
      saveDraftSoon();
    });

    actions.append(useButton, editButton, deleteButton);
    copy.append(title, price, description, actions);
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
  document.getElementById('skillOrigin').value = skill.origin || 'Classe';
  document.getElementById('skillEffectType').value = skill.effectType || 'damage';
  document.getElementById('skillDamageDie').value = skill.die || 'auto';
  document.getElementById('skillDiceCount').value = skill.diceCount || 0;
  document.getElementById('skillFlatBonus').value = skill.bonus || 0;
  document.getElementById('skillManaCost').value = skill.manaCost || 0;
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

  if (editingSkillIndex < 0 && getSkillSpent() + 1 > getSkillLimit()) {
    message.textContent = 'Sem pontos disponíveis. Distribua 3 pontos de atributo ou aumente o nível.';
    return;
  }

  const skill = {
    id: editingSkillIndex >= 0
      ? purchasedSkills[editingSkillIndex].id
      : (crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`),
    name,
    description,
    photo: skillPhoto,
    cost: editingSkillIndex >= 0 ? getSkillCost(purchasedSkills[editingSkillIndex]) : 1,
    origin: document.getElementById('skillOrigin').value,
    effectType: document.getElementById('skillEffectType').value,
    die: document.getElementById('skillDamageDie').value,
    diceCount: Number(document.getElementById('skillDiceCount').value || 0),
    bonus: Number(document.getElementById('skillFlatBonus').value || 0),
    manaCost: Number(document.getElementById('skillManaCost').value || 0)
  };

  if (editingSkillIndex >= 0) purchasedSkills[editingSkillIndex] = skill;
  else purchasedSkills.push(skill);

  resetSkillEditor();
  renderSkillCollection();
  updateSkillBudget();
  renderAbilityCatalog();
  saveDraftSoon();
}

function buyCatalogAbility(ability) {
  const message = document.getElementById('skillMessage');
  const cost = getSkillCost(ability);
  if (purchasedSkills.some(skill => skill.name === ability.name)) {
    message.textContent = 'Essa habilidade já foi comprada.';
    return;
  }
  if (getSkillSpent() + cost > getSkillLimit()) {
    message.textContent = `Sem pontos disponíveis. Essa habilidade custa ${cost} ponto${cost > 1 ? 's' : ''}.`;
    return;
  }
  purchasedSkills.push({
    id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    name: ability.name,
    description: ability.description,
    photo: '',
    cost,
    origin: ability.className === 'Geral' ? 'Personalizada' : 'Classe',
    effectType: ability.effectType || 'damage',
    die: ability.die || 'auto',
    diceCount: ability.diceCount || 0,
    bonus: ability.bonus || 0,
    manaCost: ability.manaCost || 0
  });
  renderSkillCollection();
  updateSkillBudget();
  renderAbilityCatalog();
  saveDraftSoon();
}

function renderAbilityCatalog() {
  const container = document.getElementById('abilityCatalog');
  if (!container) return;
  const filter = document.getElementById('abilityClassFilter').value;
  const options = abilityCatalog.filter(ability => filter === 'Todas' || ability.className === filter || ability.className === 'Geral');
  container.innerHTML = '';
  options.forEach(ability => {
    const owned = purchasedSkills.some(skill => skill.name === ability.name);
    const cost = getSkillCost(ability);
    const canAfford = getSkillSpent() + cost <= getSkillLimit();
    const card = document.createElement('article');
    card.className = 'spell-card';
    card.innerHTML = `<span>${ability.className} · Custo ${cost} ponto${cost > 1 ? 's' : ''}</span><h4>${ability.name}</h4><p>${ability.description}</p>`;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = owned ? 'Comprada' : 'Comprar';
    button.disabled = owned || !canAfford;
    button.title = !owned && !canAfford ? `Faltam ${getSkillSpent() + cost - getSkillLimit()} ponto(s) de habilidade.` : '';
    button.addEventListener('click', () => buyCatalogAbility(ability));
    card.appendChild(button);
    container.appendChild(card);
  });
}

function getEquipmentBudget() {
  return 10 + (Math.max(1, Number(elements.nivel.value) || 1) * 2);
}

function getEquipmentSpent() {
  return inventory.reduce((sum, itemId) => {
    return sum + (getEquipmentCatalog().find(item => item.id === itemId)?.cost || 0);
  }, 0);
}

function buyEquipment(itemId) {
  const item = getEquipmentCatalog().find(entry => entry.id === itemId);
  if (!item || inventory.includes(itemId)) return;
  if (getEquipmentSpent() + item.cost > getEquipmentBudget()) return;
  inventory.push(itemId);
  renderEquipment();
  synchronize();
}

function sellEquipment(itemId) {
  inventory = inventory.filter(id => id !== itemId);
  renderEquipment();
  synchronize();
}

function renderEquipment() {
  const shop = document.getElementById('equipmentShop');
  const inventoryList = document.getElementById('inventoryList');
  if (!shop || !inventoryList) return;

  const budget = getEquipmentBudget();
  const spent = getEquipmentSpent();
  document.getElementById('equipmentBudget').textContent = budget;
  document.getElementById('equipmentSpent').textContent = spent;
  document.getElementById('equipmentRemaining').textContent = Math.max(0, budget - spent);

  shop.innerHTML = '';
  getEquipmentCatalog().forEach(item => {
    const owned = inventory.includes(item.id);
    const card = document.createElement('article');
    card.className = 'shop-item';
    card.innerHTML = `
      <span>${item.category}${item.rarity ? ` · ${item.rarity}` : ''}</span>
      <h4>${item.name}</h4>
      <p>${item.description}</p>
      <div><b>${item.cost} pts</b></div>
    `;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = owned ? 'Comprado' : 'Comprar';
    button.disabled = owned || spent + item.cost > budget;
    button.addEventListener('click', () => buyEquipment(item.id));
    card.querySelector('div').appendChild(button);
    shop.appendChild(card);
  });

  inventoryList.innerHTML = '';
  if (inventory.length === 0) {
    inventoryList.innerHTML = '<p class="system-rule">Nenhum item comprado.</p>';
  }
  inventory.forEach(itemId => {
    const item = getEquipmentCatalog().find(entry => entry.id === itemId);
    if (!item) return;
    const row = document.createElement('article');
    row.className = 'inventory-item';
    row.innerHTML = `<div><b>${item.name}</b><span>${item.category} · ${item.description}</span></div>`;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Vender';
    button.addEventListener('click', () => sellEquipment(item.id));
    row.appendChild(button);
    inventoryList.appendChild(row);
  });

  renderWeaponList();
}

function renderWeaponList() {
  const weaponList = document.getElementById('weaponList');
  if (!weaponList) return;
  const weapons = inventory
    .map(itemId => getEquipmentCatalog().find(item => item.id === itemId))
    .filter(item => item?.category === 'Arma' && item.die);

  weaponList.innerHTML = '';
  if (weapons.length === 0) {
    weaponList.innerHTML = '<p class="system-rule">Compre armas na aba Equipamento para usá-las aqui.</p>';
    return;
  }

  weapons.forEach(weapon => {
    const modifier = getAttributeModifier(weapon.attribute);
    const proficiency = Number(elements.profBonus.value.replace('+', '')) || 0;
    const attackBonus = modifier + proficiency + Number(weapon.attackBonus || 0);
    const damageBonus = modifier + Number(weapon.damageBonus || 0);
    const card = document.createElement('article');
    card.className = 'weapon-card';
    card.innerHTML = `
      <h4>${weapon.name}</h4>
      <div class="weapon-tags">
        <span>Ataque ${formatSigned(attackBonus)}</span>
        <span>Dano 1d${weapon.die} ${formatSigned(damageBonus)}</span>
        <span>${weapon.range}</span>
      </div>
    `;
    const actions = document.createElement('div');
    actions.className = 'weapon-actions';
    const attackButton = document.createElement('button');
    attackButton.type = 'button';
    attackButton.textContent = 'Rolar ataque';
    attackButton.addEventListener('click', () => {
      openDiceTab();
      rollDice({
        sides: 20,
        count: 1,
        modifier: attackBonus,
        label: `Ataque com ${weapon.name}`,
        onComplete: ({ results, total }) => {
          elements.rollResult.innerHTML = `<span class="dice-icon">${results[0]}</span><span>${weapon.name}: ataque ${total}</span>`;
        }
      });
    });
    const damageButton = document.createElement('button');
    damageButton.type = 'button';
    damageButton.textContent = 'Rolar dano';
    damageButton.addEventListener('click', () => {
      openDiceTab();
      rollDice({
        sides: weapon.die,
        count: 1,
        modifier: damageBonus,
        label: `Dano de ${weapon.name}`,
        onComplete: ({ results, total }) => {
          elements.rollResult.innerHTML = `<span class="dice-icon">${results[0]}</span><span>${weapon.name}: dano ${total}</span>`;
        }
      });
    });
    actions.append(attackButton, damageButton);
    card.appendChild(actions);
    weaponList.appendChild(card);
  });
}

function renderClassCombatStats() {
  const data = classData[elements.classe1.value];
  const container = document.getElementById('classCombatStats');
  if (!data || !container) return;
  const attackAttribute = getBestClassAttackAttribute(data);
  const proficiency = Number(elements.profBonus.value.replace('+', '')) || 0;
  const attackBonus = getAttributeModifier(attackAttribute) + proficiency;
  const damageDie = getClassAttackDie(data);
  const damageBonus = getAttributeModifier(attackAttribute);
  document.getElementById('classCombatTitle').textContent = `${elements.classe1.value}: ataque base`;
  document.getElementById('combatAttackStat').textContent = formatAttributeLabel(data.attackStat);
  document.getElementById('combatAttackDie').textContent = data.attackDie;
  container.innerHTML = `
    <span><b>${formatAttributeLabel(data.attackStat)}</b><small>Atributo usado</small></span>
    <span><b>${data.attackDie}</b><small>Dado de ataque</small></span>
    <span><b>${formatSigned(attackBonus).replace(' ', '')}</b><small>Bônus base</small></span>
    <span><b>${data.hitDie}</b><small>Dado de vida</small></span>
    <p>${data.weaponStyle}</p>
  `;
  const actions = document.createElement('div');
  actions.className = 'class-combat-actions';
  const attackButton = document.createElement('button');
  attackButton.type = 'button';
  attackButton.textContent = 'Rolar ataque da classe';
  attackButton.addEventListener('click', () => {
    rollDice({
      sides: 20,
      quantity: 1,
      modifier: attackBonus,
      label: `Ataque base de ${elements.classe1.value}`,
      onComplete: ({ results, total }) => {
        elements.rollResult.innerHTML = `<span class="dice-icon">${results[0]}</span><span>${elements.classe1.value}: ataque ${total}</span>`;
      }
    });
    animateRollButton(attackButton);
    openDiceTab();
  });
  const damageButton = document.createElement('button');
  damageButton.type = 'button';
  damageButton.textContent = 'Rolar dano base';
  damageButton.addEventListener('click', () => {
    rollDice({
      sides: damageDie,
      quantity: 1,
      modifier: damageBonus,
      label: `Dano base de ${elements.classe1.value}`,
      onComplete: ({ results, total }) => {
        elements.rollResult.innerHTML = `<span class="dice-icon">${results[0]}</span><span>${elements.classe1.value}: dano ${total}</span>`;
      }
    });
    animateRollButton(damageButton);
    openDiceTab();
  });
  actions.append(attackButton, damageButton);
  container.appendChild(actions);
}

function getAttributeModifier(attribute) {
  const labels = {
    for: elements.modFor,
    dex: elements.modDex,
    con: elements.modCon,
    int: elements.modInt,
    sab: elements.modSab,
    car: elements.modCar
  };
  return Number(labels[attribute]?.textContent.replace('+', '')) || 0;
}

function getItemBonus(key) {
  return inventory.reduce((sum, itemId) => {
    const item = getEquipmentCatalog().find(entry => entry.id === itemId);
    return sum + Number(item?.[key] || 0);
  }, 0);
}

function getCalculatedArmorClass() {
  const manual = Number(document.getElementById('armorClass').value) || 10;
  const dexterity = getAttributeModifier('dex');
  let calculated = manual;
  inventory.forEach(itemId => {
    const item = getEquipmentCatalog().find(entry => entry.id === itemId);
    if (!item) return;
    if (item.armorBase) calculated = Math.max(calculated, item.armorBase + (item.dexterity ? dexterity : 0));
    if (item.armorBonus) calculated += item.armorBonus;
  });
  return calculated;
}

function getCalculatedMaxHp() {
  const con = getAttributeModifier('con');
  const classHp = getClassBuild().reduce((sum, entry) => {
    const sides = getClassHitDieSides(entry.className);
    const level = Math.max(0, Number(entry.level) || 0);
    if (!level) return sum;
    const average = Math.floor(sides / 2) + 1;
    return sum + sides + Math.max(0, level - 1) * average + con * level;
  }, 0);
  const raceHp = document.getElementById('subraca').value === 'Anão da Colina'
    ? Number(elements.nivel.value || 1)
    : 0;
  return Math.max(Number(elements.vidaMaxima.value) || 0, classHp + raceHp) + getItemBonus('maxHpBonus');
}

function getCalculatedMaxMana() {
  const castingStat = document.getElementById('castingStat').value;
  const castingBonus = Math.max(0, getAttributeModifier(castingStat));
  const classMana = getClassBuild().reduce((sum, entry) => {
    const perLevel = casterManaByClass[entry.className] || 1;
    return sum + Math.max(0, Number(entry.level) || 0) * perLevel;
  }, 0);
  const racialMana = (raceGrantedSpells[document.getElementById('subraca').value] || []).length * 2;
  return Math.max(Number(elements.pontosMagia.value) || 0, classMana + castingBonus + racialMana) + getItemBonus('spellBonus');
}

function clampResources() {
  const hp = document.getElementById('currentHp');
  const mana = document.getElementById('currentMana');
  if (hp) hp.value = Math.min(Math.max(0, Number(hp.value || 0)), getCalculatedMaxHp());
  if (mana) mana.value = Math.min(Math.max(0, Number(mana.value || 0)), getCalculatedMaxMana());
}

function formatPowerEffect(power) {
  const profile = getAutoPowerProfile(power);
  const labels = { damage: 'dano', heal: 'cura', mana: 'mana', utility: 'utilidade' };
  if ((power.effectType || 'damage') === 'utility') return labels.utility;
  return `${profile.diceCount}d${profile.die} ${formatSigned(profile.bonus)} ${labels[power.effectType || 'damage']}`;
}

function setResourceMessage(message) {
  const target = document.getElementById('resourceMessage');
  if (target) target.textContent = message;
}

function updateResource(action, amount) {
  const value = Math.max(0, Number(amount) || 0);
  const hp = document.getElementById('currentHp');
  const mana = document.getElementById('currentMana');
  const maxHp = getCalculatedMaxHp();
  const maxMana = getCalculatedMaxMana();
  if (action === 'damage') {
    hp.value = Math.max(0, Number(hp.value || 0) - value);
    setResourceMessage(`Recebeu ${value} de dano.`);
  }
  if (action === 'heal') {
    hp.value = Math.min(maxHp, Number(hp.value || 0) + value);
    setResourceMessage(`Curou ${value} PV.`);
  }
  if (action === 'spendMana') {
    mana.value = Math.max(0, Number(mana.value || 0) - value);
    setResourceMessage(`Gastou ${value} de mana.`);
  }
  if (action === 'restoreMana') {
    mana.value = Math.min(maxMana, Number(mana.value || 0) + value);
    setResourceMessage(`Recuperou ${value} de mana.`);
  }
  synchronize();
}

function usePower(power, button = null) {
  const profile = getAutoPowerProfile(power);
  const mana = document.getElementById('currentMana');
  if (profile.manaCost > Number(mana.value || 0)) {
    setResourceMessage(`${power.name} precisa de ${profile.manaCost} mana.`);
    return;
  }
  mana.value = Math.max(0, Number(mana.value || 0) - profile.manaCost);
  saveDraftSoon();
  const type = power.effectType || 'damage';
  if (type === 'utility') {
    setResourceMessage(`${power.name} usado. Mana restante: ${mana.value}.`);
    saveDraftSoon();
    return;
  }
  rollDice({
    sides: profile.die,
    count: profile.diceCount,
    modifier: profile.bonus,
    label: power.name,
    onComplete: ({ results, total }) => {
      if (type === 'heal') updateResource('heal', total);
      if (type === 'mana') updateResource('restoreMana', total);
      const action = type === 'damage' ? 'dano' : type === 'heal' ? 'cura' : 'mana';
      elements.rollResult.innerHTML = `<span class="dice-icon">${results.join(', ')}</span><span>${power.name}: ${total} ${action}</span>`;
      setResourceMessage(`${power.name} causou ${total} de ${action}. Mana restante: ${mana.value}.`);
    }
  });
  if (button) animateRollButton(button);
  openDiceTab();
}

function getCalculatedSpeed() {
  const base = document.getElementById('speed').value || '-';
  const bonus = getItemBonus('speedBonus');
  return bonus ? `${base} + ${bonus} m` : base;
}

function addCustomItem() {
  const name = document.getElementById('customItemName').value.trim();
  const message = document.getElementById('customItemMessage');
  if (!name) {
    message.textContent = 'Dê um nome ao item personalizado.';
    return;
  }
  const id = `custom-${crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`}`;
  const die = Number(document.getElementById('customItemDie').value || 0);
  const item = {
    id,
    custom: true,
    name,
    category: document.getElementById('customItemCategory').value,
    rarity: document.getElementById('customItemRarity').value,
    cost: Number(document.getElementById('customItemCost').value || 0),
    description: document.getElementById('customItemDescription').value.trim() || 'Item personalizado da mesa.',
    attribute: document.getElementById('customItemAttribute').value,
    range: 'personalizado',
    attackBonus: Number(document.getElementById('customItemAttack').value || 0),
    damageBonus: Number(document.getElementById('customItemDamage').value || 0),
    armorBonus: Number(document.getElementById('customItemArmor').value || 0),
    spellBonus: Number(document.getElementById('customItemSpell').value || 0),
    maxHpBonus: Number(document.getElementById('customItemHp').value || 0),
    speedBonus: Number(document.getElementById('customItemSpeed').value || 0)
  };
  if (die) item.die = die;
  customItems.push(item);
  message.textContent = `${name} entrou na loja.`;
  document.getElementById('customItemName').value = '';
  document.getElementById('customItemDescription').value = '';
  renderEquipment();
  synchronize();
}

function applyBanner(photo) {
  bannerPhoto = photo || '';
  const heroWave = document.getElementById('heroWave');
  heroWave.classList.toggle('has-banner', Boolean(bannerPhoto));
  heroWave.style.setProperty('--banner-image', bannerPhoto ? `url("${bannerPhoto}")` : 'none');
}

function applyDynamicTheme(primary, secondary) {
  themeColors = { primary, secondary };
  document.documentElement.style.setProperty('--blue', primary);
  document.documentElement.style.setProperty('--orange', secondary);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', primary);
}

function updateProgression() {
  const progress = getXpProgress(elements.xp.value);
  elements.nivel.value = progress.level;
  const bar = document.getElementById('xpProgress');
  bar.max = progress.needed;
  bar.value = progress.level === 20 ? progress.needed : progress.earned;
  document.getElementById('xpLevelLabel').textContent = `Nível ${progress.level}`;
  document.getElementById('xpNextLabel').textContent = progress.level === 20
    ? 'Nível máximo alcançado'
    : `${progress.remaining.toLocaleString('pt-BR')} XP para o nível ${progress.level + 1}`;
  if (!elements.multiclasse.checked) elements.nivelC1.value = progress.level;
  else balanceMulticlassLevels(false);
}

function getClassBuild() {
  const groups = [
    { className: elements.classe1.value, level: Number(elements.nivelC1.value) || 0, subclass: document.getElementById('subclasse1').value },
    { className: elements.classe2.value, level: Number(elements.nivelC2.value) || 0, subclass: document.getElementById('subclasse2').value },
    { className: elements.classe3.value, level: Number(elements.nivelC3.value) || 0, subclass: document.getElementById('subclasse3').value }
  ];
  return elements.multiclasse.checked ? groups.filter((entry, index) => index < 2 || entry.level > 0) : groups.slice(0, 1);
}

function balanceMulticlassLevels(shouldSync = true) {
  if (!elements.multiclasse.checked) return;
  const total = Number(elements.nivel.value) || 1;
  const includeThird = Number(elements.nivelC3.value) > 0;
  const slots = includeThird
    ? [elements.nivelC1, elements.nivelC2, elements.nivelC3]
    : [elements.nivelC1, elements.nivelC2];
  const base = Math.floor(total / slots.length);
  let rest = total % slots.length;
  slots.forEach(input => {
    input.value = Math.max(1, base + (rest > 0 ? 1 : 0));
    rest -= 1;
  });
  if (!includeThird) elements.nivelC3.value = 0;
  if (shouldSync) synchronize();
}

function updateSubclassSelect(classSelect, levelInput, subclassSelect) {
  const previous = subclassSelect.value;
  const classLevel = Math.max(0, Number(levelInput.value) || 0);
  const unlocked = classLevel >= 3;
  subclassSelect.innerHTML = unlocked
    ? getSubclassOptions(classSelect.value).map(option => `<option value="${option}">${option}</option>`).join('')
    : `<option value="">${classLevel === 0 ? 'Classe opcional inativa' : 'Liberada no nível 3 da classe'}</option>`;
  subclassSelect.disabled = !unlocked;
  if (unlocked && [...subclassSelect.options].some(option => option.value === previous)) {
    subclassSelect.value = previous;
  }
}

function updateClassProgression() {
  const groups = [
    [elements.classe1, elements.nivelC1, document.getElementById('subclasse1')],
    [elements.classe2, elements.nivelC2, document.getElementById('subclasse2')],
    [elements.classe3, elements.nivelC3, document.getElementById('subclasse3')]
  ];
  groups.forEach(group => updateSubclassSelect(...group));

  const activeGroups = elements.multiclasse.checked
    ? groups.filter(([, input], index) => index < 2 || Number(input.value) > 0)
    : groups.slice(0, 1);
  const levelSum = activeGroups.reduce((sum, [, input]) => sum + (Number(input.value) || 0), 0);
  const totalLevel = Number(elements.nivel.value) || 1;
  const totals = getTotals();
  const scores = { for: totals[0], dex: totals[1], con: totals[2], int: totals[3], sab: totals[4], car: totals[5] };
  const problems = [];

  if (levelSum !== totalLevel) {
    problems.push(`Distribua exatamente ${totalLevel} nível(is) entre as classes; agora a soma é ${levelSum}.`);
  }
  if (new Set(activeGroups.map(([select]) => select.value)).size !== activeGroups.length) {
    problems.push('Escolha classes diferentes para a multiclasse.');
  }
  if (elements.multiclasse.checked) {
    activeGroups.forEach(([select]) => {
      const requirements = getMulticlassRequirement(select.value);
      const requiredAll = requirements.all || [];
      const requiredAny = requirements.any || [];
      const valid = requiredAll.every(attribute => scores[attribute] >= 13)
        && (!requiredAny.length || requiredAny.some(attribute => scores[attribute] >= 13));
      if (!valid) {
        const labels = requiredAll.length
          ? requiredAll.map(attribute => attribute.toUpperCase()).join(' e ')
          : requiredAny.map(attribute => attribute.toUpperCase()).join(' ou ');
        problems.push(`${select.value} exige ${labels} 13 para multiclasse.`);
      }
    });
  }

  document.getElementById('multiclassWarning').textContent = problems.join(' ');
  document.getElementById('hitDie').value = classData[elements.classe1.value]?.hitDie || 'd10';
}

function renderClassProgression() {
  const className = document.getElementById('progressionClass').value || elements.classe1.value;
  const data = classData[className];
  const overview = document.getElementById('classOverview');
  const progression = document.getElementById('classProgression');
  if (!data || !overview || !progression) return;
  renderClassBrowser(className);
  overview.innerHTML = `
    <div><p class="panel-kicker">Dado de vida ${data.hitDie}</p><h3>${className}</h3></div>
    <div><b>Status de ataque</b><p>${formatAttributeLabel(data.attackStat)} · ${data.attackDie} · ${data.weaponStyle}</p></div>
    <div><b>Conjuração</b><p>${data.castingStat ? formatAttributeLabel(data.castingStat) : 'Não conjurador base'}</p></div>
    <div><b>Clique numa subclasse</b><p>${data.subclasses.map(name => `<button type="button" class="inline-pill" data-subclass-name="${name}">${name}</button>`).join('')}</p></div>
    <div><b>Recursos centrais</b><p>${data.core.join(' · ')}</p></div>
  `;
  overview.querySelectorAll('[data-subclass-name]').forEach(button => {
    button.addEventListener('click', () => {
      overview.querySelectorAll('[data-subclass-name]').forEach(item => item.classList.toggle('active', item === button));
      document.getElementById('classSubclassDetail').textContent = `${button.dataset.subclassName}: ${describeSubclass(button.dataset.subclassName)}`;
    });
  });
  overview.insertAdjacentHTML('beforeend', '<p id="classSubclassDetail" class="system-rule full-width">Selecione uma subclasse acima para ver como ela entra na evolução.</p>');
  progression.innerHTML = '';
  for (let level = 1; level <= 20; level += 1) {
    const card = document.createElement('article');
    card.className = 'progression-level';
    const classFeature = data.core[Math.min(data.core.length - 1, Math.floor((level - 1) / 4))];
    card.innerHTML = `<span>${String(level).padStart(2, '0')}</span><div><b>Nível ${level}</b><p>${universalLevelFeatures[level]} · ${classFeature}</p><small>${describeFeature(classFeature)}</small></div>`;
    progression.appendChild(card);
  }
}

function renderClassBrowser(activeClass) {
  const browser = document.getElementById('classBrowser');
  if (!browser) return;
  browser.innerHTML = '';
  classOptions.forEach(className => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className === activeClass ? 'active' : '';
    button.textContent = className;
    button.addEventListener('click', () => {
      document.getElementById('progressionClass').value = className;
      renderClassProgression();
    });
    browser.appendChild(button);
  });
}

function getAutomaticAbilities() {
  const subrace = document.getElementById('subraca').value;
  const abilities = [];
  if (raceAbilityBySubrace[subrace]) {
    const feature = raceAbilityBySubrace[subrace];
    abilities.push({ source: subrace, name: feature, description: describeFeature(feature) });
  }
  getClassBuild().forEach(entry => {
    const data = classData[entry.className];
    if (!data) return;
    data.core.forEach((feature, index) => {
      const unlockLevel = [1, 2, 3, 5, 9][index] || 1;
      if (entry.level >= unlockLevel) {
        abilities.push({ source: `${entry.className} ${entry.level}`, name: feature, description: describeFeature(feature) });
      }
    });
    if (entry.level >= 3 && entry.subclass) {
      abilities.push({ source: 'Subclasse', name: entry.subclass, description: describeSubclass(entry.subclass) });
    }
  });
  return abilities;
}

function renderAutomaticAbilities() {
  const container = document.getElementById('autoAbilities');
  if (!container) return;
  const abilities = getAutomaticAbilities();
  container.innerHTML = '';
  if (!abilities.length) {
    container.innerHTML = '<p class="system-rule">Nenhuma habilidade automática liberada ainda.</p>';
    return;
  }
  abilities.forEach(ability => {
    const card = document.createElement('article');
    card.className = 'spell-card owned';
    card.innerHTML = `<span>${ability.source}</span><h4>${ability.name}</h4><p>${ability.description}</p><small>Liberada pela progressão, sem gastar pontos de compra.</small>`;
    container.appendChild(card);
  });
}

function getFreeSpells() {
  const names = new Set(raceGrantedSpells[document.getElementById('subraca').value] || []);
  getClassBuild().forEach(entry => {
    (classGrantedSpells[entry.className] || []).forEach(group => {
      if (entry.level >= group.level) group.spells.forEach(name => names.add(name));
    });
  });
  return [...names].map(name => spellCatalog.find(spell => spell.name === name) || {
    name,
    level: 0,
    school: 'Especial',
    classes: [],
    effect: 'Magia racial ou recurso especial.'
  });
}

function renderFreeSpells() {
  const container = document.getElementById('freeSpellCatalog');
  if (!container) return;
  const spells = getFreeSpells();
  container.innerHTML = '';
  if (!spells.length) {
    container.innerHTML = '<p class="system-rule">Nenhuma magia automática liberada ainda.</p>';
    return;
  }
  spells.forEach(spell => {
    const card = document.createElement('article');
    card.className = 'spell-card owned';
    card.innerHTML = `<span>${spell.level === 0 ? 'Truque' : `${spell.level}º círculo`} · ${spell.school}</span><h4>${spell.name}</h4><p>${describeSpell(spell)}</p>`;
    const useButton = document.createElement('button');
    useButton.type = 'button';
    useButton.textContent = 'Usar';
    useButton.addEventListener('click', () => usePower(spellToPower(spell), useButton));
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Preparar';
    button.addEventListener('click', () => prepareSpell(spell));
    card.append(useButton, button);
    container.appendChild(card);
  });
}

function getSpellCost(spell) {
  return spell.level === 0 ? 1 : spell.level + 1;
}

function getSpellBudget() {
  return 4 + (Number(elements.nivel.value) || 1) * 2;
}

function getSpellSpent() {
  return purchasedSpells.reduce((sum, name) => {
    const spell = spellCatalog.find(entry => entry.name === name);
    return sum + (spell ? getSpellCost(spell) : 0);
  }, 0);
}

function buySpell(spell) {
  if (purchasedSpells.includes(spell.name)) return;
  if (getSpellSpent() + getSpellCost(spell) > getSpellBudget()) return;
  purchasedSpells.push(spell.name);
  renderSpellCatalog();
}

function sellSpell(spell) {
  purchasedSpells = purchasedSpells.filter(name => name !== spell.name);
  renderSpellCatalog();
}

function renderSpellCatalog() {
  const className = document.getElementById('spellClassFilter').value;
  const levelFilter = document.getElementById('spellLevelFilter').value;
  const catalog = document.getElementById('spellCatalog');
  const owned = document.getElementById('ownedSpells');
  const budget = getSpellBudget();
  const spent = getSpellSpent();
  document.getElementById('spellBudget').textContent = budget;
  document.getElementById('spellSpent').textContent = spent;
  document.getElementById('spellRemaining').textContent = Math.max(0, budget - spent);
  const spells = spellCatalog.filter(spell => {
    return spell.classes.includes(className) && (levelFilter === 'all' || spell.level === Number(levelFilter));
  });
  catalog.innerHTML = '';
  if (!spells.length) catalog.innerHTML = '<p class="system-rule">Nenhuma magia disponível para esse filtro.</p>';
  else {
    spells.forEach(spell => {
      const card = document.createElement('article');
      card.className = 'spell-card';
      card.innerHTML = `<span>${spell.level === 0 ? 'Truque' : `${spell.level}º círculo`} · ${spell.school}</span><h4>${spell.name}</h4><p>${describeSpell(spell)}</p>`;
      const button = document.createElement('button');
      button.type = 'button';
      const purchased = purchasedSpells.includes(spell.name);
      button.textContent = purchased ? 'Comprada' : `Comprar · ${getSpellCost(spell)} pts`;
      button.disabled = purchased || spent + getSpellCost(spell) > budget;
      button.addEventListener('click', () => buySpell(spell));
      card.appendChild(button);
      catalog.appendChild(card);
    });
  }
  owned.innerHTML = '';
  purchasedSpells.forEach(name => {
    const spell = spellCatalog.find(entry => entry.name === name);
    if (!spell) return;
    const card = document.createElement('article');
    card.className = 'spell-card owned';
    card.innerHTML = `<span>${spell.level === 0 ? 'Truque' : `${spell.level}º círculo`} · ${spell.school}</span><h4>${spell.name}</h4><p>${describeSpell(spell)}</p>`;
    const prepareButton = document.createElement('button');
    prepareButton.type = 'button';
    prepareButton.textContent = 'Preparar';
    prepareButton.addEventListener('click', () => prepareSpell(spell));
    const useButton = document.createElement('button');
    useButton.type = 'button';
    useButton.textContent = 'Usar';
    useButton.addEventListener('click', () => usePower(spellToPower(spell), useButton));
    const sellButton = document.createElement('button');
    sellButton.type = 'button';
    sellButton.textContent = 'Vender';
    sellButton.addEventListener('click', () => sellSpell(spell));
    card.append(useButton, prepareButton, sellButton);
    owned.appendChild(card);
  });
  if (!purchasedSpells.length) owned.innerHTML = '<p class="system-rule">Nenhuma magia comprada ainda.</p>';
  renderCustomSpells();
}

function prepareSpell(spell) {
  const textarea = document.querySelector(`[data-store="spell-${spell.level}"]`);
  if (!textarea) return;
  const current = textarea.value.split('\n').map(value => value.trim()).filter(Boolean);
  if (!current.includes(spell.name)) current.push(spell.name);
  textarea.value = current.join('\n');
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function inferSpellType(spell) {
  const text = `${spell.name} ${spell.effect || ''}`.toLowerCase();
  if (text.includes('curar') || text.includes('cura') || text.includes('restaura')) return 'heal';
  if (text.includes('recupera') && text.includes('mana')) return 'mana';
  if (spell.level === 0 || spell.school === 'Evocação' || text.includes('dano') || text.includes('raio') || text.includes('bola')) return 'damage';
  return 'utility';
}

function spellToPower(spell) {
  const level = Math.max(0, Number(spell.level) || 0);
  return {
    name: spell.name,
    description: describeSpell(spell),
    origin: spell.classes?.join('/') || 'Magia',
    effectType: inferSpellType(spell),
    level,
    die: spell.die || 'auto',
    diceCount: spell.diceCount || Math.max(1, level || 1),
    bonus: spell.bonus || 0,
    manaCost: spell.manaCost ?? Math.max(0, level)
  };
}

function addCustomSpell() {
  const name = document.getElementById('customSpellName').value.trim();
  const message = document.getElementById('customSpellMessage');
  if (!name) {
    message.textContent = 'Dê um nome para a magia personalizada.';
    return;
  }
  customSpells.push({
    id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    name,
    origin: document.getElementById('customSpellOrigin').value,
    effectType: document.getElementById('customSpellType').value,
    level: Number(document.getElementById('customSpellLevel').value || 0),
    die: document.getElementById('customSpellDie').value,
    diceCount: Number(document.getElementById('customSpellDiceCount').value || 0),
    bonus: Number(document.getElementById('customSpellBonus').value || 0),
    manaCost: Number(document.getElementById('customSpellManaCost').value || 0),
    description: document.getElementById('customSpellDescription').value.trim() || 'Magia personalizada da ficha.'
  });
  message.textContent = `${name} adicionada.`;
  document.getElementById('customSpellName').value = '';
  document.getElementById('customSpellDescription').value = '';
  renderCustomSpells();
  saveDraftSoon();
}

function renderCustomSpells() {
  const list = document.getElementById('customSpellList');
  if (!list) return;
  list.innerHTML = '';
  if (!customSpells.length) {
    list.innerHTML = '<p class="system-rule">Nenhuma magia personalizada ainda.</p>';
    return;
  }
  customSpells.forEach((spell, index) => {
    const card = document.createElement('article');
    card.className = 'spell-card owned';
    card.innerHTML = `<span>${spell.origin} · ${formatPowerEffect(spell)}</span><h4>${spell.name}</h4><p>${spell.description}</p>`;
    const useButton = document.createElement('button');
    useButton.type = 'button';
    useButton.textContent = 'Usar';
    useButton.addEventListener('click', () => usePower(spell, useButton));
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Excluir';
    deleteButton.addEventListener('click', () => {
      customSpells.splice(index, 1);
      renderCustomSpells();
      saveDraftSoon();
    });
    card.append(useButton, deleteButton);
    list.appendChild(card);
  });
}

function extractThemeFromImage(source) {
  if (!source) return;
  const image = new Image();
  image.onload = () => {
    let data;
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = 64;
      canvas.height = 64;
      context.drawImage(image, 0, 0, 64, 64);
      data = context.getImageData(0, 0, 64, 64).data;
    } catch {
      return;
    }
    const colors = [];

    for (let index = 0; index < data.length; index += 64) {
      const [r, g, b, alpha] = [data[index], data[index + 1], data[index + 2], data[index + 3]];
      if (alpha < 180) continue;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max - min;
      const brightness = (r + g + b) / 3;
      if (saturation < 28 || brightness < 35 || brightness > 235) continue;
      colors.push({ r, g, b, saturation, brightness });
    }

    if (colors.length < 2) return;
    colors.sort((a, b) => b.saturation - a.saturation);
    const primary = colors[0];
    const secondary = colors
      .slice(1)
      .sort((a, b) => themeColorScore(b, primary) - themeColorScore(a, primary))[0];
    applyDynamicTheme(rgbToHex(primary), rgbToHex(secondary));
  };
  image.crossOrigin = 'anonymous';
  image.src = source;
}

function renderRaceReference() {
  const grid = document.querySelector('#system-races .reference-grid');
  if (!grid) return;
  grid.innerHTML = '';
  Object.entries(raceData).forEach(([name, race]) => {
    const article = document.createElement('article');
    const subraces = Object.keys(race.subraces).join(' · ');
    article.innerHTML = `<h3>${name}</h3><b>${race.source}</b><p>${race.traits}</p><small>${subraces}</small>`;
    grid.appendChild(article);
  });
}

function renderClassReference() {
  const grid = document.querySelector('#system-classes .reference-grid');
  if (!grid) return;
  grid.innerHTML = '';
  Object.entries(classData).forEach(([name, data]) => {
    const article = document.createElement('article');
    article.innerHTML = `<h3>${name}</h3><b>${data.hitDie} · ATK ${formatAttributeLabel(data.attackStat)} · ${data.attackDie}</b><p>${data.weaponStyle}. ${data.core.map(feature => `${feature}: ${describeFeature(feature)}`).join(' ')}</p><small>Conjuração: ${data.castingStat ? formatAttributeLabel(data.castingStat) : 'não conjurador base'} · Subclasses: ${data.subclasses.map(subclass => `${subclass} (${describeSubclass(subclass)})`).join(' · ')}</small>`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'inline-pill';
    button.textContent = 'Ver evolução';
    button.addEventListener('click', () => {
      document.querySelector('[data-target="tab-progressao"]').click();
      document.getElementById('progressionClass').value = name;
      renderClassProgression();
    });
    article.appendChild(button);
    grid.appendChild(article);
  });
}

function colorDistance(a, b) {
  return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
}

function themeColorScore(color, primary) {
  return (colorDistance(color, primary) * 3)
    + (color.saturation * .8)
    - (Math.abs(color.brightness - 155) * 1.2);
}

function rgbToHex({ r, g, b }) {
  const brightness = (r + g + b) / 3;
  const scale = brightness > 205 ? 205 / brightness : brightness < 75 ? 75 / brightness : 1;
  return `#${[r, g, b].map(value => {
    return Math.min(255, Math.round(value * scale)).toString(16).padStart(2, '0');
  }).join('')}`;
}

function updateSpellStats() {
  const castingStat = document.getElementById('castingStat').value;
  const modifier = getAttributeModifier(castingStat);
  const proficiency = Number(elements.profBonus.value.replace('+', '')) || 0;
  const itemMagicBonus = getItemBonus('spellBonus');
  const labels = { int: 'INT', sab: 'SAB', car: 'CAR' };
  document.getElementById('spellSaveDc').textContent = 8 + proficiency + modifier + itemMagicBonus;
  document.getElementById('spellAttackBonus').textContent = formatSigned(proficiency + modifier + itemMagicBonus).replace(' ', '');
  document.getElementById('spellCastingStat').textContent = labels[castingStat];
  document.getElementById('maxMana').textContent = getCalculatedMaxMana();
}

function synchronize() {
  updateProgression();
  elements.profBonus.value = computeProfBonus(elements.nivel.value);
  updateBudgetText(getRemainingPoints(elements.nivel.value, getInputValues()));
  updateDistribuicaoLimits();
  updateTotals(getTotals());
  updateMagicLifeUI(elements.pontosMagia.value, elements.pontosVida.value, elements.nivel.value);
  renderSummary();
  updateFeaturedSkillSummary();
  updateSkillBudget();
  updateSpellStats();
  updateClassProgression();
  clampResources();
  renderEquipment();
  renderSpellCatalog();
  renderClassProgression();
  renderAutomaticAbilities();
  renderFreeSpells();
  renderAbilityCatalog();

  const combatHp = document.getElementById('combatHp');
  const combatProf = document.getElementById('combatProf');
  const combatInit = document.getElementById('combatInit');
  const combatDefense = document.getElementById('combatDefense');
  if (combatHp) combatHp.textContent = getCalculatedMaxHp();
  if (combatProf) combatProf.textContent = elements.profBonus.value;
  if (combatInit) combatInit.textContent = elements.modDex.textContent;
  if (combatDefense) combatDefense.textContent = getCalculatedArmorClass();
  document.getElementById('combatSpeed').textContent = getCalculatedSpeed();
  document.getElementById('combatVision').textContent = document.getElementById('vision').value || '-';
  document.getElementById('combatHitDie').textContent = document.getElementById('hitDie').value;
  renderClassCombatStats();
  saveDraftSoon();
}

function loadSavedCharacters() {
  const saved = JSON.parse(localStorage.getItem('savedCharacters') || '[]');
  elements.savedList.innerHTML = saved.length === 0 ? '<p>Nenhum personagem salvo.</p>' : '';
  saved.forEach((character, index) => {
    const card = document.createElement('div');
    card.className = 'saved-card';
    if (character.banner) {
      card.style.setProperty('--saved-banner', `url("${character.banner}")`);
      card.classList.add('has-saved-banner');
    }

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
      img.alt = `Retrato de ${character.nome}`;
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

function saveDraftNow() {
  if (isRestoringCharacter) return;
  localStorage.setItem('lastCharacterDraft', JSON.stringify(getCharacterData()));
}

function saveDraftSoon() {
  if (isRestoringCharacter) return;
  clearTimeout(draftTimer);
  draftTimer = window.setTimeout(saveDraftNow, 250);
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
    currentHp: document.getElementById('currentHp').value,
    armorClass: document.getElementById('armorClass').value,
    speed: document.getElementById('speed').value,
    vision: document.getElementById('vision').value,
    hitDie: document.getElementById('hitDie').value,
    raca: elements.raca.value,
    subraca: document.getElementById('subraca').value,
    origem: elements.origem.value,
    classe1: elements.classe1.value,
    nivelC1: elements.nivelC1.value,
    subclasse1: document.getElementById('subclasse1').value,
    multiclasse: elements.multiclasse.checked,
    classe2: elements.classe2.value,
    nivelC2: elements.nivelC2.value,
    subclasse2: document.getElementById('subclasse2').value,
    classe3: elements.classe3.value,
    nivelC3: elements.nivelC3.value,
    subclasse3: document.getElementById('subclasse3').value,
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
    raceCar: document.getElementById('raceCar').value,
    distCar: document.getElementById('distCar').value,
    pontosMagia: elements.pontosMagia.value,
    pontosVida: elements.pontosVida.value,
    currentMana: document.getElementById('currentMana').value,
    castingStat: document.getElementById('castingStat').value,
    spellSlots: document.getElementById('spellSlots').value,
    historia: elements.historia.value,
    habilidades: elements.habilidades.value,
    tituloHabilidade: elements.tituloHabilidade.value,
    descricaoHabilidade: elements.descricaoHabilidade.value,
    descricaoClasse: elements.descricaoClasse.value,
    purchasedSkills,
    inventory,
    customItems,
    purchasedSpells,
    customSpells,
    themeColors,
    storedFields: Object.fromEntries(
      [...document.querySelectorAll('[data-store]')].map(input => [input.dataset.store, input.value])
    ),
    skillRaca: document.getElementById('skillRaca').value,
    skillClasse1: document.getElementById('skillClasse1').value,
    skillClasse2: document.getElementById('skillClasse2').value,
    skillClasse3: document.getElementById('skillClasse3').value,
    pericia1: document.getElementById('pericia1').value,
    pericia2: document.getElementById('pericia2').value,
    photo: elements.photoPreview.dataset.photo || '',
    banner: bannerPhoto
  };
}

function loadCharacter(index) {
  const character = typeof index === 'object'
    ? index
    : JSON.parse(localStorage.getItem('savedCharacters') || '[]')[index];
  if (!character) return;

  isRestoringCharacter = true;
  elements.sistema.value = character.sistema || 'D&D';
  elements.nome.value = character.nome || '';
  elements.jogador.value = character.jogador || '';
  elements.nivel.value = character.nivel || 1;
  elements.xp.value = character.xp || 0;
  elements.vidaMaxima.value = character.vidaMaxima || 30;
  document.getElementById('currentHp').value = character.currentHp || character.vidaMaxima || 30;
  document.getElementById('armorClass').value = character.armorClass || 10;
  document.getElementById('speed').value = character.speed || '9 m';
  document.getElementById('vision').value = character.vision || 'normal';
  document.getElementById('hitDie').value = character.hitDie || 'd10';
  const migratedRace = legacyRaceMap[character.raca];
  elements.raca.value = migratedRace?.[0] || character.raca || 'Forjado Bélico';
  applySelectedRaceBonuses();
  document.getElementById('subraca').value = character.subraca || migratedRace?.[1] || document.getElementById('subraca').value;
  applySelectedSubraceBonuses();
  elements.origem.value = character.origem || 'Acolhido';
  elements.classe1.value = character.classe1 || 'Bárbaro';
  elements.nivelC1.value = character.nivelC1 || 1;
  elements.multiclasse.checked = character.multiclasse || false;
  toggleMulticlassFields();
  elements.classe2.value = character.classe2 || 'Bárbaro';
  elements.nivelC2.value = character.nivelC2 || 1;
  elements.classe3.value = character.classe3 || 'Bárbaro';
  elements.nivelC3.value = character.nivelC3 || 0;
  updateClassProgression();
  document.getElementById('subclasse1').value = character.subclasse1 || document.getElementById('subclasse1').value;
  document.getElementById('subclasse2').value = character.subclasse2 || document.getElementById('subclasse2').value;
  document.getElementById('subclasse3').value = character.subclasse3 || document.getElementById('subclasse3').value;
  document.getElementById('distFor').value = character.distFor || 0;
  document.getElementById('distDex').value = character.distDex || 0;
  document.getElementById('distCon').value = character.distCon || 0;
  document.getElementById('distInt').value = character.distInt || 0;
  document.getElementById('distSab').value = character.distSab || 0;
  document.getElementById('distCar').value = character.distCar || 0;
  document.getElementById('raceFor').value = character.raceFor || 0;
  document.getElementById('raceDex').value = character.raceDex || 0;
  document.getElementById('raceCon').value = character.raceCon || 0;
  document.getElementById('raceInt').value = character.raceInt || 0;
  document.getElementById('raceSab').value = character.raceSab || 0;
  document.getElementById('raceCar').value = character.raceCar || 0;
  elements.pontosMagia.value = character.pontosMagia || 15;
  elements.pontosVida.value = character.pontosVida || 15;
  document.getElementById('currentMana').value = character.currentMana || character.pontosMagia || 15;
  document.getElementById('castingStat').value = character.castingStat || 'int';
  document.getElementById('spellSlots').value = character.spellSlots || 0;
  elements.historia.value = character.historia || '';
  elements.habilidades.value = character.habilidades || '';
  elements.tituloHabilidade.value = character.tituloHabilidade || '';
  elements.descricaoHabilidade.value = character.descricaoHabilidade || '';
  elements.descricaoClasse.value = character.descricaoClasse || '';
  purchasedSkills = Array.isArray(character.purchasedSkills) ? character.purchasedSkills : [];
  inventory = Array.isArray(character.inventory) ? character.inventory : [];
  customItems = Array.isArray(character.customItems) ? character.customItems : [];
  purchasedSpells = Array.isArray(character.purchasedSpells) ? character.purchasedSpells : [];
  customSpells = Array.isArray(character.customSpells) ? character.customSpells : [];
  themeColors = character.themeColors || { primary: '#7EBAEE', secondary: '#F0A06F' };
  resetSkillEditor();
  renderSkillCollection();
  document.getElementById('skillRaca').value = character.skillRaca || '';
  document.getElementById('skillClasse1').value = character.skillClasse1 || '';
  document.getElementById('skillClasse2').value = character.skillClasse2 || '';
  document.getElementById('skillClasse3').value = character.skillClasse3 || '';
  document.getElementById('pericia1').value = character.pericia1 || '';
  document.getElementById('pericia2').value = character.pericia2 || '';
  Object.entries(character.storedFields || {}).forEach(([key, value]) => {
    const input = document.querySelector(`[data-store="${key}"]`);
    if (input) input.value = value;
  });

  if (character.photo) {
    elements.photoPreview.innerHTML = `<img src="${character.photo}" alt="Personagem" />`;
    elements.photoPreview.dataset.photo = character.photo;
  } else {
    elements.photoPreview.innerHTML = 'Preview da foto';
    elements.photoPreview.dataset.photo = '';
  }

  applyBanner(character.banner || '');
  applyDynamicTheme(themeColors.primary, themeColors.secondary);
  renderEquipment();

  synchronize();
  isRestoringCharacter = false;
  saveDraftSoon();
}

function toggleMulticlassFields() {
  elements.multiclasseFields.classList.toggle('hidden', !elements.multiclasse.checked);
  if (!elements.multiclasse.checked) elements.nivelC1.value = elements.nivel.value;
  synchronize();
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    elements.photoPreview.innerHTML = `<img src="${reader.result}" alt="Foto do personagem" />`;
    elements.photoPreview.dataset.photo = reader.result;
    if (!bannerPhoto) extractThemeFromImage(reader.result);
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

function handleBannerUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    applyBanner(reader.result);
    extractThemeFromImage(reader.result);
  };
  reader.readAsDataURL(file);
}

function applyImageUrl(input, callback) {
  const url = input.value.trim();
  if (!url) return;
  const probe = new Image();
  probe.onload = () => callback(url);
  probe.onerror = () => input.setCustomValidity('Não foi possível carregar esta imagem.');
  input.setCustomValidity('');
  probe.src = url;
}

function setupInnerTabs() {
  document.querySelectorAll('[data-magic-target]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-magic-target]').forEach(tab => tab.classList.toggle('active', tab === button));
      document.querySelectorAll('[data-magic-section]').forEach(section => {
        section.classList.toggle('active', section.dataset.magicSection === button.dataset.magicTarget);
      });
    });
  });
}

function init() {
  isRestoringCharacter = true;
  populateSelect(elements.raca, raceOptions);
  populateSelect(elements.origem, originOptions);
  populateSelect(elements.classe1, classOptions);
  populateSelect(elements.classe2, classOptions);
  populateSelect(elements.classe3, classOptions);
  populateSelect(document.getElementById('progressionClass'), classOptions);
  populateSelect(document.getElementById('abilityClassFilter'), ['Todas', ...classOptions]);
  populateSelect(document.getElementById('spellClassFilter'), spellcastingClasses);
  document.getElementById('spellClassFilter').value = spellcastingClasses.includes(elements.classe1.value)
    ? elements.classe1.value
    : 'Mago';

  elements.xp.addEventListener('input', () => {
    if (Number(elements.xp.value) < 0) elements.xp.value = 0;
    synchronize();
  });

  elements.nivel.addEventListener('change', () => {
    const requestedLevel = Math.min(20, Math.max(1, Number(elements.nivel.value) || 1));
    elements.xp.value = xpThresholds[requestedLevel - 1];
    synchronize();
  });

  [elements.nivelC1, elements.nivelC2].forEach(input => {
    input.addEventListener('input', () => {
      if (Number(input.value) < 1) input.value = 1;
      synchronize();
    });
  });
  elements.nivelC3.addEventListener('input', () => {
    if (Number(elements.nivelC3.value) < 0) elements.nivelC3.value = 0;
    synchronize();
  });

  elements.multiclasse.addEventListener('change', toggleMulticlassFields);
  document.getElementById('balanceMulticlass').addEventListener('click', () => balanceMulticlassLevels(true));
  elements.raca.addEventListener('change', applySelectedRaceBonuses);
  document.getElementById('subraca').addEventListener('change', applySelectedSubraceBonuses);
  document.getElementById('progressionClass').addEventListener('change', renderClassProgression);
  [elements.classe1, elements.classe2, elements.classe3].forEach(select => {
    select.addEventListener('change', () => {
      if (select === elements.classe1 && spellcastingClasses.includes(select.value)) {
        document.getElementById('spellClassFilter').value = select.value;
        renderSpellCatalog();
      }
      if (select === elements.classe1) {
        document.getElementById('progressionClass').value = select.value;
        renderClassProgression();
      }
      synchronize();
    });
  });
  document.getElementById('spellClassFilter').addEventListener('change', renderSpellCatalog);
  document.getElementById('spellLevelFilter').addEventListener('change', renderSpellCatalog);
  document.getElementById('abilityClassFilter').addEventListener('change', renderAbilityCatalog);

  [
    elements.nome,
    elements.raca,
    elements.classe1,
    elements.vidaMaxima,
    document.getElementById('armorClass'),
    document.getElementById('speed'),
    document.getElementById('vision'),
    document.getElementById('hitDie'),
    document.getElementById('currentMana'),
    document.getElementById('castingStat'),
    document.getElementById('spellSlots'),
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

  elements.pontosMagia.addEventListener('input', synchronize);
  elements.pontosVida.addEventListener('input', synchronize);

  document.querySelectorAll('[data-action="dados"]').forEach(button => {
    button.addEventListener('click', () => handleRoll(button.dataset.type));
  });

  elements.photoInput.addEventListener('change', handlePhotoUpload);
  document.getElementById('bannerInput').addEventListener('change', handleBannerUpload);
  document.getElementById('skillPhotoInput').addEventListener('change', handleSkillPhotoUpload);
  document.getElementById('addCustomItem').addEventListener('click', addCustomItem);
  document.getElementById('addCustomSpell').addEventListener('click', addCustomSpell);
  document.getElementById('applyDamage').addEventListener('click', () => updateResource('damage', document.getElementById('resourceAmount').value));
  document.getElementById('applyHealing').addEventListener('click', () => updateResource('heal', document.getElementById('resourceAmount').value));
  document.getElementById('spendMana').addEventListener('click', () => updateResource('spendMana', document.getElementById('resourceAmount').value));
  document.getElementById('restoreMana').addEventListener('click', () => updateResource('restoreMana', document.getElementById('resourceAmount').value));
  document.getElementById('photoUrl').addEventListener('change', event => applyImageUrl(event.target, url => {
    elements.photoPreview.innerHTML = `<img src="${url}" alt="Foto do personagem">`;
    elements.photoPreview.dataset.photo = url;
    extractThemeFromImage(url);
    renderSummary();
  }));
  document.getElementById('bannerUrl').addEventListener('change', event => applyImageUrl(event.target, url => {
    applyBanner(url);
    extractThemeFromImage(url);
  }));
  document.getElementById('skillPhotoUrl').addEventListener('change', event => applyImageUrl(event.target, url => {
    skillPhoto = url;
    document.getElementById('skillPhotoPreview').innerHTML = `<img src="${url}" alt="Imagem da habilidade">`;
  }));
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
    input.value = localStorage.getItem(key) ?? input.value;
    input.addEventListener('input', event => {
      localStorage.setItem(key, event.target.value);
    });
  });
  document.addEventListener('input', saveDraftSoon);
  document.addEventListener('change', saveDraftSoon);

  setupTabs();
  setupInnerTabs();
  document.getElementById('skillBuilderMount').appendChild(document.querySelector('.skill-builder'));
  renderRaceReference();
  renderClassReference();
  initDiceRoller();
  toggleMulticlassFields();
  applySelectedRaceBonuses();
  loadSavedCharacters();
  renderSkillCollection();
  renderSpellCatalog();
  document.getElementById('progressionClass').value = elements.classe1.value;
  renderClassProgression();
  const draft = JSON.parse(localStorage.getItem('lastCharacterDraft') || 'null');
  if (draft) {
    loadCharacter(draft);
  } else {
    isRestoringCharacter = false;
    synchronize();
  }
}

init();
