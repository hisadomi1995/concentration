import { describe, it, expect } from 'vitest';
import { gameReducer } from './reducer';
import type { GameState, Card } from '@/types/game';

const makeCard = (id: string, pairId: string, status: Card['status'] = 'hidden'): Card => ({
  id,
  emoji: '🐶',
  pairId,
  status,
});

const baseState: GameState = {
  cards: [
    makeCard('c0', 'p0'),
    makeCard('c1', 'p0'),
    makeCard('c2', 'p1'),
    makeCard('c3', 'p1'),
  ],
  phase: 'playing',
  currentTurn: 'human',
  selectedCardIds: [],
  score: { human: 0, computer: 0 },
  computerMemory: {},
};

describe('START_GAME / RESET_GAME', () => {
  it('generates 16 cards and sets phase to playing', () => {
    const state = gameReducer(baseState, { type: 'START_GAME' });
    expect(state.cards).toHaveLength(16);
    expect(state.phase).toBe('playing');
    expect(state.selectedCardIds).toHaveLength(0);
    expect(state.score).toEqual({ human: 0, computer: 0 });
  });
});

describe('FLIP_CARD', () => {
  it('flips the card and adds to selectedCardIds', () => {
    const state = gameReducer(baseState, { type: 'FLIP_CARD', cardId: 'c0' });
    expect(state.cards.find((c) => c.id === 'c0')?.status).toBe('flipped');
    expect(state.selectedCardIds).toEqual(['c0']);
    expect(state.phase).toBe('playing');
  });

  it('sets phase to checking when 2nd card is flipped', () => {
    const s1 = gameReducer(baseState, { type: 'FLIP_CARD', cardId: 'c0' });
    const s2 = gameReducer(s1, { type: 'FLIP_CARD', cardId: 'c2' });
    expect(s2.selectedCardIds).toHaveLength(2);
    expect(s2.phase).toBe('checking');
  });
});

describe('RESOLVE_PAIR - matched', () => {
  it('marks cards as matched and increases score', () => {
    const s1 = gameReducer(baseState, { type: 'FLIP_CARD', cardId: 'c0' });
    const s2 = gameReducer(s1, { type: 'FLIP_CARD', cardId: 'c1' });
    const s3 = gameReducer(s2, { type: 'RESOLVE_PAIR', matched: true });

    expect(s3.cards.find((c) => c.id === 'c0')?.status).toBe('matched');
    expect(s3.cards.find((c) => c.id === 'c1')?.status).toBe('matched');
    expect(s3.score.human).toBe(1);
    expect(s3.selectedCardIds).toHaveLength(0);
    expect(s3.currentTurn).toBe('human');
  });
});

describe('RESOLVE_PAIR - not matched', () => {
  it('flips cards back to hidden and changes turn', () => {
    const s1 = gameReducer(baseState, { type: 'FLIP_CARD', cardId: 'c0' });
    const s2 = gameReducer(s1, { type: 'FLIP_CARD', cardId: 'c2' });
    const s3 = gameReducer(s2, { type: 'RESOLVE_PAIR', matched: false });

    expect(s3.cards.find((c) => c.id === 'c0')?.status).toBe('hidden');
    expect(s3.cards.find((c) => c.id === 'c2')?.status).toBe('hidden');
    expect(s3.score.human).toBe(0);
    expect(s3.selectedCardIds).toHaveLength(0);
    expect(s3.currentTurn).toBe('computer');
  });
});

describe('game over', () => {
  it('sets phase to finished when all cards are matched', () => {
    const allMatchedState: GameState = {
      ...baseState,
      cards: [
        makeCard('c0', 'p0', 'matched'),
        makeCard('c1', 'p0', 'matched'),
        makeCard('c2', 'p1', 'flipped'),
        makeCard('c3', 'p1', 'flipped'),
      ],
      selectedCardIds: ['c2', 'c3'],
      phase: 'checking',
    };
    const final = gameReducer(allMatchedState, { type: 'RESOLVE_PAIR', matched: true });
    expect(final.phase).toBe('finished');
  });
});

describe('UPDATE_COMPUTER_MEMORY', () => {
  it('stores card emoji in computerMemory', () => {
    const state = gameReducer(baseState, {
      type: 'UPDATE_COMPUTER_MEMORY',
      cardId: 'c0',
      emoji: '🐶',
    });
    expect(state.computerMemory['c0']).toBe('🐶');
  });
});
