'use client';

import React, { useState, ReactNode, useCallback, useMemo } from 'react';
import GameContext from '../GameContext';

export const LocalGameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [estadoTabuleiro, setEstadoTabuleiro] = useState<(string | null)[]>(Array(9).fill(null));
  const [tabuleirosMenores, setTabuleirosMenores] = useState<(string | null)[][]>(
    Array(9).fill(null).map(() => Array(9).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [currentQuadrant, setCurrentQuadrant] = useState<number | null>(null);

  const calculateWinner = useCallback((squares: (string | null)[]): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }, []);

  const handleCellClick = useCallback((quadrantIndex: number, cellIndex: number) => {
    if (currentQuadrant !== null && currentQuadrant !== quadrantIndex) return;
    if (estadoTabuleiro[quadrantIndex] || tabuleirosMenores[quadrantIndex][cellIndex]) return;

    const newTabuleirosMenores = tabuleirosMenores.map((tabuleiro, index) => 
      index === quadrantIndex ? [...tabuleiro] : tabuleiro
    );
    newTabuleirosMenores[quadrantIndex][cellIndex] = currentPlayer;
    setTabuleirosMenores(newTabuleirosMenores);

    const quadrantWinner = calculateWinner(newTabuleirosMenores[quadrantIndex]);
    if (quadrantWinner) {
      const newEstadoTabuleiro = [...estadoTabuleiro];
      newEstadoTabuleiro[quadrantIndex] = quadrantWinner;
      setEstadoTabuleiro(newEstadoTabuleiro);
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    setCurrentQuadrant(estadoTabuleiro[cellIndex] ? null : cellIndex);
  }, [currentQuadrant, estadoTabuleiro, tabuleirosMenores, currentPlayer, calculateWinner]);

  const disabledQuadrants = useMemo(() => 
    estadoTabuleiro.map(quadrant => quadrant !== null),
    [estadoTabuleiro]
  );

  return (
    <GameContext.Provider
      value={{
        estadoTabuleiro,
        tabuleirosMenores,
        currentPlayer,
        currentQuadrant,
        disabledQuadrants,
        handleCellClick,
        calculateWinner,
        currentTurn: currentPlayer,
        gameStatus: 'playing',
        opponentName: null,
        createGame: () => {},
        joinGame: () => {},
        playAgain: () => {},
        getAvailableGames: () => {},
        availableGames: [],
      }}
    >
      {children}
    </GameContext.Provider>
  );
};