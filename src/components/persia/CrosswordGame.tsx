import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, HelpCircle, BookOpen } from 'lucide-react';
import useSound from 'use-sound';
import Confetti from 'react-confetti';
import { useGameStore } from '../../store/gameStore';

interface CrosswordCell {
  letter: string;
  isRevealed: boolean;
  x: number;
  y: number;
}

interface CrosswordProps {
  onComplete: () => void;
}

const words = [
  { word: 'DANIEL', clue: 'Prophet who interpreted dreams in Babylon' },
  { word: 'ESTHER', clue: 'Queen who saved her people in Persia' },
  { word: 'CYRUS', clue: 'Persian king who allowed Jews to return home' },
  { word: 'SUSA', clue: 'Persian capital where Esther became queen' },
  { word: 'DECREE', clue: 'Official order that ended the exile' }
];

export const CrosswordGame: React.FC<CrosswordProps> = ({ onComplete }) => {
  const [grid, setGrid] = useState<CrosswordCell[][]>([]);
  const [selectedWord, setSelectedWord] = useState('');
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [showGuide, setShowGuide] = useState(true);
  const addRecord = useGameStore(state => state.addRecord);

  const [playCorrect] = useSound('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
  const [playVictory] = useSound('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const size = 10;
    const newGrid: CrosswordCell[][] = Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => ({
        letter: '',
        isRevealed: false,
        x: 0,
        y: 0
      }))
    );
    setGrid(newGrid);
  };

  const handleWordSubmit = (word: string) => {
    if (words.find(w => w.word === word.toUpperCase()) && !completedWords.includes(word)) {
      playCorrect();
      setScore(prev => prev + 100);
      setCompletedWords([...completedWords, word]);
      
      if (completedWords.length + 1 === words.length) {
        playVictory();
        setShowConfetti(true);
        addRecord({
          date: new Date().toISOString(),
          score: score + 100,
          totalQuestions: words.length,
          gameType: 'persia',
          perfectScore: true
        });
        setTimeout(() => {
          onComplete();
        }, 3000);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6"
    >
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="bg-black rounded-xl shadow-lg p-8 border-2 border-purple-500">
        {showGuide ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <BookOpen className="w-16 h-16 text-purple-400 mx-auto" />
            <h2 className="text-2xl font-bold text-purple-200">Welcome to Persian Empire Crossword!</h2>
            <div className="space-y-4 text-purple-300">
              <p>Explore the rich history of ancient Persia through this biblical word puzzle.</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Read each clue carefully</li>
                <li>Type your answer and press Enter or click Submit</li>
                <li>Each correct answer earns you 100 points</li>
                <li>Complete all words to win!</li>
              </ul>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
            >
              Start Game
            </button>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-200 font-serif">
                Persian Empire Crossword
              </h2>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-bold">{score} pts</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-purple-200 font-semibold mb-2">Clues:</h3>
                {words.map((word, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      completedWords.includes(word.word)
                        ? 'bg-purple-900/50 text-purple-300'
                        : 'bg-purple-800/30 text-purple-200'
                    }`}
                  >
                    {word.clue}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={selectedWord}
                  onChange={(e) => setSelectedWord(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleWordSubmit(selectedWord);
                      setSelectedWord('');
                    }
                  }}
                  className="w-full p-3 rounded-lg border-2 border-purple-500 bg-purple-800/50 text-purple-200 focus:border-purple-400 focus:ring focus:ring-purple-400/20 transition-colors"
                  placeholder="Enter your answer..."
                />

                <button
                  onClick={() => {
                    handleWordSubmit(selectedWord);
                    setSelectedWord('');
                  }}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center justify-center gap-2"
                >
                  Submit Answer <ArrowRight className="w-5 h-5" />
                </button>

                <div className="text-purple-300 text-sm mt-4">
                  <p>Words found: {completedWords.length}/{words.length}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};