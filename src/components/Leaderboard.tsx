import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Target, Clock, Award } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface LeaderboardProps {
  gameType: 'fruits' | 'fish' | 'hero';
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ gameType }) => {
  const getTopScores = useGameStore(state => state.getTopScores);
  const topScores = getTopScores(gameType);

  const getBadgeColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-gray-100 text-gray-800';
      case 2: return 'bg-amber-100 text-amber-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const calculatePoints = (record: any) => {
    const basePoints = record.score * 100;
    const perfectBonus = record.perfectScore ? 1000 : 0;
    const timeBonus = record.timeBonus || 0;
    return basePoints + perfectBonus + timeBonus;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 mt-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-800">Hall of Fame</h2>
      </div>

      <div className="space-y-4">
        {topScores.map((record, index) => {
          const totalPoints = calculatePoints(record);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getBadgeColor(index)}`}>
                  {index === 0 ? '👑' : `#${index + 1}`}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold">
                        {record.score}/{record.totalQuestions}
                      </span>
                    </div>
                    {record.timeBonus > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">+{record.timeBonus}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-purple-500" />
                      <span className="font-bold text-purple-600">
                        {totalPoints} pts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {record.perfectScore && (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-sm font-semibold shadow-sm">
                    Perfect! 🌟
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
        {topScores.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No champions yet. Be the first!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};