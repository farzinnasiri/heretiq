import { Dimension, Scores, Coverage, Archetype } from './types';
import { DIMENSIONS } from './questions';

export const ARCHETYPES: Archetype[] = [
  {
    id: 'techno-cosmopolitan',
    code: 'TC',
    title: 'The Techno-Cosmopolitan',
    personaName: 'Kai',
    prototype: { M: 70, A: 70, I: 60, G: 70, E: 40, T: 75 },
    description: 'Open markets, open borders, room to experiment. You lean toward building what comes next.',
    cardImagePath: '/archetypes/thumbs/techno-cosmopolitan.webp',
    thumbnailImagePath: '/archetypes/thumbs/techno-cosmopolitan.webp',
    fullCardImagePath: '/archetypes/techno-cosmopolitan.webp',
    cardColor: '#0066FF',
    exemplars: [
      { name: 'Sam Altman', role: 'CEO of OpenAI & Tech Builder', wikipediaUrl: 'https://en.wikipedia.org/wiki/Sam_Altman' },
      { name: 'Vitalik Buterin', role: 'Ethereum Co-Founder & Technologist', wikipediaUrl: 'https://en.wikipedia.org/wiki/Vitalik_Buterin' },
      { name: 'Marc Andreessen', role: 'Techno-Optimist Venture Capitalist', wikipediaUrl: 'https://en.wikipedia.org/wiki/Marc_Andreessen' },
      { name: 'Brian Armstrong', role: 'Coinbase Founder & Open Tech Advocate', wikipediaUrl: 'https://en.wikipedia.org/wiki/Brian_Armstrong' },
      { name: 'Lex Fridman', role: 'AI Researcher & Podcast Host', wikipediaUrl: 'https://en.wikipedia.org/wiki/Lex_Fridman' },
    ],
  },
  {
    id: 'civic-progressive',
    code: 'CP',
    title: 'The Civic Progressive',
    personaName: 'Ellis',
    prototype: { M: 35, A: 65, I: 70, G: 70, E: 70, T: 60 },
    description: 'You lean toward public solutions, personal freedom, and institutions that can deliver change.',
    cardImagePath: '/archetypes/thumbs/civic-progressive.webp',
    thumbnailImagePath: '/archetypes/thumbs/civic-progressive.webp',
    fullCardImagePath: '/archetypes/civic-progressive.webp',
    cardColor: '#10B981',
    exemplars: [
      { name: 'Alexandria Ocasio-Cortez', role: 'U.S. Representative & Progressive Icon', wikipediaUrl: 'https://en.wikipedia.org/wiki/Alexandria_Ocasio-Cortez' },
      { name: 'Bernie Sanders', role: 'U.S. Senator & Democratic Socialist', wikipediaUrl: 'https://en.wikipedia.org/wiki/Bernie_Sanders' },
      { name: 'Greta Thunberg', role: 'Climate Justice Activist & Youth Leader', wikipediaUrl: 'https://en.wikipedia.org/wiki/Greta_Thunberg' },
      { name: 'Jacinda Ardern', role: 'Former Prime Minister of New Zealand', wikipediaUrl: 'https://en.wikipedia.org/wiki/Jacinda_Ardern' },
      { name: 'Justin Trudeau', role: 'Prime Minister of Canada & Reformer', wikipediaUrl: 'https://en.wikipedia.org/wiki/Justin_Trudeau' },
    ],
  },
  {
    id: 'market-rebel',
    code: 'MR',
    title: 'The Market Rebel',
    personaName: 'Maverick',
    prototype: { M: 75, A: 75, I: 25, G: 55, E: 30, T: 65 },
    description: 'You favour competition and personal choice, with little instinct to defer to the establishment.',
    cardImagePath: '/archetypes/thumbs/market-rebel.webp',
    thumbnailImagePath: '/archetypes/thumbs/market-rebel.webp',
    fullCardImagePath: '/archetypes/market-rebel.webp',
    cardColor: '#FF2A54',
    exemplars: [
      { name: 'Javier Milei', role: 'President of Argentina & Libertarian Economist', wikipediaUrl: 'https://en.wikipedia.org/wiki/Javier_Milei' },
      { name: 'Ron Paul', role: 'Libertarian Icon & Former U.S. Congressman', wikipediaUrl: 'https://en.wikipedia.org/wiki/Ron_Paul' },
      { name: 'Ayn Rand', role: 'Philosopher & Objectivist Author', wikipediaUrl: 'https://en.wikipedia.org/wiki/Ayn_Rand' },
      { name: 'Milton Friedman', role: 'Nobel Prize Free Market Economist', wikipediaUrl: 'https://en.wikipedia.org/wiki/Milton_Friedman' },
      { name: 'Ross Ulbricht', role: 'Cypherpunk & Early Crypto Libertarian', wikipediaUrl: 'https://en.wikipedia.org/wiki/Ross_Ulbricht' },
    ],
  },
  {
    id: 'solidarity-sceptic',
    code: 'SS',
    title: 'The Solidarity Sceptic',
    personaName: 'Blair',
    prototype: { M: 30, A: 65, I: 25, G: 65, E: 75, T: 45 },
    description: 'You want resources shared more widely, and you question who gets to make the rules.',
    cardImagePath: '/archetypes/thumbs/solidarity-sceptic.webp',
    thumbnailImagePath: '/archetypes/thumbs/solidarity-sceptic.webp',
    fullCardImagePath: '/archetypes/solidarity-sceptic.webp',
    cardColor: '#E11D48',
    exemplars: [
      { name: 'Hasan Piker', role: 'Political Commentator & Twitch Streamer', wikipediaUrl: 'https://en.wikipedia.org/wiki/Hasan_Piker' },
      { name: 'Noam Chomsky', role: 'Linguist & Anti-Imperialist Critic', wikipediaUrl: 'https://en.wikipedia.org/wiki/Noam_Chomsky' },
      { name: 'George Orwell', role: 'Democratic Socialist Author of 1984', wikipediaUrl: 'https://en.wikipedia.org/wiki/George_Orwell' },
      { name: 'Slavoj Žižek', role: 'Cultural Philosopher & Marxist Theorist', wikipediaUrl: 'https://en.wikipedia.org/wiki/Slavoj_%C5%BDi%C5%BEek' },
      { name: 'Cornel West', role: 'Civil Rights Activist & Philosopher', wikipediaUrl: 'https://en.wikipedia.org/wiki/Cornel_West' },
    ],
  },
  {
    id: 'protectionist-traditionalist',
    code: 'PT',
    title: 'The Protectionist Traditionalist',
    personaName: 'Ward',
    prototype: { M: 45, A: 25, I: 60, G: 25, E: 45, T: 25 },
    description: 'You put weight on stability, national priorities, and caution about rapid change.',
    cardImagePath: '/archetypes/thumbs/protectionist-traditionalist.webp',
    thumbnailImagePath: '/archetypes/thumbs/protectionist-traditionalist.webp',
    fullCardImagePath: '/archetypes/protectionist-traditionalist.webp',
    cardColor: '#D97706',
    exemplars: [
      { name: 'Donald Trump', role: '45th & 47th U.S. President & Tariff Protectionist', wikipediaUrl: 'https://en.wikipedia.org/wiki/Donald_Trump' },
      { name: 'JD Vance', role: 'U.S. Vice President & Author of Hillbilly Elegy', wikipediaUrl: 'https://en.wikipedia.org/wiki/JD_Vance' },
      { name: 'Tucker Carlson', role: 'Traditionalist Commentator & Media Host', wikipediaUrl: 'https://en.wikipedia.org/wiki/Tucker_Carlson' },
      { name: 'Viktor Orbán', role: 'Prime Minister of Hungary & National Conservative', wikipediaUrl: 'https://en.wikipedia.org/wiki/Viktor_Orb%C3%A1n' },
      { name: 'Marine Le Pen', role: 'French National Rally Leader & Protectionist', wikipediaUrl: 'https://en.wikipedia.org/wiki/Marine_Le_Pen' },
    ],
  },
  {
    id: 'local-builder',
    code: 'LB',
    title: 'The Local Builder',
    personaName: 'Mason',
    prototype: { M: 35, A: 45, I: 65, G: 30, E: 65, T: 70 },
    description: 'You favour public investment and new tools, with responsibility starting close to home.',
    cardImagePath: '/archetypes/thumbs/local-builder.webp',
    thumbnailImagePath: '/archetypes/thumbs/local-builder.webp',
    fullCardImagePath: '/archetypes/local-builder.webp',
    cardColor: '#059669',
    exemplars: [
      { name: 'MrBeast', role: 'Philanthropist & Creator (Team Trees)', wikipediaUrl: 'https://en.wikipedia.org/wiki/MrBeast' },
      { name: 'Yvon Chouinard', role: 'Patagonia Founder & Environmental Steward', wikipediaUrl: 'https://en.wikipedia.org/wiki/Yvon_Chouinard' },
      { name: 'Jane Jacobs', role: 'Urbanist & Walkable Cities Advocate', wikipediaUrl: 'https://en.wikipedia.org/wiki/Jane_Jacobs' },
      { name: 'Boyan Slat', role: 'The Ocean Cleanup Founder & Inventor', wikipediaUrl: 'https://en.wikipedia.org/wiki/Boyan_Slat' },
      { name: 'Wendell Berry', role: 'Agrarian Author & Local Food Advocate', wikipediaUrl: 'https://en.wikipedia.org/wiki/Wendell_Berry' },
    ],
  },
  {
    id: 'open-society-reformer',
    code: 'OR',
    title: 'The Open-Society Reformer',
    personaName: 'Felix',
    prototype: { M: 50, A: 75, I: 65, G: 75, E: 60, T: 55 },
    description: 'You lean toward personal freedom and wider belonging, with change through existing institutions.',
    cardImagePath: '/archetypes/thumbs/open-society-reformer.webp',
    thumbnailImagePath: '/archetypes/thumbs/open-society-reformer.webp',
    fullCardImagePath: '/archetypes/open-society-reformer.webp',
    cardColor: '#0284C7',
    exemplars: [
      { name: 'Barack Obama', role: '44th U.S. President & Liberal Statesman', wikipediaUrl: 'https://en.wikipedia.org/wiki/Barack_Obama' },
      { name: 'Volodymyr Zelenskyy', role: 'President of Ukraine & Democracy Champion', wikipediaUrl: 'https://en.wikipedia.org/wiki/Volodymyr_Zelenskyy' },
      { name: 'George Soros', role: 'Open Society Foundations Founder & Financier', wikipediaUrl: 'https://en.wikipedia.org/wiki/George_Soros' },
      { name: 'Malala Yousafzai', role: 'Nobel Peace Laureate & Human Rights Activist', wikipediaUrl: 'https://en.wikipedia.org/wiki/Malala_Yousafzai' },
      { name: 'Emmanuel Macron', role: 'President of France & Centrist Reformer', wikipediaUrl: 'https://en.wikipedia.org/wiki/Emmanuel_Macron' },
    ],
  },
  {
    id: 'cautious-egalitarian',
    code: 'CE',
    title: 'The Cautious Egalitarian',
    personaName: 'Haven',
    prototype: { M: 30, A: 50, I: 60, G: 55, E: 75, T: 25 },
    description: 'You want gaps narrowed and public needs met, with careful checks on what comes next.',
    cardImagePath: '/archetypes/thumbs/cautious-egalitarian.webp',
    thumbnailImagePath: '/archetypes/thumbs/cautious-egalitarian.webp',
    fullCardImagePath: '/archetypes/cautious-egalitarian.webp',
    cardColor: '#65A30D',
    exemplars: [
      { name: 'Elizabeth Warren', role: 'U.S. Senator & Consumer Protection Champion', wikipediaUrl: 'https://en.wikipedia.org/wiki/Elizabeth_Warren' },
      { name: 'Robert Reich', role: 'Former Labor Secretary & Economic Inequality Critic', wikipediaUrl: 'https://en.wikipedia.org/wiki/Robert_Reich' },
      { name: 'Thomas Piketty', role: 'Author of Capital in the Twenty-First Century', wikipediaUrl: 'https://en.wikipedia.org/wiki/Thomas_Piketty' },
      { name: 'Naomi Klein', role: 'Social Critic & Author of The Shock Doctrine', wikipediaUrl: 'https://en.wikipedia.org/wiki/Naomi_Klein' },
      { name: 'Luiz Inácio Lula da Silva', role: 'President of Brazil & Anti-Poverty Leader', wikipediaUrl: 'https://en.wikipedia.org/wiki/Luiz_In%C3%A1cio_Lula_da_Silva' },
    ],
  },
  {
    id: 'sovereign-entrepreneur',
    code: 'SE',
    title: 'The Sovereign Entrepreneur',
    personaName: 'Sterling',
    prototype: { M: 75, A: 50, I: 40, G: 25, E: 30, T: 70 },
    description: 'You favour competition and new technology, while keeping national choices close to home.',
    cardImagePath: '/archetypes/thumbs/sovereign-entrepreneur.webp',
    thumbnailImagePath: '/archetypes/thumbs/sovereign-entrepreneur.webp',
    fullCardImagePath: '/archetypes/sovereign-entrepreneur.webp',
    cardColor: '#8B5CF6',
    exemplars: [
      { name: 'Elon Musk', role: 'CEO of Tesla, SpaceX & Tech Sovereign', wikipediaUrl: 'https://en.wikipedia.org/wiki/Elon_Musk' },
      { name: 'Peter Thiel', role: 'Founders Fund, Palantir & Tech Pioneer', wikipediaUrl: 'https://en.wikipedia.org/wiki/Peter_Thiel' },
      { name: 'Nayib Bukele', role: 'President of El Salvador & Bitcoin State Pioneer', wikipediaUrl: 'https://en.wikipedia.org/wiki/Nayib_Bukele' },
      { name: 'Balaji Srinivasan', role: 'Author of The Network State & Investor', wikipediaUrl: 'https://en.wikipedia.org/wiki/Balaji_Srinivasan' },
      { name: 'Palmer Luckey', role: 'Oculus Founder & Defense Tech Pioneer', wikipediaUrl: 'https://en.wikipedia.org/wiki/Palmer_Luckey' },
    ],
  },
  {
    id: 'order-liberal',
    code: 'OL',
    title: 'The Order Liberal',
    personaName: 'Marcus',
    prototype: { M: 70, A: 30, I: 70, G: 60, E: 35, T: 50 },
    description: 'You lean toward markets and established institutions, with firmer limits on individual disruption.',
    cardImagePath: '/archetypes/thumbs/order-liberal.webp',
    thumbnailImagePath: '/archetypes/thumbs/order-liberal.webp',
    fullCardImagePath: '/archetypes/order-liberal.webp',
    cardColor: '#2563EB',
    exemplars: [
      { name: 'Angela Merkel', role: 'Former Chancellor of Germany & Crisis Manager', wikipediaUrl: 'https://en.wikipedia.org/wiki/Angela_Merkel' },
      { name: 'Mario Draghi', role: 'Former ECB President & Italian Prime Minister', wikipediaUrl: 'https://en.wikipedia.org/wiki/Mario_Draghi' },
      { name: 'Janet Yellen', role: 'U.S. Treasury Secretary & Former Fed Chair', wikipediaUrl: 'https://en.wikipedia.org/wiki/Janet_Yellen' },
      { name: 'Mitt Romney', role: 'Former U.S. Senator & Rule-of-Law Moderate', wikipediaUrl: 'https://en.wikipedia.org/wiki/Mitt_Romney' },
      { name: 'Mark Carney', role: 'Former Governor of the Bank of England', wikipediaUrl: 'https://en.wikipedia.org/wiki/Mark_Carney' },
    ],
  },
  {
    id: 'techno-populist',
    code: 'TP',
    title: 'The Techno-Populist',
    personaName: 'Milo',
    prototype: { M: 50, A: 45, I: 25, G: 35, E: 65, T: 75 },
    description: 'You want new tools and a wider share of the rewards, without waiting for the establishment.',
    cardImagePath: '/archetypes/thumbs/techno-populist.webp',
    thumbnailImagePath: '/archetypes/thumbs/techno-populist.webp',
    fullCardImagePath: '/archetypes/techno-populist.webp',
    cardColor: '#06B6D4',
    exemplars: [
      { name: 'Andrew Yang', role: 'Forward Party Founder & UBI Pioneer', wikipediaUrl: 'https://en.wikipedia.org/wiki/Andrew_Yang' },
      { name: 'Edward Snowden', role: 'Whistleblower & Digital Privacy Advocate', wikipediaUrl: 'https://en.wikipedia.org/wiki/Edward_Snowden' },
      { name: 'Aaron Swartz', role: 'Reddit Co-Founder & Open Access Civic Hacker', wikipediaUrl: 'https://en.wikipedia.org/wiki/Aaron_Swartz' },
      { name: 'Audrey Tang', role: 'Digital Minister & Open Democracy Pioneer', wikipediaUrl: 'https://en.wikipedia.org/wiki/Audrey_Tang' },
      { name: 'Jimmy Wales', role: 'Wikipedia Founder & Public Knowledge Pioneer', wikipediaUrl: 'https://en.wikipedia.org/wiki/Jimmy_Wales' },
    ],
  },
  {
    id: 'independent-humanist',
    code: 'IH',
    title: 'The Independent Humanist',
    personaName: 'Jules',
    prototype: { M: 45, A: 75, I: 30, G: 75, E: 65, T: 30 },
    description: 'You favour personal freedom and wider solidarity, while questioning both authority and rapid technological change.',
    cardImagePath: '/archetypes/thumbs/independent-humanist.webp',
    thumbnailImagePath: '/archetypes/thumbs/independent-humanist.webp',
    fullCardImagePath: '/archetypes/independent-humanist.webp',
    cardColor: '#DB2777',
    exemplars: [
      { name: 'Jon Stewart', role: 'Political Satirist & Civil Liberties Voice', wikipediaUrl: 'https://en.wikipedia.org/wiki/Jon_Stewart' },
      { name: 'Joe Rogan', role: 'Podcaster & Independent Commentator', wikipediaUrl: 'https://en.wikipedia.org/wiki/Joe_Rogan' },
      { name: 'Albert Camus', role: 'Nobel Laureate & Humanist Philosopher', wikipediaUrl: 'https://en.wikipedia.org/wiki/Albert_Camus' },
      { name: 'George Carlin', role: 'Countercultural Comedian & Free Thinker', wikipediaUrl: 'https://en.wikipedia.org/wiki/George_Carlin' },
      { name: 'Christopher Hitchens', role: 'Author, Polemicist & Free Speech Defender', wikipediaUrl: 'https://en.wikipedia.org/wiki/Christopher_Hitchens' },
    ],
  },
];

