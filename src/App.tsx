import React, { useState } from 'react';
import { WorldMap } from './components/WorldMap';
import { QuestionCard } from './components/QuestionCard';
import { ScoreBoard } from './components/ScoreBoard';
import { VideoIntro } from './components/VideoIntro';
import { LevelComplete } from './components/LevelComplete';
import { ReflectionQuestions } from './components/ReflectionQuestions';
import { GameComplete } from './components/GameComplete';
import { PictionaryGame } from './components/egypt/PictionaryGame';
import { CrosswordGame } from './components/persia/CrosswordGame';
import { levels } from './data/levels';
import { GameState } from './types';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    currentQuestionIndex: 0,
    score: 0,
    rewards: [],
    isGameOver: false,
    answeredCorrectly: new Array(levels[0].questions.length).fill(false),
    showingIntro: true,
    showLevelComplete: false,
    journalEntries: {},
    selectedLocation: null
  });

  const handleLocationSelect = (location: any) => {
    setGameState(prev => ({
      ...prev,
      selectedLocation: location,
      showingIntro: location.id === 'eden'
    }));
  };

  const handleIntroComplete = () => {
    setGameState(prev => ({ ...prev, showingIntro: false }));
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = levels[gameState.currentLevel].questions[gameState.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    setGameState(prev => {
      const newAnsweredCorrectly = [...prev.answeredCorrectly];
      newAnsweredCorrectly[prev.currentQuestionIndex] = isCorrect;

      return {
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        answeredCorrectly: newAnsweredCorrectly,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showLevelComplete: prev.currentQuestionIndex === levels[prev.currentLevel].questions.length - 1,
        isGameOver: prev.currentLevel === levels.length - 1 && 
                   prev.currentQuestionIndex === levels[prev.currentLevel].questions.length - 1
      };
    });
  };

  const handleContinue = () => {
    setGameState(prev => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      currentQuestionIndex: 0,
      showLevelComplete: false,
      answeredCorrectly: new Array(levels[prev.currentLevel + 1].questions.length).fill(false)
    }));
  };

  const handleReplay = () => {
    setGameState({
      currentLevel: 0,
      currentQuestionIndex: 0,
      score: 0,
      rewards: [],
      isGameOver: false,
      answeredCorrectly: new Array(levels[0].questions.length).fill(false),
      showingIntro: true,
      showLevelComplete: false,
      journalEntries: {},
      selectedLocation: gameState.selectedLocation
    });
  };

  const handleReturnToMap = () => {
    setGameState(prev => ({
      ...prev,
      selectedLocation: null
    }));
  };

  return (
    <AnimatePresence mode="wait">
      {!gameState.selectedLocation ? (
        <WorldMap onLocationSelect={handleLocationSelect} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-black py-12 px-4"
        >
          {gameState.showingIntro && <VideoIntro onComplete={handleIntroComplete} />}
          
          {gameState.selectedLocation.id === 'eden' && !gameState.showingIntro && (
            <div className="container mx-auto max-w-4xl">
              <ScoreBoard
                score={gameState.score}
                totalQuestions={levels[gameState.currentLevel].questions.length}
                rewards={gameState.rewards}
              />
              
              {!gameState.showLevelComplete && !gameState.isGameOver && (
                <QuestionCard
                  question={levels[gameState.currentLevel].questions[gameState.currentQuestionIndex]}
                  onAnswer={handleAnswer}
                  isAnswered={gameState.answeredCorrectly[gameState.currentQuestionIndex]}
                  gameType="fruits"
                />
              )}

              {gameState.showLevelComplete && !gameState.isGameOver && (
                <LevelComplete
                  level={gameState.currentLevel + 1}
                  score={gameState.score}
                  totalQuestions={levels[gameState.currentLevel].questions.length}
                  onContinue={handleContinue}
                  onReplay={handleReplay}
                />
              )}

              {gameState.isGameOver && (
                <GameComplete
                  score={gameState.score}
                  totalQuestions={levels[gameState.currentLevel].questions.length}
                  onReplay={handleReplay}
                  onReturnToMap={handleReturnToMap}
                />
              )}
            </div>
          )}
          
          {gameState.selectedLocation.id === 'egypt' && (
            <PictionaryGame onComplete={handleReturnToMap} />
          )}
          
          {gameState.selectedLocation.id === 'persia' && (
            <CrosswordGame onComplete={handleReturnToMap} />
          )}
          
          <button
            onClick={handleReturnToMap}
            className="fixed top-4 left-4 px-4 py-2 bg-black/80 backdrop-blur-sm rounded-lg shadow-md hover:bg-black transition-colors text-purple-200 border border-purple-500"
          >
            Back to Map
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;