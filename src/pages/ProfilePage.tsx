import React from 'react';
import { FriendsList, PlayerStats } from '../components/social';

const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Profil</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PlayerStats />
        </div>
        
        <div>
          <FriendsList />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;