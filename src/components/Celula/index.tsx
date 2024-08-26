import React from 'react';

interface CelulaProps {
  valor: string | null;
  onClick: () => void;
}

const Celula: React.FC<CelulaProps> = ({ valor, onClick }) => {
  return (
    <button
      className="w-16 h-16 flex items-center justify-center border border-gray-300"
      onClick={onClick}
    >
      {valor}
    </button>
  );
};

export default Celula;
