import React, { useEffect, useState } from 'react';
import { Trophy, Star, RotateCw, MapPin } from 'lucide-react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import useSound from 'use-sound';

interface GameCompleteProps {
  score: number;
  totalQuestions: number;
  onReplay: () => void;
  onReturnToMap: () => void;
}

export const GameComplete: React.FC<GameCompleteProps> = ({
  score,
  totalQuestions,
  onReplay,
  onReturnToMap,
}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [playVictory] = useSound('https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3');

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (score === totalQuestions) {
      playVictory();
    }
  }, [score, totalQuestions, playVictory]);

  const percentage = (score / totalQuestions) * 100;
  const isPerfectScore = score === totalQuestions;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40">
      {isPerfectScore && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-black rounded-xl p-8 max-w-md w-full mx-4 border-2 border-purple-500"
      >
        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2 text-purple-200">
            {isPerfectScore ? 'Perfect Score!' : 'Game Complete!'}
          </h2>
          
          <div className="flex justify-center items-center gap-2 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < Math.ceil((percentage / 100) * 5)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>

          <p className="text-xl mb-8 text-purple-200">
            You scored <span className="font-bold text-purple-400">{score}</span> out of{' '}
            <span className="font-bold text-purple-400">{totalQuestions}</span>
          </p>

          {isPerfectScore && (
            <p className="text-purple-300 mb-6">
              Congratulations! Your perfect score shows your deep understanding. 
              Continue your journey through other biblical locations to expand your knowledge further!
            </p>
          )}

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReplay}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RotateCw className="w-5 h-5" />
              Play Again
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReturnToMap}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 border-2 border-purple-500 text-purple-200 rounded-lg hover:bg-purple-900/50 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              Return to Map
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};