import type { Card as CardType } from '@/types/game';
import './Card.css';

interface Props {
  card: CardType;
  onClick: (id: string) => void;
  isComputerSelected?: boolean;
}

export function Card({ card, onClick, isComputerSelected = false }: Props) {
  const isFlipped = card.status === 'flipped' || card.status === 'matched';
  const isMatched = card.status === 'matched';

  return (
    <div
      className={`card ${isFlipped ? 'card--flipped' : ''} ${isMatched ? 'card--matched' : ''} ${isComputerSelected ? 'card--computer-selected' : ''}`}
      onClick={() => card.status === 'hidden' && onClick(card.id)}
      role="button"
      aria-label={isMatched ? `マッチ済み: ${card.emoji}` : isFlipped ? `選択中: ${card.emoji}` : 'カード 裏向き'}
      aria-disabled={card.status !== 'hidden'}
      tabIndex={card.status === 'hidden' ? 0 : -1}
      onKeyDown={(e) => e.key === 'Enter' && card.status === 'hidden' && onClick(card.id)}
    >
      <div className="card__inner">
        <div className="card__back">🂠</div>
        <div className="card__front">{card.emoji}</div>
      </div>
    </div>
  );
}