export const UNFINISHED_PORTRAIT: Archetype = {
  id: 'unfinished-portrait',
  code: 'UP',
  title: 'The Unfinished Portrait',
  personaName: 'Seeker',
  prototype: { M: 50, A: 50, I: 50, G: 50, E: 50, T: 50 },
  description: 'A few choices are still missing. You can share this sketch or sharpen the read.',
  cardImagePath: '/archetypes/thumbs/card-back.webp',
  thumbnailImagePath: '/archetypes/thumbs/card-back.webp',
  fullCardImagePath: '/archetypes/card-back.webp',
  cardColor: '#64748B',
  exemplars: [
    { name: 'Bertrand Russell', role: 'Philosopher & Free Inquiry Advocate', wikipediaUrl: 'https://en.wikipedia.org/wiki/Bertrand_Russell' },
    { name: 'Carl Sagan', role: 'Astronomer & Science Communicator', wikipediaUrl: 'https://en.wikipedia.org/wiki/Carl_Sagan' },
    { name: 'Hannah Arendt', role: 'Political Theorist on Civic Liberty', wikipediaUrl: 'https://en.wikipedia.org/wiki/Hannah_Arendt' },
    { name: 'John Stuart Mill', role: 'Philosopher on Liberty & Inquiry', wikipediaUrl: 'https://en.wikipedia.org/wiki/John_Stuart_Mill' },
    { name: 'Richard Feynman', role: 'Physicist & Inquisitive Explorer', wikipediaUrl: 'https://en.wikipedia.org/wiki/Richard_Feynman' },
  ],
};

export const MIXED_SIGNAL: Archetype = {
  id: 'mixed-signal',
  code: 'MX',
  title: 'The Mixed Signal',
  personaName: 'Julian',
  prototype: { M: 50, A: 50, I: 50, G: 50, E: 50, T: 50 },
  description: 'Your choices cross standard categories. Your profile card carries the full dimensional detail.',
  cardImagePath: '/archetypes/thumbs/independent-humanist.webp',
  thumbnailImagePath: '/archetypes/thumbs/independent-humanist.webp',
  fullCardImagePath: '/archetypes/independent-humanist.webp',
  cardColor: '#8B5CF6',
  exemplars: [
    { name: 'Lex Fridman', role: 'AI Researcher & Podcaster', wikipediaUrl: 'https://en.wikipedia.org/wiki/Lex_Fridman' },
    { name: 'Jon Stewart', role: 'Independent Satirist & Civil Rights Advocate', wikipediaUrl: 'https://en.wikipedia.org/wiki/Jon_Stewart' },
    { name: 'Bill Gates', role: 'Technologist & Global Health Philanthropist', wikipediaUrl: 'https://en.wikipedia.org/wiki/Bill_Gates' },
    { name: 'Arnold Schwarzenegger', role: 'Former Governor & Pragmatic Centrist', wikipediaUrl: 'https://en.wikipedia.org/wiki/Arnold_Schwarzenegger' },
    { name: 'Andrew Yang', role: 'Forward Party Founder & Independent Reformer', wikipediaUrl: 'https://en.wikipedia.org/wiki/Andrew_Yang' },
  ],
};

