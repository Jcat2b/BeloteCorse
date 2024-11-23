import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import { 
  initializeGame, 
  addPlayer,
  placeBid, 
  playCard, 
  coinche, 
  surcoinche 
} from '../../store/features/gameSlice';
import type { Card, CardSuit } from '../../types/game';
import { Settings, PlayCircle, Plus, ArrowLeft } from 'lucide-react';

const GameTestControls: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const game = useSelector((state: RootState) => state.game);
  const [isOpen, setIsOpen] = useState(false);

  const startNewGame = () => {
    // Initialize game with first player
    dispatch(initializeGame({
      currentPlayerId: 'test-player-1',
      gameId: `test-${Date.now()}`,
      playerName: 'Test Player 1'
    }));

    // Add bot players
    dispatch(addPlayer({ id: 'test-player-2', name: 'Bot 1', isBot: true }));
    dispatch(addPlayer({ id: 'test-player-3', name: 'Bot 2', isBot: true }));
    dispatch(addPlayer({ id: 'test-player-4', name: 'Bot 3', isBot: true }));
  };

  const makeBid = () => {
    const suits: CardSuit[] = ['♠', '♥', '♣', '♦'];
    const points = [80, 90, 100, 110, 120, 130, 140, 150, 160];
    
    dispatch(placeBid({
      points: points[Math.floor(Math.random() * points.length)],
      suit: suits[Math.floor(Math.random() * suits.length)],
      player: game.currentPlayer
    }));
  };

  const makeMove = (card: Card) => {
    dispatch(playCard(card));
  };

  const testCoinche = () => {
    dispatch(coinche());
  };

  const testSurcoinche = () => {
    dispatch(surcoinche());
  };

  const exitTest = () => {
    navigate('/');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
      >
        <Settings className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Mode Test</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <button
          onClick={exitTest}
          className="w-full btn bg-gray-600 text-white hover:bg-gray-700 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Quitter le mode test
        </button>

        <button
          onClick={startNewGame}
          className="w-full btn bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <PlayCircle className="h-5 w-5" />
          Nouvelle partie test
        </button>

        <button
          onClick={makeBid}
          className="w-full btn bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
          disabled={game.phase !== 'BIDDING'}
        >
          <Plus className="h-5 w-5" />
          Faire une enchère
        </button>

        <div className="space-y-2">
          <h4 className="font-medium">Actions spéciales</h4>
          <div className="flex gap-2">
            <button
              onClick={testCoinche}
              className="flex-1 btn bg-yellow-600 text-white hover:bg-yellow-700"
              disabled={!game.contract.suit || game.contract.coinched}
            >
              Coincher
            </button>
            <button
              onClick={testSurcoinche}
              className="flex-1 btn bg-red-600 text-white hover:bg-red-700"
              disabled={!game.contract.coinched || game.contract.surcoinched}
            >
              Surcoincher
            </button>
          </div>
        </div>

        {game.phase === 'PLAYING' && (
          <div className="space-y-2">
            <h4 className="font-medium">Cartes en main</h4>
            <div className="grid grid-cols-4 gap-2">
              {game.players[game.currentPlayer]?.hand.map((card, index) => (
                <button
                  key={`${card.suit}-${card.value}-${index}`}
                  onClick={() => makeMove(card)}
                  className={`p-2 text-center border rounded hover:bg-gray-100 
                    ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'}`}
                >
                  {card.value}
                  {card.suit}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-2 bg-gray-100 rounded">
          <h4 className="font-medium mb-2">État actuel</h4>
          <div className="text-sm space-y-1">
            <p>Phase: {game.phase}</p>
            <p>Joueur actuel: {game.currentPlayer + 1}</p>
            <p>Atout: {game.trumpSuit || 'Non défini'}</p>
            <p>Score: {game.score.team1} - {game.score.team2}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTestControls;