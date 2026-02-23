
import { useState, useCallback, useEffect } from 'react';
import { CardData, GameState, Suit, Rank, GameStatus } from '../types';
import { SUITS, RANKS } from '../constants';

const createDeck = (): CardData[] => {
  const deck: CardData[] = [];
  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      deck.push({ id: `${rank}-${suit}`, suit, rank });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

export const useCrazyEights = () => {
  const [state, setState] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHand: [],
    discardPile: [],
    currentTurn: 'player',
    status: 'waiting',
    wildSuit: null,
    winner: null,
  });

  const initGame = useCallback(() => {
    const fullDeck = createDeck();
    const playerHand = fullDeck.splice(0, 8);
    const aiHand = fullDeck.splice(0, 8);
    
    // Ensure first card in discard pile is not an 8
    let firstCardIndex = 0;
    while (fullDeck[firstCardIndex].rank === '8') {
      firstCardIndex++;
    }
    const discardPile = [fullDeck.splice(firstCardIndex, 1)[0]];

    setState({
      deck: fullDeck,
      playerHand,
      aiHand,
      discardPile,
      currentTurn: 'player',
      status: 'playing',
      wildSuit: null,
      winner: null,
    });
  }, []);

  const drawCard = useCallback((target: 'player' | 'ai') => {
    setState((prev) => {
      if (prev.deck.length === 0) {
        // If deck is empty, skip turn
        return { ...prev, currentTurn: prev.currentTurn === 'player' ? 'ai' : 'player' };
      }

      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop()!;
      
      const newState = {
        ...prev,
        deck: newDeck,
        [target === 'player' ? 'playerHand' : 'aiHand']: [...prev[target === 'player' ? 'playerHand' : 'aiHand'], drawnCard],
      };

      // Check if the drawn card can be played immediately (optional rule, but let's keep it simple: draw and end turn if no play)
      // For now, drawing ends the turn if the card is not playable.
      // Actually, standard rules often allow playing if you just drew a playable card.
      // But let's stick to: draw one, if you can't play, turn ends.
      
      const topCard = prev.discardPile[prev.discardPile.length - 1];
      const effectiveSuit = prev.wildSuit || topCard.suit;
      
      const canPlayDrawn = drawnCard.rank === '8' || drawnCard.rank === topCard.rank || drawnCard.suit === effectiveSuit;

      if (!canPlayPlayable(drawnCard, topCard, prev.wildSuit)) {
         return { ...newState, currentTurn: target === 'player' ? 'ai' : 'player' };
      }
      
      return newState;
    });
  }, []);

  const canPlayPlayable = (card: CardData, topCard: CardData, wildSuit: Suit | null) => {
    if (card.rank === '8') return true;
    const effectiveSuit = wildSuit || topCard.suit;
    return card.suit === effectiveSuit || card.rank === topCard.rank;
  };

  const playCard = useCallback((cardId: string, target: 'player' | 'ai') => {
    setState((prev) => {
      const handKey = target === 'player' ? 'playerHand' : 'aiHand';
      const card = prev[handKey].find((c) => c.id === cardId);
      if (!card) return prev;

      const topCard = prev.discardPile[prev.discardPile.length - 1];
      if (!canPlayPlayable(card, topCard, prev.wildSuit)) return prev;

      const newHand = prev[handKey].filter((c) => c.id !== cardId);
      const newDiscardPile = [...prev.discardPile, card];
      
      let nextStatus: GameStatus = 'playing';
      let nextTurn = prev.currentTurn === 'player' ? 'ai' : 'player';
      let nextWildSuit = null;

      if (card.rank === '8') {
        nextStatus = 'selecting_suit';
        // If AI plays 8, we'll handle suit selection automatically
      }

      if (newHand.length === 0) {
        return {
          ...prev,
          [handKey]: newHand,
          discardPile: newDiscardPile,
          status: 'game_over',
          winner: target,
        };
      }

      return {
        ...prev,
        [handKey]: newHand,
        discardPile: newDiscardPile,
        status: nextStatus,
        currentTurn: card.rank === '8' ? prev.currentTurn : nextTurn, // Keep turn if selecting suit
        wildSuit: nextWildSuit,
      };
    });
  }, []);

  const selectWildSuit = useCallback((suit: Suit) => {
    setState((prev) => ({
      ...prev,
      wildSuit: suit,
      status: 'playing',
      currentTurn: prev.currentTurn === 'player' ? 'ai' : 'player',
    }));
  }, []);

  // AI Logic
  useEffect(() => {
    if (state.status === 'playing' && state.currentTurn === 'ai') {
      const timer = setTimeout(() => {
        const topCard = state.discardPile[state.discardPile.length - 1];
        const playableCards = state.aiHand.filter((c) => canPlayPlayable(c, topCard, state.wildSuit));

        if (playableCards.length > 0) {
          // AI Strategy: Play non-8s first
          const nonEight = playableCards.find(c => c.rank !== '8');
          const cardToPlay = nonEight || playableCards[0];
          playCard(cardToPlay.id, 'ai');
        } else if (state.deck.length > 0) {
          drawCard('ai');
        } else {
          // Skip turn
          setState(prev => ({ ...prev, currentTurn: 'player' }));
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.status, state.currentTurn, state.aiHand, state.discardPile, state.wildSuit, state.deck.length, playCard, drawCard]);

  // Handle AI suit selection
  useEffect(() => {
    if (state.status === 'selecting_suit' && state.currentTurn === 'ai') {
      const timer = setTimeout(() => {
        // AI selects the suit it has the most of
        const suitCounts: Record<Suit, number> = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
        state.aiHand.forEach(c => suitCounts[c.suit]++);
        const bestSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => suitCounts[a] > suitCounts[b] ? a : b);
        selectWildSuit(bestSuit);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.status, state.currentTurn, state.aiHand, selectWildSuit]);

  return {
    state,
    initGame,
    playCard,
    drawCard,
    selectWildSuit,
  };
};
