import { describe, it, expect } from 'vitest';
import { generateCards, shuffleCards } from './cardGenerator';

describe('generateCards', () => {
  it('generates 16 cards', () => {
    const cards = generateCards();
    expect(cards).toHaveLength(16);
  });

  it('generates exactly 8 pairs', () => {
    const cards = generateCards();
    const pairIds = cards.map((c) => c.pairId);
    const pairCounts = pairIds.reduce<Record<string, number>>((acc, id) => {
      acc[id] = (acc[id] ?? 0) + 1;
      return acc;
    }, {});
    const pairs = Object.values(pairCounts);
    expect(pairs).toHaveLength(8);
    pairs.forEach((count) => expect(count).toBe(2));
  });

  it('all cards start hidden', () => {
    const cards = generateCards();
    cards.forEach((card) => expect(card.status).toBe('hidden'));
  });

  it('all card ids are unique', () => {
    const cards = generateCards();
    const ids = new Set(cards.map((c) => c.id));
    expect(ids.size).toBe(16);
  });
});

describe('shuffleCards', () => {
  it('returns the same number of cards', () => {
    const cards = generateCards();
    const shuffled = shuffleCards(cards);
    expect(shuffled).toHaveLength(cards.length);
  });

  it('contains all original pairIds after shuffle', () => {
    const cards = generateCards();
    const original = new Set(cards.map((c) => c.pairId));
    const shuffled = shuffleCards(cards);
    const after = new Set(shuffled.map((c) => c.pairId));
    original.forEach((id) => expect(after.has(id)).toBe(true));
  });

  it('does not mutate the original array', () => {
    const cards = generateCards();
    const copy = [...cards];
    shuffleCards(cards);
    expect(cards).toEqual(copy);
  });
});
