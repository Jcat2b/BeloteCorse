import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import { initializeGame, addPlayer } from '../../store/features/gameSlice';
import { Settings, PlayCircle, ArrowLeft } from 'lucide-react';

const TestControls: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { phase, players } = useSelector((state: RootState) => state.game);
  const [isOpen, setIsOpen] = React.useState(false);

  const startTestGame = () => {
    // Initialize game with current player
    dispatch(initializeGame({
      currentPlayerId: 'test-player-1',
      gameId: `test-${Date.now()}`,
      playerName: 'Vous'
    }));

    // Add three bots
    dispatch(addPlayer({ id: 'bot-1', name: 'Bot 1', isBot: true }));
    dispatch(addPlayer({ id: 'bot-2', name: 'Bot 2', isBot: true }));
    dispatch(addPlayer({ id: 'bot-3', name: 'Bot 3', isBot: true }));
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
        <div className="p-3 bg-gray-100 rounded">
          <h4 className="font-medium mb-2">État actuel</h4>
          <div className="text-sm space-y-1">
            <p>Phase: {phase}</p>
            <p>Joueurs: {players.length}/4</p>
          </div>
        </div>

        {players.length === 0 ? (
          <button
            onClick={startTestGame}
            className="w-full btn bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <PlayCircle className="h-5 w-5" />
            Démarrer partie test
          </button>
        ) : (
          <button
            onClick={exitTest}
            className="w-full btn bg-gray-600 text-white hover:bg-gray-700 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Quitter le mode test
          </button>
        )}
      </div>
    </div>
  );
};

export default TestControls;