import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import useSound from 'use-sound';

interface QuestionTimerProps {
  onTimeout: () => void;
  isPlaying: boolean;
}

export const QuestionTimer: React.FC<QuestionTimerProps> = ({ onTimeout, isPlaying }) => {
  const [playTick] = useSound('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3', { volume: 0.5 });
  const [playTimeup] = useSound('https://assets.mixkit.co/active_storage/sfx/2004/2004-preview.mp3');

  return (
    <div className="absolute top-4 right-4">
      <CountdownCircleTimer
        isPlaying={isPlaying}
        duration={15}
        colors={['#22c55e', '#eab308', '#ef4444']}
        colorsTime={[15, 7, 0]}
        size={60}
        strokeWidth={6}
        onComplete={() => {
          playTimeup();
          onTimeout();
          return { shouldRepeat: false };
        }}
        onUpdate={(remainingTime) => {
          if (remainingTime <= 5 && remainingTime > 0) {
            playTick();
          }
        }}
      >
        {({ remainingTime }) => (
          <div className="text-xl font-bold">
            {remainingTime}
          </div>
        )}
      </CountdownCircleTimer>
    </div>
  );
};