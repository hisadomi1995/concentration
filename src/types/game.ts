export type CardId = string;

export type CardStatus = 'hidden' | 'flipped' | 'matched';

export interface Card {
  id: CardId;
  emoji: string;
  pairId: string;
  status: CardStatus;
}

export type Player = 'human' | 'computer';

export type GamePhase = 'idle' | 'playing' | 'checking' | 'finished';

export interface Score {
  human: number;
  computer: number;
}

export interface GameState {
  cards: Card[];
  phase: GamePhase;
  currentTurn: Player;
  selectedCardIds: CardId[];
  score: Score;
  computerMemory: Record<CardId, string>;
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'FLIP_CARD'; cardId: CardId }
  | { type: 'RESOLVE_PAIR'; matched: boolean }
  | { type: 'COMPUTER_FLIP'; cardId: CardId }
  | { type: 'UPDATE_COMPUTER_MEMORY'; cardId: CardId; emoji: string }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' };
