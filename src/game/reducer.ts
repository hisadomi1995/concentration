import type { GameState, GameAction } from '@/types/game';
import { generateCards } from './cardGenerator';
import { isPair, isGameOver } from './gameEngine';

const initialState: GameState = {
  cards: [],
  phase: 'idle',
  currentTurn: 'human',
  selectedCardIds: [],
  score: { human: 0, computer: 0 },
  computerMemory: {},
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
    case 'RESET_GAME':
      return {
        ...initialState,
        cards: generateCards(),
        phase: 'playing',
      };

    case 'FLIP_CARD':
    case 'COMPUTER_FLIP': {
      const newCards = state.cards.map((card) =>
        card.id === action.cardId ? { ...card, status: 'flipped' as const } : card
      );
      const newSelected = [...state.selectedCardIds, action.cardId];

      if (newSelected.length < 2) {
        return { ...state, cards: newCards, selectedCardIds: newSelected };
      }

      return { ...state, cards: newCards, selectedCardIds: newSelected, phase: 'checking' };
    }

    case 'UPDATE_COMPUTER_MEMORY':
      return {
        ...state,
        computerMemory: { ...state.computerMemory, [action.cardId]: action.emoji },
      };

    case 'RESOLVE_PAIR': {
      const [id1, id2] = state.selectedCardIds;
      const card1 = state.cards.find((c) => c.id === id1)!;
      const card2 = state.cards.find((c) => c.id === id2)!;
      const matched = action.matched && isPair(card1, card2);

      const newCards = state.cards.map((card) => {
        if (card.id === id1 || card.id === id2) {
          return { ...card, status: matched ? ('matched' as const) : ('hidden' as const) };
        }
        return card;
      });

      const newScore = matched
        ? {
            ...state.score,
            [state.currentTurn]: state.score[state.currentTurn] + 1,
          }
        : state.score;

      const gameOver = isGameOver(newCards);
      const nextTurn = matched ? state.currentTurn : state.currentTurn === 'human' ? 'computer' : 'human';

      return {
        ...state,
        cards: newCards,
        score: newScore,
        selectedCardIds: [],
        phase: gameOver ? 'finished' : 'playing',
        currentTurn: gameOver ? state.currentTurn : nextTurn,
      };
    }

    case 'END_GAME':
      return { ...state, phase: 'finished' };

    default:
      return state;
  }
}
