import React from 'react';
import { useGame } from '@/context/GameContext';

interface GameStatusProps {
  winner: string | null;
  currentTurn: string;
}

const GameStatus: React.FC<GameStatusProps> = ({ winner, currentTurn }) => {
  const { gameStatus, opponentName } = useGame();

  if (gameStatus === 'waiting') {
    return <h2 className="text-2xl font-bold mt-4">Aguardando oponente...</h2>;
  }

  if (winner) {
    return <h2 className="text-2xl font-bold mt-4">Jogador {winner} venceu!</h2>;
  }

  if (gameStatus === 'playing') {
    return (
      <div className="text-2xl font-bold mt-4">
        <h2>Vez do jogador {currentTurn}</h2>
        {opponentName && <p className="text-lg">Oponente: {opponentName}</p>}
      </div>
    );
  }

  if (gameStatus === 'finished') {
    return <h2 className="text-2xl font-bold mt-4">Jogo finalizado. Oponente desconectado.</h2>;
  }

  return null;
};

export default GameStatus;