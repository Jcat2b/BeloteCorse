import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import GameInfo from './GameInfo';
import PlayArea from './PlayArea';
import PlayerHand from './PlayerHand';
import BiddingPhase from './BiddingPhase';
import TurnTimer from './TurnTimer';
import DisconnectionAlert from './DisconnectionAlert';
import WaitingPhase from './WaitingPhase';
import AnnouncementDisplay from './AnnouncementDisplay';
import PlayerPositions from './PlayerPositions';
import { useGameTimer } from '../../hooks/useGameTimer';
import { useGameSync } from '../../hooks/useGameSync';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';

const GameBoard: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { phase } = useSelector((state: RootState) => state.game);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useGameTimer();
  useGameSync(gameId || '');
  useConnectionStatus();

  if (!currentUser || !gameId) {
    navigate('/');
    return null;
  }

  return (
    <div className="h-screen bg-green-800 p-4">
      <div className="relative h-full rounded-xl bg-green-700 shadow-xl p-6">
        <GameInfo />
        <TurnTimer />
        <DisconnectionAlert />
        <AnnouncementDisplay />
        <PlayerPositions />
        
        {phase === 'WAITING' && <WaitingPhase />}
        
        {phase === 'BIDDING' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <BiddingPhase />
          </div>
        )}
        
        {phase === 'PLAYING' && (
          <>
            <PlayArea />
            <PlayerHand />
          </>
        )}
      </div>
    </div>
  );
};

export default GameBoard;