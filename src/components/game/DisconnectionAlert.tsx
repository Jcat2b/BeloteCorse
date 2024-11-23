import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { AlertTriangle } from 'lucide-react';

const DisconnectionAlert: React.FC = () => {
  const { players } = useSelector((state: RootState) => state.game);
  const disconnectedPlayers = players.filter(p => !p.connected);

  if (disconnectedPlayers.length === 0) return null;

  return (
    <div className="absolute top-20 right-4 bg-red-50 text-red-700 rounded-lg shadow-lg p-4 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="font-semibold">Joueurs déconnectés</h3>
      </div>
      <ul className="space-y-1">
        {disconnectedPlayers.map(player => (
          <li key={player.id} className="text-sm">
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisconnectionAlert;