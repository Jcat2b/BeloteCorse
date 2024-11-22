import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { UserCircle, Circle } from 'lucide-react';

const FriendsList: React.FC = () => {
  const { friends, loading } = useSelector((state: RootState) => state.social);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Amis</h2>
      </div>

      <div className="divide-y">
        {friends.map((friend) => (
          <div key={friend.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3">
              {friend.photoURL ? (
                <img
                  src={friend.photoURL}
                  alt={friend.displayName}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <UserCircle className="w-10 h-10 text-gray-400" />
              )}
              <div>
                <p className="font-medium">{friend.displayName}</p>
                <div className="flex items-center gap-1 text-sm">
                  <Circle
                    className={`w-2 h-2 fill-current ${
                      friend.status === 'online'
                        ? 'text-green-500'
                        : friend.status === 'in-game'
                        ? 'text-yellow-500'
                        : 'text-gray-400'
                    }`}
                  />
                  <span className="text-gray-600">
                    {friend.status === 'online'
                      ? 'En ligne'
                      : friend.status === 'in-game'
                      ? 'En partie'
                      : 'Hors ligne'}
                  </span>
                </div>
              </div>
            </div>
            
            <button className="btn bg-primary-50 text-primary-600 hover:bg-primary-100">
              Inviter
            </button>
          </div>
        ))}

        {friends.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <UserCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Aucun ami pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;