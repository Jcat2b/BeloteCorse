import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { playerDisconnected, playerReconnected } from '../../store/features/gameSlice';
import { AlertTriangle } from 'lucide-react';

const DisconnectionHandler: React.FC = () => {
  const dispatch = useDispatch();
  const { disconnectedPlayers, players } = useSelector((state: RootState) => state.game);

  useEffect(() => {
    const handleOnline = () => {
      const currentPlayer = players.find(p => p.id === localStorage.getItem('currentPlayerId'));
      if (currentPlayer) {
        dispatch(playerReconnected(currentPlayer.id));
      }
    };

    const handleOffline = () => {
      const currentPlayer = players.find(p => p.id === localStorage.getItem('currentPlayerId'));
      if (currentPlayer) {
        dispatch(playerDisconnected(currentPlayer.id));
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch, players]);

  if (disconnectedPlayers.length === 0) return null;

  return (
    <div className="absolute top-20 right-4 bg-red-50 text-red-700 rounded-lg shadow-lg p-4 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="font-semibold">Joueurs déconnectés</h3>
      </div>
      <ul className="space-y-1">
        {disconnectedPlayers.map(playerId => {
          const player = players.find(p => p.id === playerId);
          return (
            <li key={playerId} className="text-sm">
              {player?.name || 'Joueur inconnu'}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DisconnectionHandler;