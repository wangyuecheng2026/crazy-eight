
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Suit } from '../types';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../constants';

interface SuitSelectorProps {
  onSelect: (suit: Suit) => void;
}

const SuitSelector: React.FC<SuitSelectorProps> = ({ onSelect }) => {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Choose a Suit</h2>
        <div className="grid grid-cols-2 gap-4">
          {suits.map((suit) => (
            <button
              key={suit}
              onClick={() => onSelect(suit)}
              className={`p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center gap-2 group`}
            >
              <span className={`text-5xl ${SUIT_COLORS[suit]} group-hover:scale-110 transition-transform`}>
                {SUIT_SYMBOLS[suit]}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                {suit}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SuitSelector;
