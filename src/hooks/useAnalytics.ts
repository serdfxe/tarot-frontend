declare global {
  interface Window {
    ym?: (id: number, action: string, goal: string) => void;
  }
}

export function useAnalytics() {
  const ymId = Number(import.meta.env.VITE_YM_ID);

  const reachGoal = (goal: string) => {
    try {
      if (typeof window.ym === 'function' && ymId) {
        window.ym(ymId, 'reachGoal', goal);
      }
    } catch {
      // silently fail in dev
    }
  };

  return { reachGoal };
}
