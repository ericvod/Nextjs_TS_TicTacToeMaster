import Link from 'next/link';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Jogo da Velha Avançado</h1>
      <div className="space-y-4">
        <Link href="/local" className="px-4 py-2 bg-blue-500 text-white rounded">
          Jogar Local
        </Link>
        <Link href="/multiplayer" className="px-4 py-2 bg-green-500 text-white rounded">
          Jogar Multiplayer
        </Link>
      </div>
    </div>
  );
};

export default Home;