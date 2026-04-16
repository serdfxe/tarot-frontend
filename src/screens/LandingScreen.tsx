import type { Screen } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';

interface Props {
  onNavigate: (screen: Screen) => void;
}

export function LandingScreen({ onNavigate }: Props) {
  const { reachGoal } = useAnalytics();

  const handleStart = () => {
    reachGoal('start_click');
    onNavigate('question');
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(76,29,149,0.18) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Symbol */}
        <div className="float-animation mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mx-auto"
            style={{
              background: '#0f0d1e',
              border: '1px solid #2d2a4a',
              boxShadow: '0 0 24px rgba(109,40,217,0.15)',
            }}
          >
            <span className="text-2xl" style={{ color: '#7c5cbf' }}>✦</span>
          </div>
        </div>

        <h1
          className="text-5xl sm:text-6xl font-serif font-light leading-tight mb-5"
          style={{ color: '#ede8f5', letterSpacing: '-0.5px' }}
        >
          Поговори с собой
          <br />
          <span className="gradient-text">через карты</span>
        </h1>

        <p
          className="text-base font-light mb-12 leading-relaxed"
          style={{ color: '#7c6fa8' }}
        >
          Опиши ситуацию — получи неожиданный взгляд за 3 минуты
        </p>

        <button
          onClick={handleStart}
          className="w-full sm:w-auto px-12 py-4 rounded-lg text-base font-medium transition-opacity duration-200 hover:opacity-85"
          style={{
            background: '#3b1d8a',
            color: '#e2dbf5',
            border: '1px solid #5b3ab5',
            letterSpacing: '0.01em',
          }}
        >
          Начать расклад
        </button>

        <div className="mt-5">
          <button
            onClick={() => onNavigate('card-of-the-day')}
            className="text-sm transition-opacity duration-200 hover:opacity-75"
            style={{ color: '#4b4470' }}
          >
            или получи Карту дня
          </button>
        </div>
      </div>

      <p
        className="absolute bottom-8 text-xs tracking-wide"
        style={{ color: '#2d2a4a' }}
      >
        22 карты Старшего Аркана · персональный разбор
      </p>
    </div>
  );
}
