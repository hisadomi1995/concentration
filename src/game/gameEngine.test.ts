import { describe, it, expect } from 'vitest';
import { isPair, isGameOver, getWinner } from './gameEngine';
import type { Card, Score } from '@/types/game';

const makeCard = (id: string, pairId: string, status: Card['status'] = 'hidden'): Card => ({
  id,
  emoji: '🐶',
  pairId,
  status,
});

describe('isPair', () => {
  it('returns true for two cards with the same pairId', () => {
    const a = makeCard('card-0', 'pair-0');
    const b = makeCard('card-1', 'pair-0');
    expect(isPair(a, b)).toBe(true);
  });

  it('returns false for two cards with different pairIds', () => {
    const a = makeCard('card-0', 'pair-0');
    const b = makeCard('card-2', 'pair-1');
    expect(isPair(a, b)).toBe(false);
  });

  it('returns false when comparing a card with itself', () => {
    const a = makeCard('card-0', 'pair-0');
    expect(isPair(a, a)).toBe(false);
  });
});

describe('isGameOver', () => {
  it('returns true when all cards are matched', () => {
    const cards = [makeCard('c0', 'p0', 'matched'), makeCard('c1', 'p0', 'matched')];
    expect(isGameOver(cards)).toBe(true);
  });

  it('returns false when some cards are hidden', () => {
    const cards = [makeCard('c0', 'p0', 'matched'), makeCard('c1', 'p1', 'hidden')];
    expect(isGameOver(cards)).toBe(false);
  });

  it('returns false when some cards are flipped', () => {
    const cards = [makeCard('c0', 'p0', 'matched'), makeCard('c1', 'p1', 'flipped')];
    expect(isGameOver(cards)).toBe(false);
  });
});

describe('getWinner', () => {
  it('returns human when human score is higher', () => {
    const score: Score = { human: 5, computer: 3 };
    expect(getWinner(score)).toBe('human');
  });

  it('returns computer when computer score is higher', () => {
    const score: Score = { human: 2, computer: 6 };
    expect(getWinner(score)).toBe('computer');
  });

  it('returns draw when scores are equal', () => {
    const score: Score = { human: 4, computer: 4 };
    expect(getWinner(score)).toBe('draw');
  });
});
