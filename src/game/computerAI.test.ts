import { describe, it, expect } from 'vitest';
import { selectCards } from './computerAI';
import type { Card } from '@/types/game';

const makeCard = (id: string, pairId: string, emoji: string, status: Card['status'] = 'hidden'): Card => ({
  id,
  emoji,
  pairId,
  status,
});

describe('selectCards', () => {
  it('selects a known matching pair from memory', () => {
    const cards = [
      makeCard('c0', 'p0', '🐶'),
      makeCard('c1', 'p0', '🐶'),
      makeCard('c2', 'p1', '🐱'),
      makeCard('c3', 'p1', '🐱'),
    ];
    const memory = { c0: '🐶', c1: '🐶' };
    const [id1, id2] = selectCards(cards, memory);
    const selected = new Set([id1, id2]);
    expect(selected.has('c0')).toBe(true);
    expect(selected.has('c1')).toBe(true);
  });

  it('returns two different card ids', () => {
    const cards = [
      makeCard('c0', 'p0', '🐶'),
      makeCard('c1', 'p0', '🐶'),
      makeCard('c2', 'p1', '🐱'),
      makeCard('c3', 'p1', '🐱'),
    ];
    const [id1, id2] = selectCards(cards, {});
    expect(id1).not.toBe(id2);
  });

  it('only selects from hidden cards', () => {
    const cards = [
      makeCard('c0', 'p0', '🐶', 'matched'),
      makeCard('c1', 'p0', '🐶', 'matched'),
      makeCard('c2', 'p1', '🐱'),
      makeCard('c3', 'p1', '🐱'),
    ];
    const [id1, id2] = selectCards(cards, {});
    expect(id1).not.toBe('c0');
    expect(id1).not.toBe('c1');
    expect(id2).not.toBe('c0');
    expect(id2).not.toBe('c1');
  });

  it('uses memory to select the known match for the first card', () => {
    const cards = [
      makeCard('c0', 'p0', '🐶'),
      makeCard('c1', 'p0', '🐶'),
      makeCard('c2', 'p1', '🐱'),
      makeCard('c3', 'p1', '🐱'),
    ];
    // Only c0 and c2 are in memory, they don't match
    // c0 and c1 are a pair but only c0 is known
    const memory = { c0: '🐶', c2: '🐱' };
    const [id1, id2] = selectCards(cards, memory);
    expect(id1).not.toBe(id2);
  });
});
