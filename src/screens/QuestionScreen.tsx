import { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import type { Screen } from '../types';

interface Props {
  onNavigate: (screen: Screen) => void;
  onQuestionSet: (q: string) => void;
}

export function QuestionScreen({ onNavigate, onQuestionSet }: Props) {
  const [text, setText] = useState('');
  const { reachGoal } = useAnalytics();
  const ready = text.trim().length > 10;

  const handleSubmit = () => {
    if (!ready) return;
    reachGoal('question_submitted');
    onQuestionSet(text.trim());
    onNavigate('card-selection');
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-1.5 mb-12 text-sm transition-opacity duration-200 hover:opacity-75"
          style={{ color: '#4b4470' }}
        >
          ← Назад
        </button>

        <h1
          className="text-4xl sm:text-5xl font-serif font-light leading-tight mb-3"
          style={{ color: '#ede8f5', letterSpacing: '-0.3px' }}
        >
          Что тебя беспокоит
          <br />
          <span className="gradient-text">прямо сейчас?</span>
        </h1>

        <p className="mb-7 text-sm" style={{ color: '#4b4470' }}>
          Никто не увидит твой ответ
        </p>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Опиши ситуацию своими словами — чем честнее, тем точнее расклад"
          rows={6}
          className="w-full rounded-lg p-4 text-sm leading-relaxed resize-none"
          style={{
            background: '#0a0916',
            border: '1px solid #1e1b33',
            color: '#ccc5e0',
            fontFamily: 'Inter, system-ui, sans-serif',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#4c1d95')}
          onBlur={e => (e.currentTarget.style.borderColor = '#1e1b33')}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.metaKey) handleSubmit();
          }}
        />

        <div className="flex items-center justify-between mt-2 mb-8">
          <span className="text-xs" style={{ color: ready ? '#6d5ba8' : '#2d2a4a' }}>
            {ready ? 'Можно тянуть карты' : `ещё ${Math.max(0, 11 - text.length)} симв.`}
          </span>
          <span className="text-xs" style={{ color: '#2d2a4a' }}>
            {text.length}
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!ready}
          className="w-full py-4 rounded-lg text-sm font-medium transition-opacity duration-200"
          style={{
            background: ready ? '#3b1d8a' : '#0f0d1e',
            color: ready ? '#e2dbf5' : '#2d2a4a',
            border: ready ? '1px solid #5b3ab5' : '1px solid #1a1730',
            cursor: ready ? 'pointer' : 'not-allowed',
            letterSpacing: '0.01em',
            opacity: ready ? 1 : 1,
          }}
          onMouseEnter={e => { if (ready) e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          Потянуть карты
        </button>
      </div>
    </div>
  );
}
