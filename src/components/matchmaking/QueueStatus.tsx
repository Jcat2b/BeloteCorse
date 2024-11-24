import React from 'react';
import { useMatchmakingStore } from '../../store/matchmakingStore';
import { Clock, Users, Loader } from 'lucide-react';

const QueueStatus: React.FC = () => {
  const { status, estimatedWaitTime, queuePosition, leaveQueue } = useMatchmakingStore();

  if (status === 'idle') return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 min-w-[300px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Recherche de partie</h3>
        {status === 'queuing' && (
          <Loader className="h-5 w-5 text-primary-600 animate-spin" />
        )}
      </div>

      <div className="space-y-3">
        {estimatedWaitTime && (
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-5 w-5" />
            <span>Temps d'attente estimé: {Math.ceil(estimatedWaitTime / 1000)}s</span>
          </div>
        )}

        {queuePosition && (
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-5 w-5" />
            <span>Position dans la file: {queuePosition}</span>
          </div>
        )}

        <button
          onClick={leaveQueue}
          className="w-full btn bg-red-600 text-white hover:bg-red-700"
        >
          Annuler la recherche
        </button>
      </div>
    </div>
  );
};