import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import type { CardSuit, BidValue } from '../../types/game';
import { placeBid, pass, coinche, surcoinche } from '../../store/features/gameSlice';

const POSSIBLE_BIDS: BidValue[] = [80, 90, 100, 110, 120, 130, 140, 150, 160, 'capot'];
const SUITS: CardSuit[] = ['♠', '♥', '♣', '♦'];

const BiddingPhase: React.FC = () => {
  const dispatch = useDispatch();
  const { currentPlayer, players, bids, contract } = useSelector((state: RootState) => state.game);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Si le jeu n'est pas encore initialisé ou s'il n'y a pas de joueurs
  if (!players.length || !currentUser) {
    return (
      <div className="text-center text-white text-xl">
        Initialisation de la partie...
      </div>
    );
  }
  
  const playerIndex = players.findIndex(p => p.id === currentUser.uid);
  if (playerIndex === -1) {
    return (
      <div className="text-center text-white text-xl">
        Erreur: Joueur non trouvé
      </div>
    );
  }

  const isPlayerTurn = currentPlayer === playerIndex;
  const lastBid = bids[bids.length - 1];
  const canCoinche = contract.team !== players[playerIndex].team && !contract.coinched;
  const canSurcoinche = contract.coinched && contract.team === players[playerIndex].team && !contract.surcoinched;

  const handleBid = (points: BidValue, suit: CardSuit) => {
    if (!isPlayerTurn) return;
    dispatch(placeBid({ points, suit, player: playerIndex }));
  };

  const handlePass = () => {
    if (!isPlayerTurn) return;
    dispatch(pass());
  };

  const handleCoinche = () => {
    if (!canCoinche) return;
    dispatch(coinche());
  };

  const handleSurcoinche = () => {
    if (!canSurcoinche) return;
    dispatch(surcoinche());
  };

  if (!isPlayerTurn) {
    return (
      <div className="text-center text-white text-xl">
        En attente de {players[currentPlayer]?.name}...
      </div>
    );
  }

  return (
    <div className="bg-white/90 rounded-lg shadow-lg p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Phase d'enchères</h2>
      
      <div className="space-y-4">
        {SUITS.map(suit => (
          <div key={suit} className="flex items-center gap-2">
            <span className={`text-2xl ${suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-black'}`}>
              {suit}
            </span>
            <div className="flex flex-wrap gap-2">
              {POSSIBLE_BIDS.map(points => {
                const isValid = !lastBid || (typeof points === 'number' && typeof lastBid.points === 'number' 
                  ? points > lastBid.points 
                  : points === 'capot');
                
                return (
                  <button
                    key={points}
                    onClick={() => handleBid(points, suit)}
                    disabled={!isValid}
                    className={`px-2 py-1 rounded ${
                      isValid 
                        ? 'bg-primary-600 text-white hover:bg-primary-700' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {points}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-4">
          <button
            onClick={handlePass}
            className="btn bg-gray-600 text-white hover:bg-gray-700"
          >
            Passer
          </button>
          
          {canCoinche && (
            <button
              onClick={handleCoinche}
              className="btn bg-red-600 text-white hover:bg-red-700"
            >
              Coincher
            </button>
          )}
          
          {canSurcoinche && (
            <button
              onClick={handleSurcoinche}
              className="btn bg-red-800 text-white hover:bg-red-900"
            >
              Surcoincher
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiddingPhase;