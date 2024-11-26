import React from 'react';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import useSound from 'use-sound';
import { Loader2 } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  game: string;
  description: string;
  icon: string;
}

const locations: Location[] = [
  {
    id: 'eden',
    name: 'Garden of Eden',
    game: 'trivia',
    description: 'Test your knowledge of biblical fruits and trees',
    icon: '🌳'
  },
  {
    id: 'egypt',
    name: 'Ancient Egypt',
    game: 'pictionary',
    description: 'Draw and guess biblical scenes from Egypt',
    icon: '🏛️'
  },
  {
    id: 'persia',
    name: 'Persian Empire',
    game: 'puzzle',
    description: 'Solve riddles and puzzles from ancient Persia',
    icon: '🏰'
  }
];

interface WorldMapProps {
  onLocationSelect: (location: Location) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ onLocationSelect }) => {
  const [playSelect] = useSound('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3', { volume: 0.5 });

  const handleLocationSelect = (location: Location) => {
    playSelect();
    onLocationSelect(location);
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ReactPlayer
          url="https://www.youtube.com/watch?v=RqMzMjaHyGY"
          playing
          loop
          muted
          width="100%"
          height="100%"
          config={{
            youtube: {
              playerVars: {
                showinfo: 0,
                controls: 0,
                modestbranding: 1,
                end: 6,
                rel: 0
              }
            }
          }}
          style={{ pointerEvents: 'none' }}
        />
        <div className="absolute inset-0 bg-purple-900/80 backdrop-blur-sm" />
      </div>

      <div className="absolute inset-x-4 bottom-8 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-purple-900/90 backdrop-blur-sm p-4 md:p-8 rounded-xl shadow-xl border-2 border-purple-500 max-w-4xl w-full"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-purple-200 font-serif">
            Biblical World
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {locations.map((location) => (
              <motion.button
                key={location.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLocationSelect(location)}
                className="flex flex-col items-center gap-4 p-6 rounded-lg bg-purple-800/80 hover:bg-purple-700 transition-colors border border-purple-500"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center text-5xl md:text-6xl">
                  {location.icon}
                </div>
                <span className="font-serif text-xl text-purple-200">{location.name}</span>
                <span className="text-sm text-purple-300 text-center">{location.description}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};