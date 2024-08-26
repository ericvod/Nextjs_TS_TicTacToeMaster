"use client"

import { LocalGameProvider } from '@/context/LocalGameContext';
import TabuleiroPrincipal from '@/components/TabuleiroPrincipal';

const LocalGame = () => {
    return (
        <LocalGameProvider>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <h1 className="text-4xl font-bold mb-8">Jogo Local</h1>
                <TabuleiroPrincipal />
            </div>
        </LocalGameProvider>
    );
};

export default LocalGame;