"use client"

import { useParams, useSearchParams } from 'next/navigation';
import TabuleiroPrincipal from '@/components/TabuleiroPrincipal';
import { MultiplayerGameProvider } from '@/context/MultiplayerGameContext';
import { useEffect, useState } from 'react';

const GameWrapper = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const gameId = params?.gameid as string;
  const playerName = searchParams?.get('playerName') || 'Anonymous';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <MultiplayerGameProvider gameId={gameId} playerName={playerName}>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-8">Jogo Multiplayer</h1>
        <TabuleiroPrincipal />
      </div>
    </MultiplayerGameProvider>
  );
};

export default GameWrapper;