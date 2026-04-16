const KEY = 'tarot_last_reading_date';

function today(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function useDailyLimit() {
  const hasReadingToday = (): boolean =>
    localStorage.getItem(KEY) === today();

  const markReadingDone = () =>
    localStorage.setItem(KEY, today());

  return { hasReadingToday, markReadingDone };
}
