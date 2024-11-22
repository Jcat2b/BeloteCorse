import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Trophy, Users, Calendar, ChevronRight } from 'lucide-react';

const TournamentList: React.FC = () => {
  const navigate = useNavigate();
  const { tournaments, loading } = useSelector((state: RootState) => state.tournament);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tournois</h1>
        <button
          onClick={() => navigate('/tournaments/new')}
          className="btn btn-primary"
        >
          Créer un tournoi
        </button>
      </div>

      <div className="space-y-4">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold mb-2">{tournament.name}</h2>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>
                      {new Date(tournament.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>
                      {tournament.currentPlayers} / {tournament.maxPlayers} joueurs
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Trophy className="h-5 w-5 mr-2" />
                    <span>
                      {tournament.status === 'COMPLETED'
                        ? 'Terminé'
                        : tournament.status === 'IN_PROGRESS'
                        ? 'En cours'
                        : 'En attente'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/tournaments/${tournament.id}`)}
                className="btn bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}

        {tournaments.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Aucun tournoi disponible pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
};