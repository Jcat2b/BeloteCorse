import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchmakingStore } from '../../store/matchmakingStore';
import { Check, X, Timer } from 'lucide-react';

const ACCEPT_TIMEOUT = 30;

const MatchFound: React.FC = () => {
  const navigate = useNavigate();
  const { status, matchId, acceptMatch, declineMatch } = useMatchmakingStore();
  const [timeLeft, setTimeLeft] = useState(ACCEPT_TIMEOUT);

  useEffect(() => {
    if (status !== 'matching') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          declineMatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, declineMatch]);

  useEffect(() => {
    if (status === 'ready' && matchId) {
      navigate(`/game/${matchId}`);
    }
  }, [status, matchId, navigate]);

  if (status !== 'matching') return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Partie trouvée !</h2>
          <p className="text-gray-600">
            Acceptez-vous de rejoindre la partie ?
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 mb-6">
          <Timer className="h-6 w-6 text-primary-600" />
          <div className="text-2xl font-bold">{timeLeft}s</div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={acceptMatch}
            className="flex-1 btn bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Check className="h-5 w-5" />
            Accepter
          </button>
          
          <button
            onClick={declineMatch}
            className="flex-1 btn bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <X className="h-5 w-5" />
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
};