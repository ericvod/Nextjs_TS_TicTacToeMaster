import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Socket as NetSocket } from 'net';

interface SocketServer extends HTTPServer {
  io?: SocketIOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

interface GameState {
  estadoTabuleiro: (string | null)[];
  tabuleirosMenores: (string | null)[][];
  currentTurn: 'X' | 'O';
  playerNames: string[];
  gameStarted: boolean;
  currentQuadrant: number | null;
}

const games = new Map<string, GameState>();

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new SocketIOServer(res.socket.server as any);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('New client connected');

      socket.on('join_game', ({ gameId, playerName }) => {
        handleJoin(io, socket, gameId, playerName);
      });

      socket.on('make_move', ({ gameId, move }) => {
        handleMove(io, gameId, move);
      });

      socket.on('disconnect', () => {
        handleDisconnect(io, socket);
      });
    });
  }
  res.end();
};

function handleJoin(io: SocketIOServer, socket: any, gameId: string, playerName: string) {
  let game = games.get(gameId);
  
  if (!game) {
    // Create a new game
    const newGame: GameState = {
      estadoTabuleiro: Array(9).fill(null),
      tabuleirosMenores: Array(9).fill(null).map(() => Array(9).fill(null)),
      currentTurn: Math.random() < 0.5 ? 'X' : 'O',
      playerNames: [playerName],
      gameStarted: false,
      currentQuadrant: null
    };
    games.set(gameId, newGame);
    socket.join(gameId);
    socket.emit('waiting_for_opponent');
    console.log(`New game created: ${gameId}`);
    return;
  }

  if (game.playerNames.length === 1) {
    // Join existing game
    game.playerNames.push(playerName);
    game.gameStarted = true;
    socket.join(gameId);
    
    const players = Array.from(io.sockets.adapter.rooms.get(gameId) || []);
    players.forEach((playerId, index) => {
      io.to(playerId).emit('game_start', {
        playerSymbol: index === 0 ? 'X' : 'O',
        estadoTabuleiro: game.estadoTabuleiro,
        tabuleirosMenores: game.tabuleirosMenores,
        currentTurn: game.currentTurn,
        opponentName: game.playerNames[1 - index],
        currentQuadrant: game.currentQuadrant
      });
    });
    console.log(`Player joined game: ${gameId}`);
    return;
  }

  // Game is full
  socket.emit('game_full');
  console.log(`Game full: ${gameId}`);
}

function handleMove(io: SocketIOServer, gameId: string, move: { quadrant: number, cell: number }) {
  const game = games.get(gameId);
  if (!game || !game.gameStarted) {
    console.log(`Game ${gameId} not found or not started`);
    return;
  }

  if (game.currentQuadrant !== null && game.currentQuadrant !== move.quadrant) {
    console.log(`Invalid move: wrong quadrant`);
    return;
  }

  if (game.tabuleirosMenores[move.quadrant][move.cell] !== null) {
    console.log(`Invalid move: cell already occupied`);
    return;
  }

  game.tabuleirosMenores[move.quadrant][move.cell] = game.currentTurn;
  
  const winner = calculateWinner(game.tabuleirosMenores[move.quadrant]);
  if (winner) {
    game.estadoTabuleiro[move.quadrant] = winner;
  } else if (game.tabuleirosMenores[move.quadrant].every(cell => cell !== null)) {
    game.estadoTabuleiro[move.quadrant] = 'T'; // 'T' for tie
  }

  game.currentTurn = game.currentTurn === 'X' ? 'O' : 'X';
  game.currentQuadrant = game.estadoTabuleiro[move.cell] === null ? move.cell : null;

  io.to(gameId).emit('move_made', {
    estadoTabuleiro: game.estadoTabuleiro,
    tabuleirosMenores: game.tabuleirosMenores,
    currentTurn: game.currentTurn,
    lastMove: move,
    currentQuadrant: game.currentQuadrant
  });

  const gameWinner = calculateWinner(game.estadoTabuleiro);
  if (gameWinner) {
    io.to(gameId).emit('game_over', { winner: gameWinner });
  } else if (game.estadoTabuleiro.every(cell => cell !== null)) {
    io.to(gameId).emit('game_over', { winner: 'T' }); // Tie
  }
}

function handleDisconnect(io: SocketIOServer, socket: any) {
  for (const [gameId, game] of games.entries()) {
    if (game.playerNames.includes(socket.id)) {
      game.playerNames = game.playerNames.filter(id => id !== socket.id);
      if (game.playerNames.length === 0) {
        games.delete(gameId);
      } else {
        io.to(gameId).emit('opponent_disconnected');
      }
      break;
    }
  }
}

function calculateWinner(cells: (string | null)[]): string | null {
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
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  return null;
}

export default SocketHandler;