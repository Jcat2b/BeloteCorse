import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { History, ChevronLeft, ChevronRight } from 'lucide-react';

const TrickHistory: React.FC = () => {
  const { tricks } = useSelector((state: RootState) => state.game);
  const [selectedTrick, setSelectedTrick] = useState<number | null>(null);

  if (tricks.length === 0) return null;

  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={() => setSelectedTrick(tricks.length - 1)}
        className="btn bg-white/90 text-gray-700 hover:bg-white flex items-center gap-2"
      >
        <History className="h-5 w-5" />
        <span>Historique des plis</span>
      </button>

      {selectedTrick !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Pli {selectedTrick + 1} / {tricks.length}
              </h2>
              <button
                onClick={() => setSelectedTrick(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="relative h-96">
              {tricks[selectedTrick].cards.map((card, index) => (
                <div
                  key={`${card.suit}-${card.value}`}
                  className={`absolute w-24 h-36 transform
                    ${index === 0 ? 'top-1/2 -translate-y-1/2' : ''}
                    ${index === 1 ? 'right-0 top-1/2 -translate-y-1/2' : ''}
                    ${index === 2 ? 'bottom-0 left-1/2 -translate-x-1/2' : ''}
                    ${index === 3 ? 'left-0 top-1/2 -translate-y-1/2' : ''}`}
                >
                  <div
                    className={`w-full h-full rounded-lg shadow-lg bg-white flex items-center justify-center
                      text-2xl font-bold ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'}`}
                  >
                    <span>{card.value}</span>
                    <span>{card.suit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setSelectedTrick(prev => Math.max(0, (prev || 0) - 1))}
                disabled={selectedTrick === 0}
                className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
                Précédent
              </button>

              <div className="text-center">
                <p className="font-semibold">Points</p>
                <p className="text-2xl font-bold">{tricks[selectedTrick].points}</p>
                <p className="text-sm text-gray-600">
                  Gagné par l'équipe {tricks[selectedTrick].winner}
                </p>
              </div>

              <button
                onClick={() => setSelectedTrick(prev => Math.min(tricks.length - 1, (prev || 0) + 1))}
                disabled={selectedTrick === tricks.length - 1}
                className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                Suivant
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrickHistory;