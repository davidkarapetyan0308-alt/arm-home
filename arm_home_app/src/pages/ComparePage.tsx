import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Language } from '../context/AppContext';
import type { Property } from '../data/properties';

const PAGE_TEXTS = {
  RU: {
    title: 'Сравнение недвижимости',
    subtitle: 'Анализ до 4-х объектов в один клик',
    emptyTitle: 'Сравнение объектов',
    emptyDesc: 'Добавьте хотя бы 2 объекта из каталога, чтобы запустить подробный ИИ-анализ и сравнение характеристик.',
    addMoreDesc: 'Добавьте еще один объект, чтобы начать полноценное сравнение.',
    backToFeed: 'Вернуться к поиску',
    limitWarning: 'Можно сравнить максимум 4 объекта',
    activeFilters: 'Параметры отображения',
    highlightDiff: 'Различия',
    highlightBest: 'Лучшие параметры',
    hideSame: 'Скрыть одинаковые',
    
    // Sections
    secHero: '1. Обзор объектов',
    secWinner: '2. Выбор ИИ-помощника',
    secSpecs: '3. Подробные спецификации',
    secAI: '4. ИИ-Аналитика рынка',
    secProsCons: '5. Плюсы и минусы',
    secFinance: '6. Финансовый анализ',
    secRec: '7. Рекомендация Arm Home AI',
    
    // Quick Winner Labels
    bestValue: 'Лучшая цена/м²',
    bestInvestment: 'Инвестиционный хит',
    bestLifestyle: 'Комфортная жизнь',
    valueWinnerDesc: 'Наименьшая стоимость квадратного метра',
    investWinnerDesc: 'Максимальная арендная доходность',
    lifestyleWinnerDesc: 'Лучший ремонт, парковка и метро в пешей доступности',
    winsText: 'Лучший выбор по параметрам!',
    
    // Table Columns
    specLabel: 'Характеристика',
    price: 'Цена объекта',
    pricePerSqm: 'Цена за м²',
    sqm: 'Площадь',
    rooms: 'Количество комнат',
    beds: 'Спальни',
    baths: 'Ванные комнаты',
    floor: 'Этаж',
    buildingType: 'Тип здания',
    renovation: 'Ремонт',
    parking: 'Парковка',
    metro: 'Метро / Доступность',
    balcony: 'Балкон',
    yearBuilt: 'Год постройки',
    
    // Financial charts
    rentalYield: 'Доходность аренды',
    potentialAppreciation: 'Рост стоимости',
    liquidity: 'Ликвидность',
    demandScore: 'Оценка спроса',
    low: 'Низкая',
    medium: 'Средняя',
    high: 'Высокая',
    
    // Buttons
    viewProperty: 'Подробнее',
    remove: 'Удалить',
    
    // AI labels
    aiRealtor: 'ИИ-Риелтор',
    aiVerdict: 'Окончательный вердикт ИИ',
    proTitle: 'Плюсы',
    conTitle: 'Минусы',
    yes: 'Есть',
    no: 'Нет',
  },
  EN: {
    title: 'Property Comparison',
    subtitle: 'Compare up to 4 properties side-by-side',
    emptyTitle: 'Compare Properties',
    emptyDesc: 'Add at least 2 properties from the catalog to launch deep AI analytics and side-by-side comparison.',
    addMoreDesc: 'Add another property to start a full comparison.',
    backToFeed: 'Back to Search',
    limitWarning: 'You can compare up to 4 properties',
    activeFilters: 'Comparison Filters',
    highlightDiff: 'Differences',
    highlightBest: 'Best Specs',
    hideSame: 'Hide Identical',
    
    secHero: '1. Overview',
    secWinner: '2. AI Smart Pick',
    secSpecs: '3. Detailed Specifications',
    secAI: '4. AI Market Insights',
    secProsCons: '5. Pros & Cons',
    secFinance: '6. Investment Analysis',
    secRec: '7. Arm Home AI Recommendation',
    
    bestValue: 'Best Value/sqm',
    bestInvestment: 'Investment Hit',
    bestLifestyle: 'Comfortable Living',
    valueWinnerDesc: 'Lowest cost per square meter',
    investWinnerDesc: 'Highest rental yield rate',
    lifestyleWinnerDesc: 'Premium renovation, parking, and walking distance to metro',
    winsText: 'Top pick by specifications!',
    
    specLabel: 'Specification',
    price: 'Price',
    pricePerSqm: 'Price per sqm',
    sqm: 'Area',
    rooms: 'Rooms',
    beds: 'Bedrooms',
    baths: 'Bathrooms',
    floor: 'Floor',
    buildingType: 'Building Type',
    renovation: 'Renovation',
    parking: 'Parking',
    metro: 'Metro / Transit',
    balcony: 'Balcony',
    yearBuilt: 'Year Built',
    
    rentalYield: 'Rental Yield',
    potentialAppreciation: 'Appreciation Potential',
    liquidity: 'Liquidity',
    demandScore: 'Demand Score',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    
    viewProperty: 'View Details',
    remove: 'Remove',
    
    aiRealtor: 'AI Realtor',
    aiVerdict: 'Final AI Verdict',
    proTitle: 'Pros',
    conTitle: 'Cons',
    yes: 'Yes',
    no: 'No',
  },
  AM: {
    title: 'Գույքի համեմատություն',
    subtitle: 'Մինչև 4 օբյեկտների համեմատություն մեկ հպումով',
    emptyTitle: 'Համեմատել օբյեկտները',
    emptyDesc: 'Ավելացրեք առնվազն 2 օբյեկտ կատալոգից՝ մանրամասն AI վերլուծություն և բնութագրերի համեմատություն սկսելու համար։',
    addMoreDesc: 'Ավելացրեք ևս մեկ օբյեկտ՝ լիարժեք համեմատություն սկսելու համար։',
    backToFeed: 'Վերադառնալ որոնմանը',
    limitWarning: 'Կարելի է համեմատել առավելագույնը 4 օբյեկտ',
    activeFilters: 'Համեմատության ֆիլտրեր',
    highlightDiff: 'Տարբերություններ',
    highlightBest: 'Լավագույն պարամետրեր',
    hideSame: 'Թաքցնել նույնը',
    
    secHero: '1. Օբյեկտների ակնարկ',
    secWinner: '2. AI Օգնականի ընտրություն',
    secSpecs: '3. Մանրամասն բնութագրեր',
    secAI: '4. AI շուկայի վերլուծություն',
    secProsCons: '5. Կողմ և դեմ կողմեր',
    secFinance: '6. Ֆինանսական վերլուծություն',
    secRec: '7. Arm Home AI-ի երաշխավորություն',
    
    bestValue: 'Լավագույն արժեք/քմ',
    bestInvestment: 'Ներդրումային հիթ',
    bestLifestyle: 'Հարմարավետ կյանք',
    valueWinnerDesc: 'Քառակուսի մետրի ամենացածր արժեքը',
    investWinnerDesc: 'Առավելագույն վարձակալության եկամտաբերություն',
    lifestyleWinnerDesc: 'Լավագույն վերանորոգում, ավտոկայանատեղի և մետրոյի մոտ լինելը',
    winsText: 'Լավագույն ընտրությունն ըստ պարամետրերի:',
    
    specLabel: 'Բնութագիր',
    price: 'Գին',
    pricePerSqm: 'Արժեքը 1 քմ-ի',
    sqm: 'Մակերես',
    rooms: 'Սենյակների քանակ',
    beds: 'Ննջասենյակներ',
    baths: 'Լոգարաններ',
    floor: 'Հարկ',
    buildingType: 'Շենքի տիպ',
    renovation: 'Վերանորոգում',
    parking: 'Ավտոկայանատեղի',
    metro: 'Մետրո / Հասանելիություն',
    balcony: 'Պատշգամբ',
    yearBuilt: 'Կառուցման տարեթիվ',
    
    rentalYield: 'Վարձակալության եկամտաբերություն',
    potentialAppreciation: 'Արժեքի աճի պոտենցիալ',
    liquidity: 'Իրացվելիություն',
    demandScore: 'Պահանջարկի գնահատական',
    low: 'Ցածր',
    medium: 'Միջին',
    high: 'Բարձր',
    
    viewProperty: 'Մանրամասն',
    remove: 'Ջնջել',
    
    aiRealtor: 'AI Ռիելթոր',
    aiVerdict: 'AI Վերջնական Վճիռ',
    proTitle: 'Առավելություններ',
    conTitle: 'Թերություններ',
    yes: 'Այո',
    no: 'Ոչ',
  }
};

