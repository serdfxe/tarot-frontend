import { useEffect, useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import type { SelectedCard, Screen } from '../types';
import { PushBanner } from '../components/PushBanner';

interface Props {
  question: string;
  cards: SelectedCard[];
  initialInterpretation: string;
  onNavigate: (screen: Screen) => void;
  onReadingSaved: (interpretation: string) => void;
}

async function fetchInterpretation(question: string, cards: SelectedCard[]): Promise<string> {
  const response = await fetch('/api/reading', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      cards: cards.map(c => c.nameRu),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  const data = await response.json();
  return data.text ?? '';
}

// Strip markdown bold/italic markers and clean up
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')  // **bold**
    .replace(/\*(.+?)\*/g, '$1')       // *italic*
    .replace(/^#{1,6}\s+/gm, '')       // ## headings
    .replace(/[^\u0000-\u007F\u0400-\u04FF\u0020-\u007E\s.,!?;:()«»""—–\-\d]/g, '') // strip non-Russian/non-ASCII oddities (incl. CJK)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}



export function ReadingScreen({ question, cards, initialInterpretation, onNavigate, onReadingSaved }: Props) {
  const { reachGoal } = useAnalytics();
  const [interpretation, setInterpretation] = useState(initialInterpretation);
  const [loading, setLoading] = useState(!initialInterpretation);
  const [error, setError] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [showPushBanner, setShowPushBanner] = useState(false);

  useEffect(() => {
    // Skip fetch if we already have the result (e.g. navigating back from paywall)
    if (initialInterpretation) return;

    let cancelled = false;
    setLoading(true);
    setError('');

    fetchInterpretation(question, cards)
      .then(text => {
        if (cancelled) return;
        setInterpretation(text);
        setLoading(false);
        onReadingSaved(text);
        reachGoal('reading_completed');
        setTimeout(() => setShowPushBanner(true), 3000);
      })
      .catch(err => {
        if (cancelled) return;
        setError('Не удалось получить разбор. Проверь API-ключ или попробуй позже.');
        setLoading(false);
        console.error(err);
      });

    return () => { cancelled = true; };
  }, []);

  const cleanedText = interpretation ? stripMarkdown(interpretation) : '';

  const handleEmailSubmit = () => {
    if (!email.trim()) return;
    reachGoal('email_submitted');
    setEmailSent(true);
  };

  return (
    <div className="min-h-dvh flex flex-col px-4 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onNavigate('landing')}
          className="text-sm transition-opacity duration-200 hover:opacity-75"
          style={{ color: '#4b4470' }}
        >
          ← Главная
        </button>
        <span className="text-xs tracking-widest uppercase" style={{ color: '#2d2a4a', letterSpacing: '0.1em' }}>
          Расклад
        </span>
      </div>

      {/* Cards row */}
      <div className="flex justify-center gap-3 mb-8">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col items-center gap-2"
            style={{ width: '80px' }}
          >
            <div
              className="w-full rounded-lg flex flex-col items-center justify-center gap-1 py-3 px-1"
              style={{
                background: 'linear-gradient(160deg, #1e1040 0%, #130d2e 100%)',
                border: '1px solid #3b2275',
                height: '100px',
                boxShadow: '0 0 12px rgba(76,29,149,0.2)',
                transform: card.reversed ? 'rotate(180deg)' : 'none',
              }}
            >
              <span className="text-xl">{card.symbol}</span>
            </div>
            <span className="text-center text-xs font-serif leading-tight" style={{ color: '#a78bfa' }}>
              {card.nameRu}
            </span>
          </div>
        ))}
      </div>

      {/* Question */}
      <div
        className="rounded-lg p-4 mb-7"
        style={{
          background: '#09080f',
          borderLeft: '2px solid #2d1a5e',
          color: '#6d5ba8',
          fontSize: '0.8rem',
          lineHeight: '1.6',
          fontStyle: 'italic',
        }}
      >
        «{question}»
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-8 py-14">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center pulse-glow"
            style={{ background: '#1e1040', border: '1px solid #3b2275' }}
          >
            <span style={{ color: '#7c5cbf', fontSize: '16px' }}>✦</span>
          </div>
          <p className="text-xl font-serif font-light" style={{ color: '#a78bfa' }}>
            Карты открываются…
          </p>
          <div className="space-y-3 w-full">
            {[100, 80, 90, 65].map((w, i) => (
              <div key={i} className="shimmer rounded h-3" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div
          className="rounded-lg p-4 text-sm"
          style={{ background: '#110808', border: '1px solid #3f0f0f', color: '#e07070' }}
        >
          {error}
        </div>
      )}

      {/* Interpretation */}
      {!loading && !error && cleanedText && (
        <div className="space-y-5">
          <div
            className="rounded-lg p-5"
            style={{ background: '#09080f', border: '1px solid #1a1730' }}
          >
            <p
              className="leading-relaxed whitespace-pre-line"
              style={{ color: '#c0b8d4', fontSize: '0.875rem', lineHeight: '1.8' }}
            >
              {cleanedText}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              onClick={() => setShowEmailModal(true)}
              className="w-full py-3.5 rounded-lg text-sm font-medium transition-opacity duration-200 hover:opacity-80"
              style={{ background: 'transparent', color: '#6d5ba8', border: '1px solid #2d2a4a' }}
            >
              Сохранить разбор
            </button>
            <button
              onClick={() => onNavigate('paywall')}
              className="w-full py-3.5 rounded-lg text-sm font-medium transition-opacity duration-200 hover:opacity-85"
              style={{ background: '#3b1d8a', color: '#e2dbf5', border: '1px solid #5b3ab5', letterSpacing: '0.01em' }}
            >
              Узнать больше
            </button>
          </div>
        </div>
      )}

      {/* Email modal */}
      {showEmailModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={e => e.target === e.currentTarget && setShowEmailModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl p-6"
            style={{ background: '#0f0d1e', border: '1px solid #1e1b33' }}
          >
            {!emailSent ? (
              <>
                <h3 className="font-serif text-xl font-light mb-2" style={{ color: '#ede8f5' }}>
                  Отправить на почту
                </h3>
                <p className="text-sm mb-5 leading-relaxed" style={{ color: '#5a5280' }}>
                  Отправим разбор тебе на почту и напомним через неделю
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="твой@email.com"
                  className="w-full rounded-lg p-3 text-sm mb-4"
                  style={{
                    background: '#06050e',
                    border: '1px solid #1e1b33',
                    color: '#ccc5e0',
                    outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#4c1d95')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#1e1b33')}
                  onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
                />
                <button
                  onClick={handleEmailSubmit}
                  className="w-full py-3 rounded-lg text-sm font-medium transition-opacity duration-200 hover:opacity-85"
                  style={{ background: '#3b1d8a', color: '#e2dbf5', border: '1px solid #5b3ab5' }}
                >
                  Отправить
                </button>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="w-full mt-3 py-2 text-sm transition-opacity duration-200 hover:opacity-75"
                  style={{ color: '#3d3560' }}
                >
                  Закрыть
                </button>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="font-serif text-3xl mb-4" style={{ color: '#a78bfa' }}>✦</div>
                <h3 className="font-serif text-xl font-light mb-2" style={{ color: '#ede8f5' }}>Готово</h3>
                <p className="text-sm mb-5" style={{ color: '#5a5280' }}>
                  Пришлём разбор в течение нескольких минут
                </p>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-sm transition-opacity duration-200 hover:opacity-75"
                  style={{ color: '#3d3560' }}
                >
                  Закрыть
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showPushBanner && (
        <PushBanner onDismiss={() => setShowPushBanner(false)} />
      )}
    </div>
  );
}
