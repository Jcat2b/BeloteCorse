import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { updateFriendRequest } from '../../store/features/socialSlice';
import { UserCircle, Check, X } from 'lucide-react';

const FriendRequests: React.FC = () => {
  const dispatch = useDispatch();
  const { friendRequests } = useSelector((state: RootState) => state.social);
  const pendingRequests = friendRequests.filter(request => request.status === 'pending');

  const handleResponse = (requestId: string, status: 'accepted' | 'rejected') => {
    dispatch(updateFriendRequest({ id: requestId, status }));
  };

  if (pendingRequests.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Demandes d'ami</h2>
      </div>

      <div className="divide-y">
        {pendingRequests.map((request) => (
          <div key={request.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {request.from.photoURL ? (
                <img
                  src={request.from.photoURL}
                  alt={request.from.displayName}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <UserCircle className="w-10 h-10 text-gray-400" />
              )}
              <div>
                <p className="font-medium">{request.from.displayName}</p>
                <p className="text-sm text-gray-500">
                  Envoyée le {new Date(request.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleResponse(request.id, 'accepted')}
                className="btn bg-green-50 text-green-600 hover:bg-green-100"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleResponse(request.id, 'rejected')}
                className="btn bg-red-50 text-red-600 hover:bg-red-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};