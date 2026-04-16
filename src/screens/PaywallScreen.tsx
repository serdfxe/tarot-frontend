import { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import type { Screen } from '../types';

interface Props {
  onNavigate: (screen: Screen) => void;
  backTo: Screen;
}

export function PaywallScreen({ onNavigate, backTo }: Props) {
  const { reachGoal } = useAnalytics();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handlePayClick = () => {
    reachGoal('paywall_cta_click');
    setShowModal(true);
  };

  const handleEmailSubmit = () => {
    if (!email.trim()) return;
    reachGoal('email_submitted');
    setSubmitted(true);
  };

  const features = [
    '5 карт вместо трёх — более глубокий расклад',
    'Конкретный совет: что делать прямо сейчас',
    'Ответ на вопрос «куда двигаться»',
    'Разбор на почту и напоминание через неделю',
  ];

  return (
    <div className="min-h-dvh flex flex-col px-4 py-10 max-w-lg mx-auto">
      <button
        onClick={() => onNavigate(backTo)}
        className="self-start text-sm mb-10 transition-opacity duration-200 hover:opacity-75"
        style={{ color: '#4b4470' }}
      >
        ← Назад
      </button>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#2d2a4a', letterSpacing: '0.12em' }}>
          Расширенный разбор
        </p>
        <h1
          className="text-4xl sm:text-5xl font-serif font-light leading-tight mb-3"
          style={{ color: '#ede8f5', letterSpacing: '-0.3px' }}
        >
          Карты показали
          <br />
          <span className="gradient-text">кое-что ещё</span>
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: '#5a5280' }}>
          5 карт, конкретный совет и ответ на вопрос «что делать»
        </p>
      </div>

      {/* Features */}
      <div
        className="rounded-lg p-5 mb-8"
        style={{ background: '#09080f', border: '1px solid #1a1730' }}
      >
        <ul className="space-y-3">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-3" style={{ color: '#8880a8', fontSize: '0.8rem' }}>
              <span style={{ color: '#3b2275', flexShrink: 0, marginTop: '2px' }}>—</span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Pricing */}
      <div className="space-y-3">
        {/* Monthly — primary */}
        <div
          className="relative rounded-lg p-5"
          style={{ background: '#0f0920', border: '1px solid #3b2275' }}
        >
          <div
            className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded text-xs font-medium"
            style={{ background: '#1e1040', color: '#7c5cbf', border: '1px solid #3b2275', letterSpacing: '0.04em' }}
          >
            Выгодно
          </div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-serif text-lg font-light mb-0.5" style={{ color: '#ede8f5' }}>Безлимит на месяц</div>
              <div style={{ color: '#3d3560', fontSize: '0.75rem' }}>Неограниченные расклады 30 дней</div>
            </div>
            <div className="text-right ml-4">
              <div className="font-serif text-2xl font-light" style={{ color: '#a78bfa' }}>490 ₽</div>
              <div style={{ color: '#3d3560', fontSize: '0.7rem' }}>/ месяц</div>
            </div>
          </div>
          <button
            onClick={handlePayClick}
            className="w-full py-3 rounded-lg text-sm font-medium transition-opacity duration-200 hover:opacity-85"
            style={{ background: '#3b1d8a', color: '#e2dbf5', border: '1px solid #5b3ab5', letterSpacing: '0.01em' }}
          >
            Оформить подписку
          </button>
        </div>

        {/* One reading */}
        <div
          className="rounded-lg p-5"
          style={{ background: '#09080f', border: '1px solid #1a1730' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-serif text-lg font-light mb-0.5" style={{ color: '#ede8f5' }}>Один расклад</div>
              <div style={{ color: '#3d3560', fontSize: '0.75rem' }}>Расширенный разбор прямо сейчас</div>
            </div>
            <div className="text-right ml-4">
              <div className="font-serif text-2xl font-light" style={{ color: '#a78bfa' }}>199 ₽</div>
              <div style={{ color: '#3d3560', fontSize: '0.7rem' }}>один раз</div>
            </div>
          </div>
          <button
            onClick={handlePayClick}
            className="w-full py-3 rounded-lg text-sm font-medium transition-opacity duration-200 hover:opacity-80"
            style={{ background: 'transparent', color: '#6d5ba8', border: '1px solid #2d2a4a' }}
          >
            Купить расклад
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl p-6"
            style={{ background: '#0f0d1e', border: '1px solid #1e1b33' }}
          >
            {!submitted ? (
              <>
                <h3 className="font-serif text-xl font-light mb-2" style={{ color: '#ede8f5' }}>
                  Оплата скоро появится
                </h3>
                <p className="text-sm mb-5 leading-relaxed" style={{ color: '#5a5280' }}>
                  Оставь email — ты будешь первым, кто узнает о запуске
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
                  Уведомить меня
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full mt-3 py-2 text-sm transition-opacity duration-200 hover:opacity-75"
                  style={{ color: '#3d3560' }}
                >
                  Закрыть
                </button>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="font-serif text-3xl mb-4" style={{ color: '#a78bfa' }}>✦</div>
                <h3 className="font-serif text-xl font-light mb-2" style={{ color: '#ede8f5' }}>
                  Записали
                </h3>
                <p className="text-sm mb-5" style={{ color: '#5a5280' }}>
                  Сообщим, как только откроется оплата
                </p>
                <button
                  onClick={() => setShowModal(false)}
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
    </div>
  );
}
