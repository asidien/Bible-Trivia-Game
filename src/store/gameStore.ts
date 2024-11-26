import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameRecord {
  date: string;
  score: number;
  totalQuestions: number;
  gameType: 'fruits' | 'fish' | 'hero';
  perfectScore: boolean;
  timeBonus?: number;
}

interface GameStore {
  records: GameRecord[];
  addRecord: (record: GameRecord) => void;
  getTopScores: (gameType: 'fruits' | 'fish' | 'hero') => GameRecord[];
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (record) => set((state) => ({
        records: [...state.records, record]
      })),
      getTopScores: (gameType) => {
        return get().records
          .filter(r => r.gameType === gameType)
          .sort((a, b) => {
            const aTotal = (a.score * 100) + (a.timeBonus || 0) + (a.perfectScore ? 1000 : 0);
            const bTotal = (b.score * 100) + (b.timeBonus || 0) + (b.perfectScore ? 1000 : 0);
            return bTotal - aTotal;
          })
          .slice(0, 5);
      }
    }),
    {
      name: 'bible-trivia-storage'
    }
  )
);