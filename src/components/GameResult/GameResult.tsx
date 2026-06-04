import { getWinner } from '@/game/gameEngine';
import type { Score } from '@/types/game';
import './GameResult.css';

interface Props {
  score: Score;
  onRestart: () => void;
}

const RESULT_TEXT: Record<string, string> = {
  human: '🎉 あなたの勝ち！',
  computer: '🤖 コンピューターの勝ち',
  draw: '🤝 引き分け',
};

export function GameResult({ score, onRestart }: Props) {
  const winner = getWinner(score);

  return (
    <div className="game-result">
      <h2 className="game-result__title">{RESULT_TEXT[winner]}</h2>
      <div className="game-result__scores">
        <span>あなた: {score.human} ペア</span>
        <span>コンピューター: {score.computer} ペア</span>
      </div>
      <button className="game-result__button" onClick={onRestart}>
        もう一度プレイ
      </button>
    </div>
  );
}
