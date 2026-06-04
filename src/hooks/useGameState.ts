import { useReducer, useEffect } from 'react';
import { gameReducer } from '@/game/reducer';
import { selectCards } from '@/game/computerAI';
import { isPair } from '@/game/gameEngine';
import type { GameState, CardId } from '@/types/game';

const initialState: GameState = {
  cards: [],
  phase: 'idle',
  currentTurn: 'human',
  selectedCardIds: [],
  score: { human: 0, computer: 0 },
  computerMemory: {},
};

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Start game on mount
  useEffect(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  // Resolve pair after two cards are selected
  useEffect(() => {
    if (state.phase !== 'checking' || state.selectedCardIds.length !== 2) return;

    const [id1, id2] = state.selectedCardIds;
    const card1 = state.cards.find((c) => c.id === id1)!;
    const card2 = state.cards.find((c) => c.id === id2)!;
    const matched = isPair(card1, card2);

    const delay = matched ? 600 : 1200;
    const timer = setTimeout(() => {
      dispatch({ type: 'RESOLVE_PAIR', matched });
    }, delay);

    return () => clearTimeout(timer);
  }, [state.phase, state.selectedCardIds, state.cards]);

  // Computer's turn
  useEffect(() => {
    if (state.phase !== 'playing' || state.currentTurn !== 'computer') return;

    const [firstId, secondId] = selectCards(state.cards, state.computerMemory);

    const t1 = setTimeout(() => {
      const card = state.cards.find((c) => c.id === firstId)!;
      dispatch({ type: 'UPDATE_COMPUTER_MEMORY', cardId: firstId, emoji: card.emoji });
      dispatch({ type: 'COMPUTER_FLIP', cardId: firstId });
    }, 800);

    const t2 = setTimeout(() => {
      const card = state.cards.find((c) => c.id === secondId)!;
      dispatch({ type: 'UPDATE_COMPUTER_MEMORY', cardId: secondId, emoji: card.emoji });
      dispatch({ type: 'COMPUTER_FLIP', cardId: secondId });
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [state.phase, state.currentTurn, state.cards, state.computerMemory]);

  const handleCardClick = (cardId: CardId) => {
    if (state.phase !== 'playing') return;
    if (state.currentTurn !== 'human') return;
    if (state.selectedCardIds.length >= 2) return;

    const card = state.cards.find((c) => c.id === cardId);
    if (!card || card.status !== 'hidden') return;

    dispatch({ type: 'FLIP_CARD', cardId });
  };

  const handleRestart = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return { state, handleCardClick, handleRestart };
}
