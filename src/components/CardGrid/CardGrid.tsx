import { Card } from '@/components/Card/Card';
import type { Card as CardType, CardId } from '@/types/game';
import './CardGrid.css';

interface Props {
  cards: CardType[];
  onCardClick: (id: CardId) => void;
  computerSelectedIds?: CardId[];
}

export function CardGrid({ cards, onCardClick, computerSelectedIds = [] }: Props) {
  return (
    <div className="card-grid">
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onClick={onCardClick}
          isComputerSelected={computerSelectedIds.includes(card.id)}
        />
      ))}
    </div>
  );
}
