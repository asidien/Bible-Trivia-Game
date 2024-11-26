import React, { useState } from 'react';
import { Question } from '../types';
import { Leaf, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionTimer } from './QuestionTimer';
import useSound from 'use-sound';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
  gameType: 'fruits' | 'fish' | 'hero';
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onAnswer, 
  isAnswered,
  gameType 
}) => {
  const [playCorrect] = useSound('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
  const [playWrong] = useSound('https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3');
  const [timerActive, setTimerActive] = useState(true);

  const handleAnswer = (answer: string) => {
    setTimerActive(false);
    if (answer === question.correctAnswer) {
      playCorrect();
    } else {
      playWrong();
    }
    onAnswer(answer);
  };

  const handleTimeout = () => {
    if (!isAnswered) {
      playWrong();
      onAnswer('');
    }
  };

  const getIcon = () => {
    switch (gameType) {
      case 'fruits': return <Leaf className="w-8 h-8 text-green-600" />;
      case 'fish': return <motion.span className="text-3xl">🐟</motion.span>;
      case 'hero': return <Shield className="w-8 h-8 text-purple-600" />;
      default: return <Leaf className="w-8 h-8 text-green-600" />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl bg-gradient-to-br from-[#35e8f4] via-[#5ceaf8] to-[#35e8f4] rounded-xl shadow-lg p-8"
      >
        {gameType === 'hero' && (
          <QuestionTimer
            onTimeout={handleTimeout}
            isPlaying={timerActive && !isAnswered}
          />
        )}

        <div className="flex items-center gap-3 mb-6">
          {getIcon()}
          <h2 className="text-2xl font-semibold text-gray-800">{question.text}</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mt-6">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !isAnswered && handleAnswer(option)}
              disabled={isAnswered}
              className={`p-4 text-left rounded-lg transition-all duration-200 ${
                isAnswered
                  ? option === question.correctAnswer
                    ? 'bg-green-100 border-2 border-green-500 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                  : 'bg-white/80 hover:bg-white hover:shadow-md text-gray-800'
              }`}
            >
              {String.fromCharCode(65 + index)}. {option}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};