/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCrazyEights } from './hooks/useCrazyEights';
import Card from './components/Card';
import SuitSelector from './components/SuitSelector';
import GameOver from './components/GameOver';
import { SUIT_SYMBOLS, SUIT_COLORS } from './constants';
import { Play, Info, Layers } from 'lucide-react';

export default function App() {
  const { state, initGame, playCard, drawCard, selectWildSuit } = useCrazyEights();

  useEffect(() => {
    // Auto-start game for demo
    if (state.status === 'waiting') {
      initGame();
    }
  }, [state.status, initGame]);

  const topCard = state.discardPile[state.discardPile.length - 1];
  const effectiveSuit = state.wildSuit || (topCard ? topCard.suit : null);

  const canPlay = (card: any) => {
    if (!topCard) return false;
    if (card.rank === '8') return true;
    return card.suit === effectiveSuit || card.rank === topCard.rank;
  };

  const isPlayerTurn = state.currentTurn === 'player' && state.status === 'playing';

  return (
    <div className="min-h-screen bg-[#1a1c2c] text-white font-sans overflow-hidden selection:bg-indigo-500/30">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto h-screen flex flex-col p-4 sm:p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-black text-xl">8</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic">
              Tina <span className="text-indigo-400">Crazy 8s</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Current Turn</span>
              <span className={`text-sm font-bold ${state.currentTurn === 'player' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                {state.currentTurn === 'player' ? 'YOUR TURN' : 'AI THINKING...'}
              </span>
            </div>
            <button 
              onClick={() => initGame()}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
              title="Restart Game"
            >
              <RotateCcwIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Game Area */}
        <main className="flex-1 flex flex-col justify-between py-4">
          
          {/* AI Hand */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Opponent Hand ({state.aiHand.length})</span>
            </div>
            <div className="flex -space-x-8 sm:-space-x-12 overflow-visible">
              {state.aiHand.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card isBack className="scale-90 sm:scale-100" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Center: Deck and Discard Pile */}
          <div className="flex flex-col items-center justify-center gap-8 my-8">
            <div className="flex items-center gap-12 sm:gap-24">
              {/* Draw Pile */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative group">
                  <AnimatePresence>
                    {state.deck.length > 0 && (
                      <Card 
                        isBack 
                        onClick={isPlayerTurn ? () => drawCard('player') : undefined}
                        className={isPlayerTurn ? 'hover:ring-4 ring-indigo-500/50 transition-all' : ''}
                      />
                    )}
                  </AnimatePresence>
                  {/* Stack effect */}
                  <div className="absolute inset-0 -z-10 translate-x-1 translate-y-1 bg-indigo-800 rounded-lg border border-white/10"></div>
                  <div className="absolute inset-0 -z-20 translate-x-2 translate-y-2 bg-indigo-900 rounded-lg border border-white/10"></div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Draw Pile ({state.deck.length})</span>
              </div>

              {/* Discard Pile */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <AnimatePresence mode="popLayout">
                    {topCard && (
                      <Card 
                        key={topCard.id}
                        card={topCard} 
                        className="shadow-2xl shadow-black/50"
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Wild Suit Indicator */}
                  {state.wildSuit && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-indigo-500"
                    >
                      <span className={`text-xl ${SUIT_COLORS[state.wildSuit]}`}>
                        {SUIT_SYMBOLS[state.wildSuit]}
                      </span>
                    </motion.div>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Discard Pile</span>
              </div>
            </div>

            {/* Current Suit/Rank info for mobile */}
            {topCard && (
              <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Match:</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${SUIT_COLORS[effectiveSuit as any]}`}>
                    {SUIT_SYMBOLS[effectiveSuit as any]}
                  </span>
                  <span className="text-slate-300 font-mono">/</span>
                  <span className="text-lg font-bold text-white">{topCard.rank}</span>
                </div>
              </div>
            )}
          </div>

          {/* Player Hand */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isPlayerTurn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Your Hand ({state.playerHand.length})</span>
            </div>
            
            <div className="w-full overflow-x-auto pb-6 flex justify-center no-scrollbar">
              <div className="flex -space-x-6 sm:-space-x-8 px-8">
                {state.playerHand.map((card, i) => (
                  <motion.div
                    key={card.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card 
                      card={card} 
                      isPlayable={isPlayerTurn && canPlay(card)}
                      onClick={() => playCard(card.id, 'player')}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </main>

        {/* Modals */}
        <AnimatePresence>
          {state.status === 'selecting_suit' && state.currentTurn === 'player' && (
            <SuitSelector onSelect={selectWildSuit} />
          )}
          {state.status === 'game_over' && state.winner && (
            <GameOver winner={state.winner} onRestart={initGame} />
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <footer className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Info size={10} /> 8 is Wild</span>
            <span className="flex items-center gap-1"><Layers size={10} /> Match Suit or Rank</span>
          </div>
          <span>v1.0.0</span>
        </footer>
      </div>
    </div>
  );
}

function RotateCcwIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
