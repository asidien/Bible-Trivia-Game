import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Puzzle, CheckCircle, XCircle } from 'lucide-react';

interface PuzzleProps {
  onComplete: () => void;
}

const puzzles = [
  {
    id: 1,
    location: 'Susa',
    question: "I am Queen Esther's palace, where courage met destiny. What am I?",
    answer: "susa palace",
    hint: "The capital city where Esther became queen"
  },
  {
    id: 2,
    location: 'Babylon',
    question: "Daniel interpreted me, a dream of kingdoms to come. What am I?",
    answer: "statue dream",
    hint: "Nebuchadnezzar's vision of future empires"
  },
  {
    id: 3,
    location: 'Persepolis',
    question: "I was decreed by Cyrus, allowing God's people to return. What am I?",
    answer: "return decree",
    hint: "The proclamation that ended the Babylonian exile"
  }
];

export const PuzzleGame: React.FC<PuzzleProps> = ({ onComplete }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correct = answer.toLowerCase().trim() === puzzles[currentPuzzle].answer;
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => {
        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(prev => prev + 1);
          setAnswer('');
          setIsCorrect(null);
          setShowHint(false);
        } else {
          onComplete();
        }
      }, 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Puzzle className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-purple-900">
            {puzzles[currentPuzzle].location} Puzzle
          </h2>
        </div>

        <div className="mb-8">
          <p className="text-lg text-gray-700 mb-4">
            {puzzles[currentPuzzle].question}
          </p>
          {showHint && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-purple-600 italic"
            >
              Hint: {puzzles[currentPuzzle].hint}
            </motion.p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-colors"
            placeholder="Enter your answer..."
          />

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="text-purple-600 hover:text-purple-700 text-sm"
            >
              Need a hint?
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Submit Answer
            </button>
          </div>
        </form>

        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 flex items-center gap-2 ${
              isCorrect ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isCorrect ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>
              {isCorrect ? 'Correct! Well done!' : 'Try again...'}
            </span>
          </motion.div>
        )}

        <div className="mt-6 flex justify-between text-sm text-gray-500">
          <span>Puzzle {currentPuzzle + 1} of {puzzles.length}</span>
          <span>{Math.round(((currentPuzzle) / puzzles.length) * 100)}% Complete</span>
        </div>
      </div>
    </motion.div>
  );
};