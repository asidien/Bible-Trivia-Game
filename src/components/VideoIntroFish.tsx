import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';
import useSound from 'use-sound';
import { X } from 'lucide-react';

interface VideoIntroProps {
  onComplete: () => void;
}

export const VideoIntroFish: React.FC<VideoIntroProps> = ({ onComplete }) => {
  const [isVideoEnding, setIsVideoEnding] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSkip, setShowSkip] = useState(true);
  const [playEntrance] = useSound('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(true);
      playEntrance();
    }, 4000);

    return () => clearTimeout(timer);
  }, [playEntrance]);

  const handleVideoEnd = () => {
    setIsVideoEnding(true);
    setShowSkip(false);
    setTimeout(onComplete, 1000);
  };

  const handleSkip = () => {
    setIsVideoEnding(true);
    setShowSkip(false);
    setTimeout(onComplete, 500);
  };

  return (
    <div className={`fixed inset-0 bg-black z-50 transition-opacity duration-1000 ${isVideoEnding ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0">
        <ReactPlayer
          url="https://www.youtube.com/shorts/_PRwAu6eMZA"
          playing
          width="100%"
          height="100%"
          onEnded={handleVideoEnd}
          controls={false}
          config={{
            youtube: {
              playerVars: {
                showinfo: 0,
                rel: 0,
                modestbranding: 1,
                autoplay: 1,
                mute: 0,
                controls: 0
              }
            }
          }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
        {showTitle && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-x-0 top-[60%] flex items-center justify-center"
          >
            <h1 className="text-6xl font-bold text-white text-center drop-shadow-lg">
              TRIVIA TIME - FISH
            </h1>
          </motion.div>
        )}
        {showSkip && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
            className="absolute bottom-8 right-8 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm flex items-center gap-2 transition-colors"
          >
            Skip <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
};