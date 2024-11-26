import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, CheckCircle, XCircle, Trophy } from 'lucide-react';
import useSound from 'use-sound';
import { allBiblicalScenes } from '../../data/egyptScenes';
import { useGameStore } from '../../store/gameStore';
import { Scene } from '../../types';

interface PictionaryGameProps {
  onComplete: () => void;
}

export const PictionaryGame: React.FC<PictionaryGameProps> = ({ onComplete }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [dailyScenes, setDailyScenes] = useState<Scene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const addRecord = useGameStore(state => state.addRecord);

  const [playCorrect] = useSound('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
  const [playWrong] = useSound('https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3');
  const [playLevelUp] = useSound('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('lastGameDate');
    const storedScenes = localStorage.getItem('dailyScenes');

    if (storedDate !== today || !storedScenes) {
      const levelScenes = allBiblicalScenes.filter(scene => scene.level === currentLevel);
      const shuffled = [...levelScenes].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 3);
      
      setDailyScenes(selected);
      localStorage.setItem('lastGameDate', today);
      localStorage.setItem('dailyScenes', JSON.stringify(selected));
    } else {
      setDailyScenes(JSON.parse(storedScenes));
    }
  }, [currentLevel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentScene = dailyScenes[currentSceneIndex];
    const correct = guess.toLowerCase().trim() === currentScene.word.toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      playCorrect();
      setScore(prev => prev + currentScene.points);
      
      setTimeout(() => {
        if (currentSceneIndex < dailyScenes.length - 1) {
          setCurrentSceneIndex(prev => prev + 1);
          setGuess('');
          setIsCorrect(null);
          setShowHint(false);
        } else if (currentLevel < 3) {
          playLevelUp();
          setCurrentLevel(prev => prev + 1);
          setCurrentSceneIndex(0);
          setGuess('');
          setIsCorrect(null);
          setShowHint(false);
        } else {
          addRecord({
            date: new Date().toISOString(),
            score,
            totalQuestions: dailyScenes.length,
            gameType: 'egypt',
            perfectScore: score === dailyScenes.reduce((acc, scene) => acc + scene.points, 0)
          });
          onComplete();
        }
      }, 1500);
    } else {
      playWrong();
    }
  };

  if (dailyScenes.length === 0) return null;

  const currentScene = dailyScenes[currentSceneIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="bg-purple-900 rounded-xl shadow-lg p-8 border-2 border-purple-500">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-purple-200 font-serif">
              Level {currentLevel} - Scene {currentSceneIndex + 1}
            </h2>
            <p className="text-purple-300 mt-2">{currentScene.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-bold">{score} pts</span>
          </div>
        </div>

        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={currentScene.image}
            alt="Biblical scene"
            className="w-full h-64 object-cover"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="w-full p-3 rounded-lg border-2 border-purple-500 bg-purple-800/50 text-purple-200 focus:border-purple-400 focus:ring focus:ring-purple-400/20 transition-colors"
            placeholder="What biblical scene is this?"
          />

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="text-purple-300 hover:text-purple-200 transition-colors"
            >
              Need a hint?
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
            >
              Submit Answer
            </button>
          </div>
        </form>

        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-purple-800/50 rounded-lg border border-purple-500"
          >
            <p className="text-purple-300">Hint: {currentScene.hint}</p>
          </motion.div>
        )}

        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 flex items-center gap-2 ${
              isCorrect ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isCorrect ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>
              {isCorrect ? `Correct! +${currentScene.points} points` : 'Try again...'}
            </span>
          </motion.div>
        )}

        <div className="mt-6 flex justify-between text-sm text-purple-300">
          <span>Scene {currentSceneIndex + 1} of {dailyScenes.length}</span>
          <span>Level {currentLevel}/3</span>
        </div>
      </div>
    </motion.div>
  );
};