import { useState, useCallback } from 'react';
import type { ReadingRecord } from '../types';

const STORAGE_KEY = 'tarot_history';

function loadHistory(): ReadingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(records: ReadingRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // storage full
  }
}

export function useHistory() {
  const [history, setHistory] = useState<ReadingRecord[]>(loadHistory);

  const addReading = useCallback((record: ReadingRecord) => {
    setHistory(prev => {
      const next = [record, ...prev].slice(0, 50);
      saveHistory(next);
      return next;
    });
  }, []);

  return { history, addReading };
}
