import React from 'react';
import Celula from "../Celula";
import { useGame } from "@/context/GameContext";

interface TabuleiroMenorProps {
  index: number;
  tabuleiro: (string | null)[];
  isDisabled: boolean;
}

const TabuleiroMenor: React.FC<TabuleiroMenorProps> = ({ index, tabuleiro, isDisabled }) => {
  const { handleCellClick } = useGame();

  return (
    <div className={`grid grid-cols-3 gap-2 border border-gray-500 p-2 ${isDisabled ? 'opacity-50' : ''}`}>
      {tabuleiro.map((valor, cellIndex) => (
        <Celula 
          key={cellIndex} 
          valor={valor} 
          onClick={() => handleCellClick(index, cellIndex)} 
        />
      ))}
    </div>
  );
};

export default TabuleiroMenor;