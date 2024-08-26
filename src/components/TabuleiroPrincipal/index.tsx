import React from 'react';
import TabuleiroMenor from '../TabuleiroMenor';
import { useGame } from '@/context/GameContext';
import GameStatus from '../GameStatus';

const TabuleiroPrincipal: React.FC = () => {
  const { 
    estadoTabuleiro, 
    tabuleirosMenores, 
    currentQuadrant, 
    calculateWinner, 
    currentTurn, 
    currentPlayer, 
    gameStatus 
  } = useGame();

  const winner = calculateWinner(estadoTabuleiro);
  const isPlayerTurn = currentTurn === currentPlayer;

  if (gameStatus === 'waiting') {
    return <div className="text-2xl font-bold">Aguardando oponente...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`grid grid-cols-3 gap-4 ${isPlayerTurn ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
        {estadoTabuleiro.map((valor, index) => (
          <div key={index} className={`relative ${currentQuadrant !== null && currentQuadrant !== index ? 'pointer-events-none opacity-50' : ''}`}>
            <TabuleiroMenor
              index={index}
              tabuleiro={tabuleirosMenores[index]}
              isDisabled={currentQuadrant !== null && currentQuadrant !== index || winner !== null || !isPlayerTurn}
            />
            {valor && (
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-500">
                {valor}
              </div>
            )}
          </div>
        ))}
      </div>
      <GameStatus winner={winner} currentTurn={currentTurn} />
    </div>
  );
};

export default TabuleiroPrincipal;