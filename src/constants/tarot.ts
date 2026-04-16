import type { TarotCard } from '../types';

export const MAJOR_ARCANA: TarotCard[] = [
  { id: 0,  nameRu: 'Шут',              nameEn: 'The Fool',           symbol: '🃏', keywords: 'новое начало, легкость, доверие' },
  { id: 1,  nameRu: 'Маг',              nameEn: 'The Magician',       symbol: '✨', keywords: 'воля, мастерство, действие' },
  { id: 2,  nameRu: 'Верховная Жрица',  nameEn: 'The High Priestess', symbol: '🌙', keywords: 'интуиция, тайна, внутренний голос' },
  { id: 3,  nameRu: 'Императрица',      nameEn: 'The Empress',        symbol: '🌿', keywords: 'изобилие, творчество, забота' },
  { id: 4,  nameRu: 'Император',        nameEn: 'The Emperor',        symbol: '⚡', keywords: 'власть, структура, защита' },
  { id: 5,  nameRu: 'Иерофант',         nameEn: 'The Hierophant',     symbol: '🔑', keywords: 'традиция, наставничество, вера' },
  { id: 6,  nameRu: 'Влюблённые',       nameEn: 'The Lovers',         symbol: '♾️', keywords: 'выбор, союз, ценности' },
  { id: 7,  nameRu: 'Колесница',        nameEn: 'The Chariot',        symbol: '🏹', keywords: 'движение, контроль, победа' },
  { id: 8,  nameRu: 'Сила',             nameEn: 'Strength',           symbol: '🦁', keywords: 'мужество, терпение, внутренняя сила' },
  { id: 9,  nameRu: 'Отшельник',        nameEn: 'The Hermit',         symbol: '🕯️', keywords: 'уединение, поиск, мудрость' },
  { id: 10, nameRu: 'Колесо Фортуны',   nameEn: 'Wheel of Fortune',   symbol: '☸️', keywords: 'циклы, перемены, судьба' },
  { id: 11, nameRu: 'Справедливость',   nameEn: 'Justice',            symbol: '⚖️', keywords: 'баланс, истина, последствия' },
  { id: 12, nameRu: 'Повешенный',       nameEn: 'The Hanged Man',     symbol: '🪢', keywords: 'пауза, новый взгляд, жертва' },
  { id: 13, nameRu: 'Смерть',           nameEn: 'Death',              symbol: '🌑', keywords: 'трансформация, конец, обновление' },
  { id: 14, nameRu: 'Умеренность',      nameEn: 'Temperance',         symbol: '🌊', keywords: 'баланс, поток, исцеление' },
  { id: 15, nameRu: 'Дьявол',           nameEn: 'The Devil',          symbol: '🔗', keywords: 'привязанность, страх, иллюзия ловушки' },
  { id: 16, nameRu: 'Башня',            nameEn: 'The Tower',          symbol: '⛈️', keywords: 'разрушение, откровение, освобождение' },
  { id: 17, nameRu: 'Звезда',           nameEn: 'The Star',           symbol: '⭐', keywords: 'надежда, восстановление, вдохновение' },
  { id: 18, nameRu: 'Луна',             nameEn: 'The Moon',           symbol: '🌕', keywords: 'подсознание, тревога, иллюзии' },
  { id: 19, nameRu: 'Солнце',           nameEn: 'The Sun',            symbol: '☀️', keywords: 'радость, ясность, успех' },
  { id: 20, nameRu: 'Суд',              nameEn: 'Judgement',          symbol: '🎺', keywords: 'призыв, пробуждение, прощение' },
  { id: 21, nameRu: 'Мир',              nameEn: 'The World',          symbol: '🌍', keywords: 'завершение, интеграция, целостность' },
];

export function getCardOfTheDay(): TarotCard {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % MAJOR_ARCANA.length;
  return MAJOR_ARCANA[index];
}

export function shuffleDeck(): TarotCard[] {
  const deck = [...MAJOR_ARCANA];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
