import React, { useState } from 'react';
import { ReflectionQuestion } from '../types';
import { BookOpen, Save, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useGameStore } from '../store/gameStore';
import { Leaderboard } from './Leaderboard';

interface ReflectionQuestionsProps {
  questions: ReflectionQuestion[];
  onSave: (entries: Record<string, string>) => void;
  onComplete: () => void;
  score: number;
  totalQuestions: number;
  gameType: 'fruits' | 'fish';
}

export const ReflectionQuestions: React.FC<ReflectionQuestionsProps> = ({
  questions,
  onSave,
  onComplete,
  score,
  totalQuestions,
  gameType,
}) => {
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const addRecord = useGameStore(state => state.addRecord);

  const handleChange = (id: number, value: string) => {
    const newEntries = { ...entries, [id]: value };
    setEntries(newEntries);
    setIsValid(questions.every(q => newEntries[q.id]?.trim()));
  };

  const handleSubmit = () => {
    if (isValid) {
      const perfectScore = score === totalQuestions;
      if (perfectScore) {
        setShowConfetti(true);
      }

      addRecord({
        date: new Date().toISOString(),
        score,
        totalQuestions,
        gameType,
        perfectScore
      });

      onSave(entries);
      setTimeout(onComplete, 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-8"
    >
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-green-600" />
        <h2 className="text-2xl font-semibold text-green-800">Spiritual Reflection</h2>
      </div>

      <div className="space-y-6">
        {questions.map((question) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: question.id * 0.1 }}
            className="bg-white/80 rounded-lg p-6 backdrop-blur-sm"
          >
            <label className="flex gap-2 text-lg font-medium mb-2 text-green-700">
              <Leaf className="w-5 h-5" />
              {question.text}
            </label>
            <textarea
              value={entries[question.id] || ''}
              onChange={(e) => handleChange(question.id, e.target.value)}
              className="w-full h-32 p-3 border-2 border-green-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50"
              placeholder="Share your thoughts and reflections..."
            />
          </motion.div>
        ))}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!isValid}
          className={`flex items-center gap-2 w-full justify-center py-3 px-6 rounded-lg transition-all duration-200 ${
            isValid
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Save className="w-5 h-5" />
          Save Reflections & Continue
        </motion.button>

        <Leaderboard gameType={gameType} />
      </div>
    </motion.div>
  );
};