import { useState, useMemo } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useDailyLimit } from '../hooks/useDailyLimit';
import { shuffleDeck } from '../constants/tarot';
import type { TarotCard, SelectedCard, Screen } from '../types';

interface Props {
  onNavigate: (screen: Screen) => void;
  onCardsSelected: (cards: SelectedCard[]) => void;
}

const DISPLAY_COUNT = 7;

export function CardSelectionScreen({ onNavigate, onCardsSelected }: Props) {
  const { reachGoal } = useAnalytics();
  const { hasReadingToday } = useDailyLimit();
  const deck = useMemo(() => shuffleDeck().slice(0, DISPLAY_COUNT), []);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<TarotCard[]>([]);
  const [limitReached, setLimitReached] = useState(false);

  const handleCardClick = (card: TarotCard, index: number) => {
    if (flipped.has(index) || selected.length >= 3) return;
    setFlipped(prev => new Set(prev).add(index));
    setSelected(prev => [...prev, card]);
  };

  const handleGetReading = () => {
    if (selected.length < 3) return;
    if (hasReadingToday()) {
      setLimitReached(true);
      return;
    }
    reachGoal('cards_selected');
    const result: SelectedCard[] = selected.map(c => ({ ...c, reversed: Math.random() < 0.25 }));
    onCardsSelected(result);
    onNavigate('reading');
  };

  const normalizedAngles = Array.from({ length: DISPLAY_COUNT }, (_, i) => {
    const mid = Math.floor(DISPLAY_COUNT / 2);
    return (i - mid) * 10;
  });

  return (
    <div className="min-h-dvh flex flex-col items-center justify-between px-4 py-10">
      <div className="text-center">
        <h1
          className="text-3xl sm:text-4xl font-serif font-light mb-2"
          style={{ color: '#ede8f5' }}
        >
          Выбери три карты
        </h1>
        <p className="text-sm" style={{ color: '#4b4470' }}>
          Прислушайся к себе и коснись тех, что притягивают внимание
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-4 my-5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="flex items-center gap-1.5"
          >
            <div
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i < selected.length ? '#7c5cbf' : '#1e1b33',
                boxShadow: i < selected.length ? '0 0 6px rgba(124,92,191,0.5)' : 'none',
              }}
            />
            {i < selected.length && (
              <span className="text-xs font-serif" style={{ color: '#7c5cbf' }}>
                {selected[i].nameRu}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Fan of cards */}
      <div
        className="relative flex items-end justify-center"
        style={{ height: '240px', width: '100%', maxWidth: '380px' }}
      >
        {deck.map((card, i) => {
          const angle = normalizedAngles[i];
          const isFlipped = flipped.has(i);
          const isDisabled = selected.length >= 3 && !isFlipped;

          return (
            <div
              key={card.id}
              className={`absolute bottom-0 ${isFlipped ? 'card-flipped' : ''}`}
              style={{
                left: '50%',
                transform: `translateX(-50%) translateX(${(i - Math.floor(DISPLAY_COUNT / 2)) * 38}px) rotate(${angle}deg)`,
                transformOrigin: 'bottom center',
                width: '80px',
                height: '128px',
                cursor: isDisabled || isFlipped ? 'default' : 'pointer',
                zIndex: isFlipped ? 10 + i : i,
                transition: 'opacity 0.2s ease',
              }}
              onClick={() => handleCardClick(card, i)}
            >
              <div className="card-inner w-full h-full">
                {/* Card back */}
                <div
                  className="card-front w-full h-full rounded-lg flex items-center justify-center"
                  style={{
                    background: '#0d0b1e',
                    border: '1px solid #2d2a4a',
                    opacity: isDisabled ? 0.3 : 1,
                    boxShadow: isDisabled ? 'none' : '0 2px 12px rgba(0,0,0,0.5)',
                  }}
                >
                  <span style={{ color: '#2d2a4a', fontSize: '20px' }}>✦</span>
                </div>

                {/* Card face */}
                <div
                  className="card-back w-full h-full rounded-lg flex flex-col items-center justify-center gap-1.5 p-2"
                  style={{
                    background: 'linear-gradient(160deg, #1e1040 0%, #130d2e 100%)',
                    border: '1px solid #3b2275',
                    boxShadow: '0 0 16px rgba(76,29,149,0.3)',
                  }}
                >
                  <span className="text-xl">{card.symbol}</span>
                  <span className="text-center text-xs font-serif leading-tight" style={{ color: '#a78bfa' }}>
                    {card.nameRu}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-8 w-full max-w-sm space-y-3">
        {limitReached ? (
          <div
            className="rounded-lg p-5"
            style={{ background: '#09080f', border: '1px solid #2d1a5e' }}
          >
            <p className="font-serif text-lg font-light mb-1" style={{ color: '#ede8f5' }}>
              Расклад на сегодня уже получен
            </p>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#5a5280' }}>
              Бесплатный расклад — один в день. Карты уже сказали своё слово на сегодня.
            </p>
            <button
              onClick={() => onNavigate('paywall')}
              className="w-full py-3 rounded-lg text-sm font-medium transition-opacity duration-200 hover:opacity-85 mb-2"
              style={{ background: '#3b1d8a', color: '#e2dbf5', border: '1px solid #5b3ab5', letterSpacing: '0.01em' }}
            >
              Безлимитные расклады — 490 ₽/мес
            </button>
            <button
              onClick={() => onNavigate('card-of-the-day')}
              className="w-full py-2.5 text-xs transition-opacity duration-200 hover:opacity-75"
              style={{ color: '#3d3560' }}
            >
              Посмотреть карту дня
            </button>
          </div>
        ) : (
          <button
            onClick={handleGetReading}
            disabled={selected.length < 3}
            className="w-full py-4 rounded-lg text-sm font-medium transition-opacity duration-200"
            style={{
              background: selected.length >= 3 ? '#3b1d8a' : '#0a0916',
              color: selected.length >= 3 ? '#e2dbf5' : '#2d2a4a',
              border: selected.length >= 3 ? '1px solid #5b3ab5' : '1px solid #1a1730',
              cursor: selected.length >= 3 ? 'pointer' : 'not-allowed',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => { if (selected.length >= 3) e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            {selected.length < 3
              ? `Выбери ещё ${3 - selected.length} ${3 - selected.length === 1 ? 'карту' : 'карты'}`
              : 'Получить разбор'}
          </button>
        )}
      </div>
    </div>
  );
}
