
import React from 'react';
import { motion } from 'motion/react';
import { CardData, Suit } from '../types';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../constants';

interface CardProps {
  card?: CardData;
  isBack?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({ card, isBack, onClick, isPlayable, className = '' }) => {
  if (isBack) {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        className={`w-16 h-24 sm:w-24 sm:h-36 bg-indigo-600 rounded-lg border-2 border-white shadow-lg flex items-center justify-center cursor-pointer overflow-hidden relative ${className}`}
        onClick={onClick}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="text-white font-bold text-2xl opacity-40">8</div>
      </motion.div>
    );
  }

  if (!card) return null;

  const colorClass = SUIT_COLORS[card.suit];
  const symbol = SUIT_SYMBOLS[card.suit];

  return (
    <motion.div
      layoutId={card.id}
      whileHover={isPlayable ? { y: -10, scale: 1.05 } : {}}
      className={`w-16 h-24 sm:w-24 sm:h-36 bg-white rounded-lg border-2 ${isPlayable ? 'border-emerald-400 cursor-pointer' : 'border-slate-200'} shadow-md flex flex-col p-2 select-none relative ${className}`}
      onClick={isPlayable ? onClick : undefined}
    >
      <div className={`text-sm sm:text-lg font-bold ${colorClass} flex flex-col leading-none`}>
        <span>{card.rank}</span>
        <span className="text-xs sm:text-sm">{symbol}</span>
      </div>
      
      <div className={`flex-1 flex items-center justify-center text-2xl sm:text-4xl ${colorClass}`}>
        {symbol}
      </div>

      <div className={`text-sm sm:text-lg font-bold ${colorClass} flex flex-col leading-none rotate-180 items-end`}>
        <span>{card.rank}</span>
        <span className="text-xs sm:text-sm">{symbol}</span>
      </div>

      {isPlayable && (
        <div className="absolute inset-0 rounded-lg ring-2 ring-emerald-400 ring-opacity-50 pointer-events-none animate-pulse"></div>
      )}
    </motion.div>
  );
};

export default Card;
