import { NextApiRequest, NextApiResponse } from 'next';

let waitingPlayer: { name: string; res: NextApiResponse } | null = null;
let games: { [key: string]: { estadoTabuleiro: (string | null)[], currentTurn: string } } = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name } = req.body;

    if (waitingPlayer) {
      const gameId = `${waitingPlayer.name}-${name}-${Date.now()}`;
      const firstPlayer = Math.random() > 0.5 ? 'X' : 'O';

      games[gameId] = { estadoTabuleiro: Array(9).fill(null), currentTurn: firstPlayer };

      waitingPlayer.res.json({ gameId, firstPlayer });
      res.json({ gameId, firstPlayer });
      waitingPlayer = null;
    } else {
      waitingPlayer = { name, res };
    }
  }
}