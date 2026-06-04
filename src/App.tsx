import { useGameState } from '@/hooks/useGameState';
import { GameBoard } from '@/components/GameBoard/GameBoard';
import { GameResult } from '@/components/GameResult/GameResult';
import './App.css';

function App() {
  const { state, handleCardClick, handleRestart } = useGameState();

  return (
    <div className="app">
      <h1 className="app__title">神経衰弱</h1>
      {state.phase === 'finished' ? (
        <GameResult score={state.score} onRestart={handleRestart} />
      ) : (
        <GameBoard state={state} onCardClick={handleCardClick} />
      )}
    </div>
  );
}

export default App;
