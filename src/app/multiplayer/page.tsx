"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MultiplayerEntry = () => {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim()) {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      const { gameId } = await response.json();
      router.push(`/multiplayer/game/${gameId}?playerName=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Multiplayer</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 border rounded text-black"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Find Match</button>
      </form>
    </div>
  );
};

export default MultiplayerEntry;