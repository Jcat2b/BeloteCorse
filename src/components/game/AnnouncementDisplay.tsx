import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Crown } from 'lucide-react';

const AnnouncementDisplay: React.FC = () => {
  const { lastAnnouncement, players } = useSelector((state: RootState) => state.game);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lastAnnouncement) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastAnnouncement]);

  if (!lastAnnouncement || !visible) return null;

  const player = players.find(p => p.id === lastAnnouncement.playerId);
  const announcementText = lastAnnouncement.type === 'BELOTE' ? 'Belote!' : 'Rebelote!';

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-bounce">
        <Crown className="h-6 w-6" />
        <div>
          <p className="font-bold text-xl">{announcementText}</p>
          <p className="text-sm">{player?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDisplay;