import React from 'react';
import { Medal } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  totalQuestions: number;
  rewards: string[];
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, totalQuestions, rewards }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Medal className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-semibold">Score: {score}/{totalQuestions}</h3>
        </div>
        <div className="flex gap-2">
          {rewards.map((reward, index) => (
            <span
              key={index}
              className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
            >
              {reward}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};