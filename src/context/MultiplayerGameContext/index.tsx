import React, { useState, ReactNode, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import GameContext from '../GameContext';

interface MultiplayerGameProviderProps {
  children: ReactNode;
  gameId: string;
  playerName: string;
}

export const MultiplayerGameProvider: React.FC<MultiplayerGameProviderProps> = ({ children, gameId, playerName }) => {
  const [estadoTabuleiro, setEstadoTabuleiro] = useState<(string | null)[]>(Array(9).fill(null));
  const [tabuleirosMenores, setTabuleirosMenores] = useState<(string | null)[][]>(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [currentQuadrant, setCurrentQuadrant] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState<string>('X');
  const [opponentName, setOpponentName] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [socket, setSocket] = useState<Socket | null>(null);

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

  const handleCellClick = (quadrantIndex: number, cellIndex: number) => {
    if (socket && gameStatus === 'playing' && currentTurn === currentPlayer) {
      socket.emit('make_move', {
        gameId,
        move: { quadrant: quadrantIndex, cell: cellIndex }
      });
    }
  };

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socketio');
      const newSocket = io();
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to server');
        newSocket.emit('join_game', { gameId, playerName });
      });

      newSocket.on('waiting_for_opponent', () => {
        setGameStatus('waiting');
      });

      newSocket.on('game_start', (data) => {
        setGameStatus('playing');
        setCurrentPlayer(data.playerSymbol);
        setEstadoTabuleiro(data.estadoTabuleiro);
        setTabuleirosMenores(data.tabuleirosMenores);
        setCurrentTurn(data.currentTurn);
        setOpponentName(data.opponentName);
        setCurrentQuadrant(data.currentQuadrant);
      });

      newSocket.on('move_made', (data) => {
        setEstadoTabuleiro(data.estadoTabuleiro);
        setTabuleirosMenores(data.tabuleirosMenores);
        setCurrentTurn(data.currentTurn);
        setCurrentQuadrant(data.currentQuadrant);
      });

      newSocket.on('game_over', (data) => {
        setGameStatus('finished');
      });

      newSocket.on('opponent_disconnected', () => {
        setGameStatus('finished');
      });
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [gameId, playerName]);

  return (
    <GameContext.Provider
      value={{
        estadoTabuleiro,
        tabuleirosMenores,
        currentPlayer,
        currentQuadrant,
        disabledQuadrants: Array(9).fill(false), // Adicionado para compatibilidade
        handleCellClick,
        calculateWinner,
        currentTurn,
        gameStatus,
        opponentName,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};