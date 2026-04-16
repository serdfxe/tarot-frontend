import { useState } from 'react';
import type { ReadingRecord } from '../types';

interface Props {
  history: ReadingRecord[];
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function HistorySidebar({ history, isOpen, onClose }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300"
          style={{ background: 'rgba(0,0,0,0.55)' }}
          onClick={onClose}
        />
      )}

      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: 'min(360px, 100vw)',
          background: '#07060f',
          borderLeft: '1px solid #1a1730',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #1a1730' }}
        >
          <h2 className="font-serif text-lg font-light" style={{ color: '#ccc5e0' }}>
            История раскладов
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded transition-opacity duration-200 hover:opacity-75 text-sm"
            style={{ color: '#3d3560' }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="font-serif text-2xl mb-3" style={{ color: '#1a1730' }}>✦</div>
              <p className="text-sm" style={{ color: '#2d2a4a' }}>
                Завершённые расклады появятся здесь
              </p>
            </div>
          ) : (
            history.map(record => (
              <div
                key={record.id}
                className="rounded-lg overflow-hidden"
                style={{ background: '#0d0b1a', border: '1px solid #1a1730' }}
              >
                <button
                  className="w-full px-4 py-3.5 text-left flex items-start gap-3"
                  onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                >
                  <div className="flex gap-0.5 pt-0.5 flex-shrink-0">
                    {record.cards.slice(0, 3).map(c => (
                      <span key={c.id} style={{ fontSize: '13px' }}>{c.symbol}</span>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p
                      className="text-sm truncate leading-snug"
                      style={{ color: '#9490b5' }}
                    >
                      {record.question}
                    </p>
                    <p style={{ color: '#2d2a4a', fontSize: '0.7rem', marginTop: '3px' }}>
                      {formatDate(record.date)}
                    </p>
                  </div>
                  <span
                    className="text-xs flex-shrink-0 mt-1"
                    style={{
                      color: '#2d2a4a',
                      transform: expandedId === record.id ? 'rotate(180deg)' : 'rotate(0)',
                      display: 'inline-block',
                      transition: 'transform 0.2s',
                    }}
                  >
                    ▾
                  </span>
                </button>

                {expandedId === record.id && (
                  <div
                    className="px-4 pb-4 pt-1"
                    style={{ borderTop: '1px solid #1a1730' }}
                  >
                    <div className="flex flex-wrap gap-1.5 py-3">
                      {record.cards.map(c => (
                        <span
                          key={c.id}
                          style={{
                            background: '#0a0916',
                            border: '1px solid #1a1730',
                            color: '#5a5280',
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {c.symbol} {c.nameRu}
                        </span>
                      ))}
                    </div>
                    <p
                      className="leading-relaxed whitespace-pre-line"
                      style={{ color: '#3d3560', fontSize: '0.75rem', lineHeight: '1.7' }}
                    >
                      {record.interpretation.slice(0, 400)}
                      {record.interpretation.length > 400 ? '…' : ''}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
