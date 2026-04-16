import { useState } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';

interface Props {
  onDismiss: () => void;
}

export function PushBanner({ onDismiss }: Props) {
  const { subscribed, requestPermission } = usePushNotifications();
  const [requesting, setRequesting] = useState(false);
  const [done, setDone] = useState(subscribed);

  if (done) return null;

  const handleAllow = async () => {
    setRequesting(true);
    await requestPermission();
    setRequesting(false);
    setDone(true);
    setTimeout(onDismiss, 1200);
  };

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 rounded-lg p-4 flex items-center gap-4"
      style={{
        background: '#0f0d1e',
        border: '1px solid #1e1b33',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <div
        className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
        style={{ background: '#1e1040', border: '1px solid #2d1a5e' }}
      >
        <span style={{ fontSize: '14px' }}>✦</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug" style={{ color: '#ccc5e0' }}>
          Карта дня каждое утро?
        </p>
        <p style={{ color: '#3d3560', fontSize: '0.7rem', marginTop: '2px' }}>
          Мягкое напоминание в 9:00
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleAllow}
          disabled={requesting}
          className="px-3 py-1.5 rounded text-xs font-medium transition-opacity duration-200 hover:opacity-85"
          style={{
            background: '#3b1d8a',
            color: '#e2dbf5',
            border: '1px solid #5b3ab5',
            opacity: requesting ? 0.6 : 1,
          }}
        >
          {requesting ? '…' : 'Разрешить'}
        </button>
        <button
          onClick={onDismiss}
          className="text-xs transition-opacity duration-200 hover:opacity-75 px-1"
          style={{ color: '#2d2a4a' }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
