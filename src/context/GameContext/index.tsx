import React, { createContext, useContext } from 'react';

interface GameContextProps {
  estadoTabuleiro: (string | null)[];
  tabuleirosMenores: (string | null)[][];
  currentPlayer: 'X' | 'O';
  currentQuadrant: number | null;
  disabledQuadrants: boolean[];
  handleCellClick: (quadrantIndex: number, cellIndex: number) => void;
  calculateWinner: (squares: (string | null)[]) => string | null;
  currentTurn: string;
  gameStatus: 'waiting' | 'playing' | 'finished';
  opponentName: string | null;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext;