import { useEffect, useState } from 'react';
import { getCardOfTheDay } from '../constants/tarot';
import type { TarotCard, Screen } from '../types';
import { PushBanner } from '../components/PushBanner';

interface Props {
  onNavigate: (screen: Screen) => void;
}

async function fetchCardMeaning(card: TarotCard): Promise<string> {
  const today = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

  const response = await fetch('/api/card-of-day', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      card_name: card.nameRu,
      card_en: card.nameEn,
      keywords: card.keywords,
      date: today,
    }),
  });

  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  return data.text ?? '';
}

const CACHE_KEY = 'tarot_card_of_day_cache';

function getCached(): string | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { date, text } = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    return date === today ? text : null;
  } catch {
    return null;
  }
}

function setCached(text: string) {
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem(CACHE_KEY, JSON.stringify({ date: today, text }));
}

export function CardOfTheDayScreen({ onNavigate }: Props) {
  const card = getCardOfTheDay();
  const cached = getCached();
  const [meaning, setMeaning] = useState(cached ?? '');
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState('');
  const [showPushBanner, setShowPushBanner] = useState(false);

  const today = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  useEffect(() => {
    if (cached) {
      setTimeout(() => setShowPushBanner(true), 1500);
      return;
    }

    fetchCardMeaning(card)
      .then(text => {
        setCached(text);
        setMeaning(text);
        setLoading(false);
        setTimeout(() => setShowPushBanner(true), 2000);
      })
      .catch(err => {
        setError('Не удалось загрузить интерпретацию. Проверь API-ключ.');
        setLoading(false);
        console.error(err);
      });
  }, []);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-8 max-w-sm mx-auto">
      <button
        onClick={() => onNavigate('landing')}
        className="self-start text-sm mb-8 transition-colors duration-200"
        style={{ color: '#7c6fa8' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#c4b5fd')}
        onMouseLeave={e => (e.currentTarget.style.color = '#7c6fa8')}
      >
        ← Главная
      </button>

      <div className="text-center w-full">
        <p className="text-xs uppercase tracking-widest mb-6" style={{ color: '#4b4470' }}>
          {today}
        </p>

        <h1
          className="text-3xl sm:text-4xl font-serif font-light mb-8"
          style={{ color: '#e8e0f0' }}
        >
          Карта дня
        </h1>

        {/* Card */}
        <div className="flex justify-center mb-8">
          <div
            className="rounded-2xl border flex flex-col items-center justify-center gap-3 p-6 card-glow float-animation"
            style={{
              width: '140px',
              height: '210px',
              background: 'linear-gradient(160deg, #2e1065 0%, #1e1b4b 100%)',
              borderColor: '#7c3aed',
            }}
          >
            <span className="text-5xl">{card.symbol}</span>
            <div className="text-center">
              <div className="font-serif text-sm" style={{ color: '#c4b5fd' }}>{card.nameRu}</div>
              <div className="text-xs mt-1" style={{ color: '#4b4470' }}>{card.nameEn}</div>
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {card.keywords.split(', ').map(kw => (
            <span
              key={kw}
              className="px-3 py-1 rounded-full text-xs"
              style={{ background: '#1e1b33', color: '#9d8fc4', border: '1px solid #2d2a4a' }}
            >
              {kw}
            </span>
          ))}
        </div>

        {/* Meaning */}
        {loading && (
          <div className="space-y-3 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="shimmer rounded-lg h-4 mx-auto" style={{ width: `${90 - i * 10}%` }} />
            ))}
          </div>
        )}

        {error && (
          <div
            className="rounded-xl p-4 text-sm mb-8 text-left"
            style={{ background: '#1a0a0a', border: '1px solid #7f1d1d', color: '#fca5a5' }}
          >
            {error}
          </div>
        )}

        {meaning && (
          <div
            className="rounded-2xl p-5 mb-8 text-sm leading-relaxed text-left"
            style={{ background: '#12112a', border: '1px solid #1e1b33', color: '#b8afd0' }}
          >
            {meaning}
          </div>
        )}

        <button
          onClick={() => onNavigate('question')}
          className="w-full py-4 rounded-xl text-base font-medium transition-all duration-300 hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, #6d28d9, #9333ea)', color: '#fff' }}
        >
          Сделать полный расклад →
        </button>
      </div>

      {showPushBanner && (
        <PushBanner onDismiss={() => setShowPushBanner(false)} />
      )}
    </div>
  );
}
