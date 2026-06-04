import { ScorePanel } from '@/components/ScorePanel/ScorePanel';
import { CardGrid } from '@/components/CardGrid/CardGrid';
import type { GameState, CardId } from '@/types/game';
import './GameBoard.css';

interface Props {
  state: GameState;
  onCardClick: (id: CardId) => void;
}

export function GameBoard({ state, onCardClick }: Props) {
  return (
    <div className="game-board">
      <ScorePanel score={state.score} currentTurn={state.currentTurn} phase={state.phase} />
      <CardGrid
        cards={state.cards}
        onCardClick={onCardClick}
        computerSelectedIds={state.currentTurn === 'computer' ? state.selectedCardIds : []}
      />
    </div>
  );
}
