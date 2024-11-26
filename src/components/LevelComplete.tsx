import React from 'react';
import { Trophy, ArrowRight } from 'lucide-react';

interface LevelCompleteProps {
  level: number;
  score: number;
  totalQuestions: number;
  onContinue: () => void;
  onReplay: () => void;
}

export const LevelComplete: React.FC<LevelCompleteProps> = ({
  level,
  score,
  totalQuestions,
  onContinue,
  onReplay,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Level {level} Complete!</h2>
          <p className="text-gray-600 mb-6">
            You scored {score} out of {totalQuestions}
          </p>
          
          <div className="space-y-4">
            <button
              onClick={onContinue}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Next Level
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={onReplay}
              className="w-full py-3 px-6 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Replay This Level
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};