export default function ComparePage() {
  const { compareIds, properties, toggleCompare, formatPrice, lang, savedIds, toggleSaved } = useApp();
  const navigate = useNavigate();

  // Active filter states
  const [highlightDifferences, setHighlightDifferences] = useState(true);
  const [highlightBestValue, setHighlightBestValue] = useState(true);
  const [hideSameSpecs, setHideSameSpecs] = useState(false);

  const t = PAGE_TEXTS[lang as Language] || PAGE_TEXTS.RU;
  const comparedProps = properties.filter(p => compareIds.has(p.id));

  // Specs definitions list
  const specList = [
    { id: 'price', label: t.price },
    { id: 'pricePerSqm', label: t.pricePerSqm },
    { id: 'sqm', label: t.sqm },
    { id: 'rooms', label: t.rooms },
    { id: 'beds', label: t.beds },
    { id: 'baths', label: t.baths },
    { id: 'floor', label: t.floor },
    { id: 'buildingType', label: t.buildingType },
    { id: 'renovation', label: t.renovation },
    { id: 'parking', label: t.parking },
    { id: 'metro', label: t.metro },
    { id: 'balcony', label: t.balcony },
    { id: 'yearBuilt', label: t.yearBuilt },
  ];

  // Helper: Retrieve raw comparable value
  const getRawSpecValue = (specId: string, p: Property) => {
    if (specId === 'price') return p.price;
    if (specId === 'pricePerSqm') return p.pricePerSqm;
    if (specId === 'sqm') return p.sqm;
    if (specId === 'rooms') return p.rooms || p.beds + 1;
    if (specId === 'beds') return p.beds;
    if (specId === 'baths') return p.baths;
    if (specId === 'floor') return p.floor / (p.totalFloors || 1);
    if (specId === 'buildingType') return p.buildingType || 'Монолит';
    if (specId === 'renovation') return p.renovationType || 'Евроремонт';
    if (specId === 'parking') return p.parking ? 1 : 0;
    if (specId === 'balcony') return p.balcony ? 1 : 0;
    if (specId === 'metro') {
      const m = p.metro;
      if (!m || m === 'Нет' || m === 'None') return 0;
      if (m.includes('5 мин. пешком')) return 8;
      if (m.includes('8 мин. пешком')) return 7;
      if (m.includes('10 мин. пешком')) return 6;
      if (m.includes('12 мин. пешком')) return 5;
      if (m.includes('15 мин. пешком')) return 4;
      if (m.includes('транспорте')) return 2;
      return 1;
    }
    if (specId === 'yearBuilt') return p.yearBuilt || 1990;
    return 0;
  };

  // Helper: Get formatted display value
  const getSpecDisplayValue = (specId: string, p: Property) => {
    if (specId === 'price') return formatPrice(p.price, p.listingType);
    if (specId === 'pricePerSqm') {
      const f = formatPrice(p.pricePerSqm);
      return lang === 'EN' ? `${f} / sqm` : lang === 'AM' ? `${f} / քմ` : `${f} / м²`;
    }
    if (specId === 'sqm') {
      return lang === 'EN' ? `${p.sqm} sqm` : lang === 'AM' ? `${p.sqm} քմ` : `${p.sqm} м²`;
    }
    if (specId === 'rooms') {
      const count = p.rooms || p.beds + 1;
      if (lang === 'EN') return count === 1 ? '1 room' : `${count} rooms`;
      if (lang === 'AM') return `${count} սենյակ`;
      return count === 1 ? '1 комната' : (count >= 2 && count <= 4) ? `${count} комнаты` : `${count} комнат`;
    }
    if (specId === 'beds') {
      const count = p.beds;
      if (lang === 'EN') return count === 1 ? '1 bed' : `${count} beds`;
      if (lang === 'AM') return `${count} ննջ.`;
      return count === 1 ? '1 спальня' : (count >= 2 && count <= 4) ? `${count} спальни` : `${count} спален`;
    }
    if (specId === 'baths') {
      const count = p.baths;
      if (lang === 'EN') return count === 1 ? '1 bath' : `${count} baths`;
      if (lang === 'AM') return `${count} լոգարան`;
      return count === 1 ? '1 ванная' : (count >= 2 && count <= 4) ? `${count} ванные` : `${count} ванных`;
    }
    if (specId === 'floor') {
      return lang === 'EN' ? `${p.floor} of ${p.totalFloors}` : `${p.floor}/${p.totalFloors}`;
    }
    if (specId === 'buildingType') {
      const val = p.buildingType || 'Монолит';
      if (lang === 'EN') {
        if (val === 'Монолит') return 'Monolith';
        if (val === 'Каменный') return 'Stone';
        if (val === 'Панельный') return 'Panel';
        if (val === 'Деревянный') return 'Wooden';
      }
      if (lang === 'AM') {
        if (val === 'Монолит') return 'Մոնոլիտ';
        if (val === 'Каменный') return 'Քարե';
        if (val === 'Панельный') return 'Պանելային';
        if (val === 'Деревянный') return 'Փայտե';
      }
      return val;
    }
    if (specId === 'renovation') {
      const val = p.renovationType || 'Евроремонт';
      if (lang === 'EN') {
        if (val === 'Дизайнерский') return 'Designer';
        if (val === 'Евроремонт') return 'Euro';
        if (val === 'Косметический') return 'Cosmetic';
        if (val === 'Без ремонта') return 'Unrenovated';
      }
      if (lang === 'AM') {
        if (val === 'Дизайнерский') return 'Դիզայներական';
        if (val === 'Евроремонт') return 'Եվրովերանորոգված';
        if (val === 'Косметический') return 'Կոսմետիկ';
        if (val === 'Без ремонта') return 'Առանց վերանորոգման';
      }
      return val;
    }
    if (specId === 'parking') return p.parking ? t.yes : t.no;
    if (specId === 'balcony') return p.balcony ? t.yes : t.no;
    if (specId === 'metro') {
      const val = p.metro || 'Нет';
      if (lang === 'EN') {
        if (val === 'Нет') return 'None';
        return val.replace('мин. пешком', 'min. walk').replace('мин. на транспорте', 'min. transit');
      }
      if (lang === 'AM') {
        if (val === 'Нет') return 'Չկա';
        return val.replace('мин. пешком', 'ր. ոտքով').replace('мин. на транспорте', 'ր. տրանսպորտով');
      }
      return val;
    }
    if (specId === 'yearBuilt') {
      return p.yearBuilt ? `${p.yearBuilt}` : '—';
    }
    return '—';
  };

  // Helper: Find absolute best value for the spec
  const getBestPropertyId = (specId: string, props: Property[]) => {
    if (props.length < 2) return null;
    
    // Lower is better: price, pricePerSqm
    if (specId === 'price' || specId === 'pricePerSqm') {
      const values = props.map(p => p[specId === 'price' ? 'price' : 'pricePerSqm']);
      const min = Math.min(...values);
      const matches = props.filter(p => p[specId === 'price' ? 'price' : 'pricePerSqm'] === min);
      return matches.length === 1 ? matches[0].id : null;
    }

    // Higher is better: sqm, rooms, beds, baths, yearBuilt
    if (specId === 'sqm' || specId === 'beds' || specId === 'baths' || specId === 'yearBuilt') {
      const values = props.map(p => p[specId as keyof Property] as number || 0);
      const max = Math.max(...values);
      const matches = props.filter(p => (p[specId as keyof Property] as number || 0) === max);
      return matches.length === 1 ? matches[0].id : null;
    }
    if (specId === 'rooms') {
      const values = props.map(p => p.rooms || p.beds + 1);
      const max = Math.max(...values);
      const matches = props.filter(p => (p.rooms || p.beds + 1) === max);
      return matches.length === 1 ? matches[0].id : null;
    }

    // Binary true is better: parking, balcony
    if (specId === 'parking' || specId === 'balcony') {
      const matches = props.filter(p => p[specId]);
      return matches.length === 1 ? matches[0].id : null;
    }

    // Order ranks for renovation
    if (specId === 'renovation') {
      const ranks: Record<string, number> = {
        'Дизайнерский': 4, 'Евроремонт': 3, 'Косметический': 2, 'Без ремонта': 1
      };
      const values = props.map(p => ranks[p.renovationType || 'Евроремонт'] || 2);
      const max = Math.max(...values);
      const matches = props.filter(p => (ranks[p.renovationType || 'Евроремонт'] || 2) === max);
      return matches.length === 1 ? matches[0].id : null;
    }

    // Order ranks for metro walkability
    if (specId === 'metro') {
      const getMetroRank = (m?: string) => {
        if (!m || m === 'Нет') return 0;
        if (m.includes('5 мин.')) return 5;
        if (m.includes('8 мин.')) return 4;
        if (m.includes('10 мин.')) return 3;
        if (m.includes('12 мин.')) return 2;
        if (m.includes('15 мин.')) return 1;
        return 0.5;
      };
      const values = props.map(p => getMetroRank(p.metro));
      const max = Math.max(...values);
      const matches = props.filter(p => getMetroRank(p.metro) === max);
      return matches.length === 1 && max > 0 ? matches[0].id : null;
    }

    return null;
  };

  // Helper: Check if values differ across properties
  const isDiffSpec = (specId: string, props: Property[]) => {
    if (props.length < 2) return false;
    const firstVal = getRawSpecValue(specId, props[0]);
    return !props.every(p => getRawSpecValue(specId, p) === firstVal);
  };

  // Helper: Calculate Winners for Section 2
  const getQuickWinner = (category: 'value' | 'investment' | 'lifestyle') => {
    if (comparedProps.length === 0) return null;
    if (category === 'value') {
      // Lowest price per sqm wins
      const min = Math.min(...comparedProps.map(p => p.pricePerSqm));
      return comparedProps.find(p => p.pricePerSqm === min) || comparedProps[0];
    }
    if (category === 'investment') {
      // Highest rental yield wins
      const max = Math.max(...comparedProps.map(p => p.rentalYield || 0));
      return comparedProps.find(p => (p.rentalYield || 0) === max) || comparedProps[0];
    }
    if (category === 'lifestyle') {
      // Highest demandScore or combination of parking, renovation
      const score = (p: Property) => {
        let pts = (p.demandScore || 50);
        if (p.parking) pts += 15;
        if (p.balcony) pts += 10;
        if (p.renovationType === 'Дизайнерский') pts += 20;
        if (p.renovationType === 'Евроремонт') pts += 15;
        if (p.metro && p.metro.includes('пешком')) pts += 15;
        return pts;
      };
      const scores = comparedProps.map(p => ({ p, s: score(p) }));
      const max = Math.max(...scores.map(s => s.s));
      return scores.find(s => s.s === max)?.p || comparedProps[0];
    }
    return comparedProps[0];
  };

  // Helper: AI Insights content
  const getAIInsight = (p: Property) => {
    const insights: Record<string, Record<Language, string>> = {
      '1': {
        RU: 'Премиальное расположение в самом центре Еревана. Отличный показатель доходности (7.8%) для Кентрона. Отличается высоким качеством монолита и дизайнерским ремонтом, что гарантирует стабильный спрос.',
        EN: 'Premium location in the heart of Yerevan. High rental yield (7.8%) for Kentron. Features outstanding monolith quality and designer renovation, ensuring steady demand.',
        AM: 'Պրեմիում դիրք Երևանի հենց կենտրոնում։ Գերազանց եկամտաբերություն (7.8%) Կենտրոնի համար։ Բնութագրվում է բարձրորակ մոնոլիտով և դիզայներական վերանորոգմամբ։'
      },
      '2': {
        RU: 'Редкая инвестиционная находка! Студия с окупаемостью 9.1% за счет низкой цены входа ($95k). Потрясающий вид на Арарат обеспечит постоянный интерес туристов, несмотря на возраст дома.',
        EN: 'A rare investment find! Studio with 9.1% yield due to low capital entry ($95k). Breathtaking views of Ararat guarantee tourist interest, despite the older structure.',
        AM: 'Հազվագյուտ ներդրումային գտածո։ Ստուդիա 9.1% եկամտաբերությամբ՝ ցածր մուտքի գնի շնորհիվ ($95k)։ Անհավանական տեսարան դեպի Արարատը կապահովի զբոսաշրջիկների հետաքրքրությունը։'
      },
      '3': {
        RU: 'Роскошный пентхаус с террасой 50 кв.м. Высокая цена покупки компенсируется премиальностью ЖК и «Умным домом», однако окупаемость (6.2%) ниже средней. Это стиль жизни.',
        EN: 'Luxurious penthouse with a 50 sqm terrace. High price is offset by the building class and smart home setups. Rental yield (6.2%) is below average. Pure lifestyle statement.',
        AM: 'Շքեղ պենտհաուս հսկայական տեռասայով։ Բարձր գնումը փոխհատուցվում է Պրեմիում դասով և խելացի տնով, սակայն եկամտաբերությունը (6.2%) ցածր է։ Կյանքի որակ է։'
      },
      '4': {
        RU: 'Сбалансированная семейная резиденция в тихом центре у Каскада. Высокая ликвидность за счет каменного дома и отличного расположения. Прекрасный вариант для долгосрочного владения.',
        EN: 'Balanced family residence in a quiet central street near Cascade. High market liquidity due to premium stone building. Excellent long-term wealth asset.',
        AM: 'Հավասարակշռված ընտանեկան բնակարան Կասկադի մոտակայքում։ Բարձր իրացվելիություն քարե շենքի և գերազանց դիրքի շնորհիվ։'
      },
      '5': {
        RU: 'Бюджетный вариант с низкой ценой за метр. Требует ремонта. Отличная заготовка под флиппинг или аренду эконом-класса, но ликвидность ограничена районом.',
        EN: 'Budget option with lowest price per sqm. Requires full cosmetic updates. Ideal entry for flipping or budget rental, though local demand is medium.',
        AM: 'Բյուջետային տարբերակ՝ ցածր քառակուսի մետրի արժեքով։ Պահանջում է վերանորոգում։ Լավ հումք է վերավաճառքի կամ էկոնոմ դասի վարձակալության համար։'
      },
      '6': {
        RU: 'Отличная доходность аренды (8.5%) для спального района. Качественный монолит 2012 года. Идеальный пассивный доход при небольшом бюджете покупки.',
        EN: 'Solid rental yield (8.5%) for a family suburb. Decent monolith build from 2012. Perfect source of passive income at a very accessible price point.',
        AM: 'Գերազանց վարձակալության եկամտաբերություն (8.5%) արվարձանային թաղամասի համար։ 2012թ. մոնոլիտ շենք։ Լավ տարբերակ պասիվ եկամտի համար։'
      },
      '7': {
        RU: 'Высококлассный арендный лот в центре Еревана с быстрой пешей доступностью к метро (3 мин). Отличный вариант для быстрого заселения, хотя стоимость аренды $800 средняя по рынку.',
        EN: 'High-class rental property in Kentron, 3 minutes walk to metro. Fully equipped, perfect for instant rent, although the $800 price tag is exactly at market level.',
        AM: 'Բարձրակարգ վարձակալության լոտ Երևանի կենտրոնում՝ մետրոյից 3 րոպե հեռավորության վրա։ Գերազանց տարբերակ արագ բնակեցման համար։'
      },
      '8': {
        RU: 'Максимальная доходность посуточной аренды (12.0%) в самом сердце города. Окупаемость отличная благодаря близости к Опере, полностью готовый готовый бизнес.',
        EN: 'Highest yield of daily rentals (12.0%) in the heart of Yerevan. Fantastic ROI due to closeness to Opera House. Turnkey investment option.',
        AM: 'Օրավարձով տրվող բնակարանի առավելագույն եկամտաբերություն (12.0%) քաղաքի սրտում։ Գերազանց հետգնում Օպերային մոտ լինելու շնորհիվ։'
      },
      '9': {
        RU: 'Традиционный каменный дом в Гюмри с собственным двором. Исторический колорит и камин создают уют, но ликвидность объекта ограничена локацией.',
        EN: 'Classic stone residence in Gyumri with a private yard. Incredible historical authenticity and cosy fireplace, though market liquidity is lower.',
        AM: 'Ավանդական քարե տուն Գյումրիում՝ սեփական բակով։ Պատմական կոլորիտը և բուխարին ստեղծում են հարմարավետություն, բայց իրացվելիությունը սահմանափակ է։'
      },
      '10': {
        RU: 'Деревянный коттедж в лесу Дилижана — идеальная инвестиция под эко-туризм. Высокая доходность от посуточной аренды (9.5%) за счет круглогодичного спроса на отдых.',
        EN: 'Wooden chalet in Dilijan woods — exceptional eco-retreat investment. High occupancy rates generate solid 9.5% yield due to active tourism year-round.',
        AM: 'Փայտե քոթեջ Դիլիջանի անտառում՝ իդեալական ներդրում էկո-տուրիզմի համար։ Բարձր եկամտաբերություն օրավարձից (9.5%)։'
      },
      '11': {
        RU: 'Апартаменты у подъемника в Цахкадзоре. Превосходный зимний трафик и высокий спрос на лыжный сезон. Окупаемость 10.2% делает объект выгодным для сдачи.',
        EN: 'Ski-in apartment in Tsaghkadzor, 200m from lifts. Extreme ski season traffic ensures huge daily income. 10.2% yield is extremely competitive.',
        AM: 'Բնակարան Ծաղկաձորի ճոպանուղու հարևանությամբ։ Գերազանց ձմեռային տրաֆիկ և բարձր պահանջարկ դահուկային սեզոնին։ 10.2% եկամտաբերություն։'
      }
    };

    const defaultInsight: Record<Language, string> = {
      RU: `Отличное сбалансированное предложение в районе ${p.district}. Площадь ${p.sqm} м², цена ${formatPrice(p.price)}. Потенциал ликвидности оценивается как стабильный.`,
      EN: `A stable balanced choice in the ${p.district} district. Features ${p.sqm} sqm for ${formatPrice(p.price)}. Market liquidity potential is steady.`,
      AM: `Հավասարակշռված տարբերակ ${p.district} թաղամասում։ Մակերեսը՝ ${p.sqm} քմ, արժեքը՝ ${formatPrice(p.price)}։ Իրացվելիությունը գնահատվում է կայուն։`
    };

    return insights[p.id]?.[lang as Language] || defaultInsight[lang as Language];
  };

  // Helper: Pros list
  const getPros = (p: Property) => {
    const pros = [];
    if (p.rentalYield && p.rentalYield >= 8.0) {
      pros.push(lang === 'EN' ? 'High rental yield' : lang === 'AM' ? 'Բարձր եկամտաբերություն' : 'Высокая арендная доходность');
    }
    if (p.pricePerSqm < 2200) {
      pros.push(lang === 'EN' ? 'Low price per sqm' : lang === 'AM' ? 'Ցածր քառակուսի մետրի գին' : 'Выгодная цена за м²');
    }
    if (p.newBuild) {
      pros.push(lang === 'EN' ? 'Modern new building' : lang === 'AM' ? 'Ժամանակակից նորակառույց' : 'Современный новый дом');
    }
    if (p.parking) {
      pros.push(lang === 'EN' ? 'Dedicated parking space' : lang === 'AM' ? 'Ավտոկայանատեղի' : 'Есть парковочное место');
    }
    if (p.balcony) {
      pros.push(lang === 'EN' ? 'Comfortable balcony' : lang === 'AM' ? 'Պատշգամբ' : 'Наличие балкона');
    }
    if (p.renovationType === 'Дизайнерский') {
      pros.push(lang === 'EN' ? 'Ultra premium designer finish' : lang === 'AM' ? 'Դիզայներական վերանորոգում' : 'Премиальный дизайнерский ремонт');
    }
    if (p.metro && p.metro.includes('пешком')) {
      pros.push(lang === 'EN' ? 'Very close to metro' : lang === 'AM' ? 'Մետրոյին շատ մոտ' : 'Пешая доступность к метро');
    }
    
    if (pros.length === 0) {
      pros.push(lang === 'EN' ? 'Good overall metrics' : lang === 'AM' ? 'Լավ ընդհանուր ցուցանիշներ' : 'Хорошие общие показатели');
      pros.push(lang === 'EN' ? 'Ready to move in' : lang === 'AM' ? 'Պատրաստ է բնակեցման' : 'Готов к заселению');
    }
    return pros.slice(0, 3);
  };

  // Helper: Cons list
  const getCons = (p: Property) => {
    const cons = [];
    if (p.aiTag === 'overpriced') {
      cons.push(lang === 'EN' ? 'Priced above market value' : lang === 'AM' ? 'Շուկայականից բարձր գին' : 'Стоимость выше рыночной');
    }
    if (!p.parking) {
      cons.push(lang === 'EN' ? 'No private parking' : lang === 'AM' ? 'Առանց ավտոկայանատեղիի' : 'Отсутствует парковка');
    }
    if (!p.balcony) {
      cons.push(lang === 'EN' ? 'No balcony access' : lang === 'AM' ? 'Առանց պատշգամբի' : 'Нет балкона');
    }
    if (p.yearBuilt && p.yearBuilt < 1990) {
      cons.push(lang === 'EN' ? 'Older soviet era construction' : lang === 'AM' ? 'Խորհրդային շենքի կառուցվածք' : 'Дом советской постройки');
    }
    if (p.rentalYield && p.rentalYield < 6.5) {
      cons.push(lang === 'EN' ? 'Lower rental yield potential' : lang === 'AM' ? 'Ցածր վարձակալության պոտենցիալ' : 'Невысокая окупаемость');
    }
    if (p.metro === 'Нет') {
      cons.push(lang === 'EN' ? 'Far from metro networks' : lang === 'AM' ? 'Հեռու մետրոյից' : 'Удаленность от метро');
    }

    if (cons.length === 0) {
      cons.push(lang === 'EN' ? 'Premium pricing tier' : lang === 'AM' ? 'Բարձր գնային սեգմենտ' : 'Высокий ценовой порог');
    }
    return cons.slice(0, 2);
  };

  // Helper: Overall recommender logic
  const getOverallWinner = () => {
    if (comparedProps.length === 0) return null;
    const score = (p: Property) => {
      let pts = (p.demandScore || 70) * 1.3;
      pts += (p.rentalYield || 6) * 6;
      if (p.parking) pts += 15;
      if (p.balcony) pts += 10;
      if (p.renovationType === 'Дизайнерский') pts += 20;
      if (p.renovationType === 'Евроремонт') pts += 12;
      if (p.metro && p.metro.includes('пешком')) pts += 12;
      pts -= (p.pricePerSqm / 150); // penalize extreme pricing
      return pts;
    };
    const scored = comparedProps.map(p => ({ p, s: score(p) }));
    const max = Math.max(...scored.map(s => s.s));
    return scored.find(s => s.s === max)?.p || comparedProps[0];
  };

  const overallWinner = getOverallWinner();

  // Helper: Dynamic Badge Renderer
  const renderAiBadges = (p: Property) => {
    const badges = [];
    if (p.aiTag === 'good_deal') {
      badges.push({ text: '🔥 Great Deal', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' });
    }
    if (p.rentalYield && p.rentalYield >= 7.8) {
      badges.push({ text: '💰 Strong Investment', class: 'bg-amber-50 text-amber-700 border-amber-200' });
    }
    if (p.beds && p.beds >= 3) {
      badges.push({ text: '🏡 Family Friendly', class: 'bg-blue-50 text-blue-700 border-blue-200' });
    }
    if (p.metro && (p.metro.includes('5 мин') || p.metro.includes('8 мин'))) {
      badges.push({ text: '🚇 Near Metro', class: 'bg-purple-50 text-purple-700 border-purple-200' });
    }
    if (p.aiTag === 'overpriced') {
      badges.push({ text: '⚠️ Overpriced', class: 'bg-rose-50 text-rose-700 border-rose-200' });
    }

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {badges.map((b, i) => (
          <span key={i} className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border leading-tight ${b.class}`}>
            {b.text}
          </span>
        ))}
      </div>
    );
  };

  // Helper: Value conversions for financial chart colors
  const getBarColor = (field: string, val: number) => {
    if (field === 'yield') {
      if (val >= 8.5) return 'bg-emerald-500';
      if (val >= 6.8) return 'bg-amber-500';
      return 'bg-rose-500';
    }
    if (field === 'appreciation') {
      if (val >= 12.0) return 'bg-emerald-500';
      if (val >= 9.0) return 'bg-amber-500';
      return 'bg-rose-500';
    }
    if (field === 'demand') {
      if (val >= 88) return 'bg-emerald-500';
      if (val >= 75) return 'bg-amber-500';
      return 'bg-rose-500';
    }
    return 'bg-tuff-terracotta';
  };

  // Render: Empty State
  if (comparedProps.length < 2) {
    return (
      <div className="min-h-full bg-surface flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6 shadow-sm">
          <span className="material-symbols-outlined text-4xl text-outline-variant">compare</span>
        </div>
        <h1 className="text-xl font-black text-primary mb-2">
          {t.emptyTitle}
        </h1>
        <p className="text-xs text-outline mb-8 max-w-[280px] leading-relaxed">
          {comparedProps.length === 1 ? t.addMoreDesc : t.emptyDesc}
        </p>

        {comparedProps.length === 1 && (
          <div className="mb-8 w-full max-w-xs bg-white p-3.5 rounded-2xl border border-outline-variant/30 flex items-center gap-3 shadow-card">
            <img src={comparedProps[0].images[0]} alt="" className="w-12 h-12 rounded-xl object-cover border border-outline-variant/10" />
            <div className="text-left flex-1 truncate">
              <div className="text-sm font-black text-primary truncate">
                {formatPrice(comparedProps[0].price, comparedProps[0].listingType)}
              </div>
              <div className="text-[10px] text-outline truncate font-semibold">
                {comparedProps[0].district}, {comparedProps[0].title}
              </div>
            </div>
            <button 
              onClick={() => toggleCompare(comparedProps[0].id)} 
              className="text-outline hover:text-error w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        <button
          onClick={() => navigate('/feed')}
          className="bg-tuff-terracotta text-white font-black py-3.5 px-8 rounded-2xl shadow-float hover:bg-tuff-terracotta/90 transition-all active:scale-95 flex items-center gap-2 text-xs uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-base">search</span>
          {t.backToFeed}
        </button>
      </div>
    );
  }

  // Filter out columns if same specs toggle is active
  const filteredSpecs = specList.filter(spec => {
    if (!hideSameSpecs) return true;
    return isDiffSpec(spec.id, comparedProps);
  });

  return (
    <div className="min-h-full bg-surface pb-12 animate-fade-in no-scrollbar">
      
      {/* Premium Glassmorphic Header */}
      <div className="sticky top-0 z-30 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-tuff-terracotta/10 flex items-center justify-center text-tuff-terracotta">
            <span className="material-symbols-outlined text-lg font-bold">compare_arrows</span>
          </div>
          <div>
            <h1 className="text-sm font-black text-primary leading-tight">{t.title}</h1>
            <p className="text-[9px] text-outline font-bold uppercase tracking-wider">
              {comparedProps.length} {lang === 'EN' ? 'properties' : lang === 'AM' ? 'օբյեկտ' : 'объекта'}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-on-surface-variant hover:text-primary transition-colors w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      {/* Pill Filters Panel */}
      <div className="px-4 py-3 bg-surface-container-lowest border-b border-outline-variant/20 flex flex-col gap-2">
        <span className="text-[9px] font-black text-outline uppercase tracking-widest">{t.activeFilters}</span>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
          
          {/* Highlight Diff Toggle */}
          <button
            onClick={() => setHighlightDifferences(!highlightDifferences)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-extrabold transition-all border active:scale-95 ${
              highlightDifferences 
                ? 'bg-tuff-terracotta text-white border-tuff-terracotta shadow-sm'
                : 'bg-white text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-xs">difference</span>
            {t.highlightDiff}
          </button>

          {/* Highlight Best Toggle */}
          <button
            onClick={() => setHighlightBestValue(!highlightBestValue)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-extrabold transition-all border active:scale-95 ${
              highlightBestValue 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-xs">workspace_premium</span>
            {t.highlightBest}
          </button>

          {/* Hide Identical Toggle */}
          <button
            onClick={() => setHideSameSpecs(!hideSameSpecs)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-extrabold transition-all border active:scale-95 ${
              hideSameSpecs 
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-xs">visibility_off</span>
            {t.hideSame}
          </button>

        </div>
      </div>

      {/* Main comparative containers */}
      <div className="px-4 py-5 flex flex-col gap-6 max-w-lg mx-auto">

        {/* ================= SECTION 1: HERO COMPARISON ================= */}
        <section className="bg-white rounded-2xl border border-outline-variant/20 p-3.5 shadow-card flex flex-col gap-3">
          <h2 className="text-[10px] font-black text-outline uppercase tracking-widest leading-none">
            {t.secHero}
          </h2>
          
          {/* Scrollable Hero row */}
          <div className="overflow-x-auto no-scrollbar w-full">
            <div className="flex min-w-max">
              {/* Sticky label column */}
              <div className="sticky left-0 bg-white/95 backdrop-blur-md z-10 w-[85px] pr-2 flex flex-col justify-end pb-4 border-r border-outline-variant/20">
                <span className="text-[9px] font-black text-outline uppercase tracking-wider">Объект</span>
              </div>

              {/* Property Hero Columns */}
              <div className="flex gap-4 pl-3">
                {comparedProps.map((p, index) => {
                  const isSaved = savedIds.has(p.id);
                  return (
                    <div key={p.id} className="w-[125px] flex-shrink-0 flex flex-col gap-2 relative">
                      
                      {/* Image Box */}
                      <div className="w-[125px] h-[105px] rounded-xl overflow-hidden relative border border-outline-variant/10 shadow-sm group">
                        <img 
                          src={p.images[0]} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        
                        {/* Remove Badge */}
                        <button
                          onClick={() => toggleCompare(p.id)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-error text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                          title={t.remove}
                        >
                          <span className="material-symbols-outlined text-xs font-bold">close</span>
                        </button>

                        {/* Favorite button */}
                        <button
                          onClick={() => toggleSaved(p.id)}
                          className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white/80 text-on-surface-variant flex items-center justify-center shadow-sm backdrop-blur-sm active:scale-95 transition-all"
                        >
                          <span className={`material-symbols-outlined text-xs font-bold leading-none ${
                            isSaved ? 'text-error font-fill' : 'text-outline hover:text-error'
                          }`}>
                            favorite
                          </span>
                        </button>

                        {/* Order circle index */}
                        <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                      </div>

                      {/* Summary Data */}
                      <div className="flex flex-col gap-0.5 min-h-[55px]">
                        <span className="text-xs font-black text-primary truncate leading-tight">
                          {formatPrice(p.price, p.listingType)}
                        </span>
                        <span className="text-[9px] font-bold text-outline truncate">
                          {p.district}, {p.city}
                        </span>
                        
                        {/* Dynamic Badges */}
                        {renderAiBadges(p)}
                      </div>

                      {/* Details Link button */}
                      <button
                        onClick={() => navigate(`/property/${p.id}`)}
                        className="w-full bg-surface-container-low hover:bg-surface-container-high text-primary font-black text-[9px] py-1.5 rounded-lg border border-outline-variant/20 uppercase tracking-wider transition-colors"
                      >
                        {t.viewProperty}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>


        {/* ================= SECTION 2: QUICK WINNER ================= */}
        <section className="bg-white rounded-2xl border border-outline-variant/20 p-3.5 shadow-card flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-2">
            <span className="material-symbols-outlined text-tuff-terracotta text-lg font-bold">auto_awesome</span>
            <h2 className="text-[10px] font-black text-outline uppercase tracking-widest leading-none">
              {t.secWinner}
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {/* Best Value Winner */}
            {(() => {
              const w = getQuickWinner('value');
              if (!w) return null;
              return (
                <div className="flex items-center gap-3 bg-emerald-500/[0.04] border border-emerald-500/20 p-2.5 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <span className="material-symbols-outlined font-bold text-base">payments</span>
                  </div>
                  <div className="flex-1 truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-emerald-800">{t.bestValue}</span>
                      <span className="text-[8px] font-extrabold bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded leading-none">🏆 Winner</span>
                    </div>
                    <p className="text-[9px] text-outline font-semibold truncate mt-0.5">{w.district} · {w.title}</p>
                    <p className="text-[8px] font-black text-emerald-600 uppercase mt-0.5">
                      {formatPrice(w.pricePerSqm)}/м² — {t.valueWinnerDesc}
                    </p>
                  </div>
                  <img src={w.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-emerald-500/15" />
                </div>
              );
            })()}

            {/* Best Investment Winner */}
            {(() => {
              const w = getQuickWinner('investment');
              if (!w) return null;
              return (
                <div className="flex items-center gap-3 bg-amber-500/[0.04] border border-amber-500/20 p-2.5 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
                    <span className="material-symbols-outlined font-bold text-base">trending_up</span>
                  </div>
                  <div className="flex-1 truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-amber-800">{t.bestInvestment}</span>
                      <span className="text-[8px] font-extrabold bg-amber-100 text-amber-800 px-1 py-0.5 rounded leading-none">🏆 Winner</span>
                    </div>
                    <p className="text-[9px] text-outline font-semibold truncate mt-0.5">{w.district} · {w.title}</p>
                    <p className="text-[8px] font-black text-amber-600 uppercase mt-0.5">
                      Yield {w.rentalYield}% — {t.investWinnerDesc}
                    </p>
                  </div>
                  <img src={w.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-amber-500/15" />
                </div>
              );
            })()}

            {/* Best Lifestyle Winner */}
            {(() => {
              const w = getQuickWinner('lifestyle');
              if (!w) return null;
              return (
                <div className="flex items-center gap-3 bg-blue-500/[0.04] border border-blue-500/20 p-2.5 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <span className="material-symbols-outlined font-bold text-base">spa</span>
                  </div>
                  <div className="flex-1 truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-blue-800">{t.bestLifestyle}</span>
                      <span className="text-[8px] font-extrabold bg-blue-100 text-blue-800 px-1 py-0.5 rounded leading-none">🏆 Winner</span>
                    </div>
                    <p className="text-[9px] text-outline font-semibold truncate mt-0.5">{w.district} · {w.title}</p>
                    <p className="text-[8px] font-black text-blue-600 uppercase mt-0.5">
                      Score: {w.demandScore} — {t.lifestyleWinnerDesc}
                    </p>
                  </div>
                  <img src={w.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-blue-500/15" />
                </div>
              );
            })()}
          </div>
        </section>


        {/* ================= SECTION 3: SPECIFICATIONS TABLE ================= */}
        <section className="bg-white rounded-2xl border border-outline-variant/20 p-3.5 shadow-card flex flex-col gap-3">
          <h2 className="text-[10px] font-black text-outline uppercase tracking-widest leading-none">
            {t.secSpecs}
          </h2>

          {/* Sticky left table scroll wrapper */}
          <div className="overflow-x-auto no-scrollbar w-full border border-outline-variant/20 rounded-2xl">
            <div className="min-w-max flex flex-col">
              
              {/* Row loops */}
              {filteredSpecs.map((spec) => {
                const isDiff = isDiffSpec(spec.id, comparedProps);
                const bestId = getBestPropertyId(spec.id, comparedProps);
                
                // Styles based on states
                const rowBg = isDiff && highlightDifferences ? 'bg-amber-500/[0.04]' : 'bg-transparent';
                
                return (
                  <div 
                    key={spec.id} 
                    className={`flex border-b border-outline-variant/15 py-3 items-center group transition-colors hover:bg-surface-container-low/30 ${rowBg}`}
                  >
                    {/* Sticky Label */}
                    <div 
                      className={`sticky left-0 z-10 w-[95px] pl-3 pr-2 text-[10px] font-bold text-outline border-r border-outline-variant/20 flex-shrink-0 ${
                        isDiff && highlightDifferences ? 'bg-amber-50/95' : 'bg-white/95'
                      } backdrop-blur-md`}
                    >
                      {spec.label}
                    </div>

                    {/* Columns mapping for properties */}
                    <div className="flex gap-4 pl-3">
                      {comparedProps.map((p) => {
                        const isBest = bestId === p.id && highlightBestValue;
                        const cellColor = isBest 
                          ? 'bg-emerald-500/10 text-emerald-800 border-l border-emerald-500 font-extrabold px-1 rounded-sm'
                          : isDiff && highlightDifferences 
                            ? 'text-primary font-bold'
                            : 'text-on-surface-variant font-semibold';
                        
                        return (
                          <div 
                            key={p.id} 
                            className={`w-[125px] px-1 text-center text-xs flex-shrink-0 leading-normal ${cellColor}`}
                          >
                            {getSpecDisplayValue(spec.id, p)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </section>


        {/* ================= SECTION 4: AI INSIGHTS ================= */}
        <section className="bg-white rounded-2xl border border-outline-variant/20 p-3.5 shadow-card flex flex-col gap-3">
          <h2 className="text-[10px] font-black text-outline uppercase tracking-widest leading-none">
            {t.secAI}
          </h2>

          <div className="flex flex-col gap-4">
            {comparedProps.map((p) => (
              <div key={p.id} className="flex gap-3 items-start border-b border-outline-variant/10 pb-3 last:border-b-0 last:pb-0">
                <img 
                  src={p.images[0]} 
                  alt="" 
                  className="w-11 h-11 rounded-lg object-cover border border-outline-variant/10 flex-shrink-0 mt-0.5" 
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-primary truncate max-w-[150px]">
                      {p.district} · {formatPrice(p.price)}
                    </span>
                    <span className="text-[8px] font-extrabold uppercase bg-tuff-terracotta/10 text-tuff-terracotta px-1.5 py-0.5 rounded">
                      {t.aiRealtor}
                    </span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-semibold leading-relaxed mt-1 italic">
                    «{getAIInsight(p)}»
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ================= SECTION 5: PROS & CONS ================= */}
        <section className="bg-white rounded-2xl border border-outline-variant/20 p-3.5 shadow-card flex flex-col gap-3">
          <h2 className="text-[10px] font-black text-outline uppercase tracking-widest leading-none">
            {t.secProsCons}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {comparedProps.map((p) => {
              const pros = getPros(p);
              const cons = getCons(p);
              return (
                <div key={p.id} className="bg-surface-container-low/40 rounded-xl p-3 border border-outline-variant/10">
                  <div className="flex items-center gap-2 mb-2 border-b border-outline-variant/10 pb-1.5">
                    <img src={p.images[0]} alt="" className="w-6 h-6 rounded-md object-cover border border-outline-variant/10" />
                    <span className="text-[10px] font-black text-primary truncate">{p.title}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Pros column */}
                    <div>
                      <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1 mb-1">
                        <span className="material-symbols-outlined text-[10px] font-bold">check_circle</span>
                        {t.proTitle}
                      </span>
                      <ul className="flex flex-col gap-1">
                        {pros.map((pro, idx) => (
                          <li key={idx} className="text-[9px] text-on-surface-variant font-semibold leading-tight list-disc list-inside">
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons column */}
                    <div>
                      <span className="text-[8px] font-black text-rose-700 uppercase tracking-widest flex items-center gap-1 mb-1">
                        <span className="material-symbols-outlined text-[10px] font-bold">cancel</span>
                        {t.conTitle}
                      </span>
                      <ul className="flex flex-col gap-1">
                        {cons.map((con, idx) => (
                          <li key={idx} className="text-[9px] text-on-surface-variant font-semibold leading-tight list-disc list-inside">
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        {/* ================= SECTION 6: INVESTMENT ANALYSIS ================= */}
        <section className="bg-white rounded-2xl border border-outline-variant/20 p-3.5 shadow-card flex flex-col gap-3">
          <h2 className="text-[10px] font-black text-outline uppercase tracking-widest leading-none">
            {t.secFinance}
          </h2>

          <div className="flex flex-col gap-4">
            
            {/* Rental Yield Chart */}
            <div className="flex flex-col gap-1.5 border-b border-outline-variant/10 pb-3.5">
              <span className="text-[9px] font-black text-primary uppercase tracking-wider">{t.rentalYield} (ROI %)</span>
              <div className="flex flex-col gap-2">
                {comparedProps.map((p) => {
                  const val = p.rentalYield || 5.0;
                  const color = getBarColor('yield', val);
                  return (
                    <div key={p.id} className="flex items-center gap-2">
                      <span className="text-[8px] font-bold text-outline w-[70px] truncate">{p.district}</span>
                      <div className="flex-1 h-3 bg-surface-container-high rounded-full overflow-hidden relative shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${color}`}
                          style={{ width: `${(val / 15) * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-black text-primary w-[32px] text-right">{val}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Potential Appreciation Chart */}
            <div className="flex flex-col gap-1.5 border-b border-outline-variant/10 pb-3.5">
              <span className="text-[9px] font-black text-primary uppercase tracking-wider">{t.potentialAppreciation} (% / год)</span>
              <div className="flex flex-col gap-2">
                {comparedProps.map((p) => {
                  const val = p.potentialAppreciation || 5.0;
                  const color = getBarColor('appreciation', val);
                  return (
                    <div key={p.id} className="flex items-center gap-2">
                      <span className="text-[8px] font-bold text-outline w-[70px] truncate">{p.district}</span>
                      <div className="flex-1 h-3 bg-surface-container-high rounded-full overflow-hidden relative shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${color}`}
                          style={{ width: `${(val / 22) * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-black text-primary w-[32px] text-right">{val}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Demand score / popularity */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-black text-primary uppercase tracking-wider">{t.demandScore} (1-100)</span>
              <div className="flex flex-col gap-2">
                {comparedProps.map((p) => {
                  const val = p.demandScore || 60;
                  const color = getBarColor('demand', val);
                  return (
                    <div key={p.id} className="flex items-center gap-2">
                      <span className="text-[8px] font-bold text-outline w-[70px] truncate">{p.district}</span>
                      <div className="flex-1 h-3 bg-surface-container-high rounded-full overflow-hidden relative shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${color}`}
                          style={{ width: `${val}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-black text-primary w-[32px] text-right">{val}/100</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>


        {/* ================= SECTION 7: FINAL RECOMMENDATION ================= */}
        {overallWinner && (
          <section className="bg-gradient-to-br from-amber-500/[0.08] via-amber-600/[0.04] to-amber-900/[0.08] border border-amber-500/40 rounded-2xl p-4 shadow-card flex flex-col gap-3 relative overflow-hidden">
            
            {/* Aesthetic sparkle absolute decorations */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-2 border-b border-amber-500/20 pb-2">
              <span className="material-symbols-outlined text-amber-600 text-xl font-bold animate-pulse">workspace_premium</span>
              <h2 className="text-[10px] font-black text-amber-900 uppercase tracking-widest leading-none">
                {t.secRec}
              </h2>
            </div>

            <div className="flex gap-3 items-center">
              <img 
                src={overallWinner.images[0]} 
                alt="" 
                className="w-16 h-16 rounded-xl object-cover border border-amber-500/30 flex-shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <span className="text-[8px] font-black text-amber-700 uppercase tracking-wider block">Рекомендованный выбор</span>
                <span className="text-xs font-black text-primary block truncate mt-0.5">
                  {overallWinner.title}
                </span>
                <span className="text-xs font-extrabold text-tuff-terracotta mt-0.5 block">
                  {formatPrice(overallWinner.price, overallWinner.listingType)} · {overallWinner.district}
                </span>
              </div>
            </div>

            {/* Structured Verdict text */}
            <div className="bg-white/80 rounded-xl p-3 border border-amber-500/10 text-[10px] text-on-surface-variant font-medium leading-relaxed">
              <span className="font-extrabold text-amber-950 block mb-1">{t.aiVerdict}:</span>
              {lang === 'EN' ? (
                <>
                  Based on a comprehensive review of all comparable parameters, we highly recommend <strong>{overallWinner.title}</strong> in the {overallWinner.district} district. It provides the most balanced option offering an exceptional{' '}
                  {overallWinner.rentalYield && overallWinner.rentalYield > 8.0 ? `rental yield rate of ${overallWinner.rentalYield}%` : `demand score of ${overallWinner.demandScore}/100`}{' '}
                  and high liquidity, making it the most resilient long-term holding.
                </>
              ) : lang === 'AM' ? (
                <>
                  Բոլոր համեմատելի պարամետրերի մանրակրկիտ վերլուծության հիման վրա, մենք խորհուրդ ենք տալիս ընտրել <strong>{overallWinner.title}</strong>-ը {overallWinner.district} թաղամասում։ Այն առաջարկում է լավագույն հարաբերակցությունը{' '}
                  {overallWinner.rentalYield && overallWinner.rentalYield > 8.0 ? `վարձակալության բարձր եկամտաբերության (${overallWinner.rentalYield}%)` : `բարձր պահանջարկի (${overallWinner.demandScore}/100)`}{' '}
                  և իրացվելիության, հանդիսանալով ամենահուսալի ներդրումը։
                </>
              ) : (
                <>
                  На основе комплексного сопоставления всех технических и инвестиционных характеристик, мы настоятельно рекомендуем остановиться на объекте <strong>{overallWinner.title}</strong> в районе {overallWinner.district}. Он обеспечивает наилучший баланс{' '}
                  {overallWinner.rentalYield && overallWinner.rentalYield > 8.0 ? `высокой арендной доходности (${overallWinner.rentalYield}%)` : `высокого спроса (${overallWinner.demandScore}/100)`}{' '}
                  и ликвидности, что делает его самым надежным и перспективным решением.
                </>
              )}
            </div>

          </section>
        )}

      </div>
    </div>
  );
}
