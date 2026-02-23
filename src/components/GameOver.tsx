
import React from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameOverProps {
  winner: 'player' | 'ai';
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ winner, onRestart }) => {
  const isPlayer = winner === 'player';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl p-10 shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
      >
        <div className={`absolute top-0 left-0 w-full h-2 ${isPlayer ? 'bg-emerald-500' : 'bg-red-500'}`} />
        
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${isPlayer ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
          <Trophy size={40} />
        </div>

        <h2 className="text-3xl font-black mb-2 text-slate-900">
          {isPlayer ? 'YOU WIN!' : 'AI WINS!'}
        </h2>
        <p className="text-slate-500 mb-8">
          {isPlayer ? 'Incredible strategy! You cleared your hand first.' : 'Better luck next time! The AI was too fast.'}
        </p>

        <button
          onClick={onRestart}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
        >
          <RotateCcw size={20} />
          Play Again
        </button>
      </motion.div>
    </div>
  );
};

export default GameOver;