export interface ArchetypeResult {
  archetype: Archetype;
  distance: number | null;
  runnerUpTitle: string | null;
  isComplete: boolean;
  isFallback: boolean;
}

export function computeArchetypeDistance(
  scores: Scores,
  prototype: Record<Dimension, number>
): number {
  let sumSquaredDiff = 0;
  for (const d of DIMENSIONS) {
    const s = scores[d] ?? 50;
    const diff = (s - prototype[d]) / 100;
    sumSquaredDiff += diff * diff;
  }
  return Math.sqrt(sumSquaredDiff / 6);
}

export function assignArchetype(scores: Scores, coverage: Coverage): ArchetypeResult {
  const isComplete = DIMENSIONS.every(d => coverage[d] >= 2 && scores[d] !== null);

  if (!isComplete) {
    return {
      archetype: UNFINISHED_PORTRAIT,
      distance: null,
      runnerUpTitle: null,
      isComplete: false,
      isFallback: true,
    };
  }

  // Check if all scores are within 5 points of 50 (i.e. 45 <= S <= 55)
  const allWithin5Of50 = DIMENSIONS.every(d => {
    const s = scores[d]!;
    return Math.abs(s - 50) <= 5;
  });

  if (allWithin5Of50) {
    return {
      archetype: MIXED_SIGNAL,
      distance: null,
      runnerUpTitle: null,
      isComplete: true,
      isFallback: true,
    };
  }

  // Calculate distance to all prototypes
  const scoredArchetypes = ARCHETYPES.map(arch => {
    return {
      archetype: arch,
      distance: computeArchetypeDistance(scores, arch.prototype),
    };
  });

  // Sort by distance ascending, tie-break by stable archetype ID
  scoredArchetypes.sort((a, b) => {
    if (Math.abs(a.distance - b.distance) > 1e-6) {
      return a.distance - b.distance;
    }
    return a.archetype.id.localeCompare(b.archetype.id);
  });

  const best = scoredArchetypes[0];
  const secondBest = scoredArchetypes[1];

  if (best.distance > 0.18) {
    return {
      archetype: {
        ...MIXED_SIGNAL,
        cardImagePath: best.archetype.thumbnailImagePath || best.archetype.cardImagePath || '/archetypes/thumbs/independent-humanist.webp',
        thumbnailImagePath: best.archetype.thumbnailImagePath || '/archetypes/thumbs/independent-humanist.webp',
        fullCardImagePath: best.archetype.fullCardImagePath || '/archetypes/independent-humanist.webp',
        cardColor: best.archetype.cardColor || '#8B5CF6',
        personaName: best.archetype.personaName || 'Julian',
        exemplars: best.archetype.exemplars || MIXED_SIGNAL.exemplars,
      },
      distance: best.distance,
      runnerUpTitle: null,
      isComplete: true,
      isFallback: true,
    };
  }

  let runnerUpTitle: string | null = null;
  if (secondBest && (secondBest.distance - best.distance) <= 0.025) {
    runnerUpTitle = secondBest.archetype.title;
  }

  return {
    archetype: best.archetype,
    distance: best.distance,
    runnerUpTitle,
    isComplete: true,
    isFallback: false,
  };
}
