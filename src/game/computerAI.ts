import type { Card, CardId } from '@/types/game';

export function selectCards(
  cards: Card[],
  memory: Record<CardId, string>
): [CardId, CardId] {
  const hiddenCards = cards.filter((c) => c.status === 'hidden');

  // Find a known pair in memory
  const memoryEntries = Object.entries(memory).filter(([id]) =>
    hiddenCards.some((c) => c.id === id)
  );

  for (const [id1, emoji1] of memoryEntries) {
    const match = memoryEntries.find(([id2, emoji2]) => id2 !== id1 && emoji2 === emoji1);
    if (match) {
      return [id1, match[0]];
    }
  }

  // No known pair — pick randomly
  const shuffled = [...hiddenCards].sort(() => Math.random() - 0.5);

  // If first pick is already in memory, prefer an unknown card for the second
  const first = shuffled[0];
  const firstEmoji = memory[first.id];

  if (firstEmoji) {
    const knownMatch = hiddenCards.find(
      (c) => c.id !== first.id && memory[c.id] === firstEmoji
    );
    if (knownMatch) return [first.id, knownMatch.id];
  }

  const second = shuffled.find((c) => c.id !== first.id)!;
  return [first.id, second.id];
}
