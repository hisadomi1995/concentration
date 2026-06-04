import type { Card, Player, Score } from '@/types/game';

export function isPair(card1: Card, card2: Card): boolean {
  return card1.pairId === card2.pairId && card1.id !== card2.id;
}

export function isGameOver(cards: Card[]): boolean {
  return cards.every((card) => card.status === 'matched');
}

export function getWinner(score: Score): Player | 'draw' {
  if (score.human > score.computer) return 'human';
  if (score.computer > score.human) return 'computer';
  return 'draw';
}
