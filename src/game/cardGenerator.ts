import type { Card } from '@/types/game';

const EMOJI_POOL = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐸', '🐮', '🐷', '🐙', '🦋',
  '🌸', '🌈', '⭐', '🍎', '🍊', '🍋', '🍇', '🍓',
];

const PAIR_COUNT = 8;

export function generateCards(): Card[] {
  const emojis = [...EMOJI_POOL].sort(() => Math.random() - 0.5).slice(0, PAIR_COUNT);

  const cards: Card[] = [];
  emojis.forEach((emoji, index) => {
    const pairId = `pair-${index}`;
    cards.push({ id: `card-${index * 2}`, emoji, pairId, status: 'hidden' });
    cards.push({ id: `card-${index * 2 + 1}`, emoji, pairId, status: 'hidden' });
  });

  return shuffleCards(cards);
}

export function shuffleCards(cards: Card[]): Card[] {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
