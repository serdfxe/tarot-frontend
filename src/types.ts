export type Screen =
  | 'landing'
  | 'question'
  | 'card-selection'
  | 'reading'
  | 'paywall'
  | 'card-of-the-day';

export interface TarotCard {
  id: number;
  nameRu: string;
  nameEn: string;
  symbol: string;
  keywords: string;
}

export interface SelectedCard extends TarotCard {
  reversed: boolean;
}

export interface ReadingRecord {
  id: string;
  date: string;
  question: string;
  cards: SelectedCard[];
  interpretation: string;
}
