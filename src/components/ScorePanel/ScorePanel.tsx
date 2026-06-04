import type { Player, Score } from '@/types/game';
import './ScorePanel.css';

interface Props {
  score: Score;
  currentTurn: Player;
  phase: string;
}

export function ScorePanel({ score, currentTurn, phase }: Props) {
  const isPlaying = phase === 'playing' || phase === 'checking';

  return (
    <div className="score-panel">
      <div className={`score-panel__player ${isPlaying && currentTurn === 'human' ? 'score-panel__player--active' : ''}`}>
        <span className="score-panel__label">あなた</span>
        <span className="score-panel__score">{score.human}</span>
        {isPlaying && currentTurn === 'human' && <span className="score-panel__turn-badge">ターン</span>}
      </div>

      <div className="score-panel__divider">VS</div>

      <div className={`score-panel__player ${isPlaying && currentTurn === 'computer' ? 'score-panel__player--active' : ''}`}>
        <span className="score-panel__label">コンピューター</span>
        <span className="score-panel__score">{score.computer}</span>
        {isPlaying && currentTurn === 'computer' && <span className="score-panel__turn-badge">ターン</span>}
      </div>
    </div>
  );
}
