import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Users, Trophy, Clock } from 'lucide-react';

const TournamentDetail: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const tournament = useSelector((state: RootState) =>
    state.tournament.tournaments.find(t => t.id === tournamentId)
  );

  if (!tournament) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Tournoi non trouvé</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{tournament.name}</h1>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-primary-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Participants</p>
              <p className="font-semibold">
                {tournament.currentPlayers} / {tournament.maxPlayers}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-primary-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Statut</p>
              <p className="font-semibold">
                {tournament.status === 'COMPLETED'
                  ? 'Terminé'
                  : tournament.status === 'IN_PROGRESS'
                  ? 'En cours'
                  : 'En attente'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-primary-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Date de début</p>
              <p className="font-semibold">
                {new Date(tournament.startDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {tournament.rounds.map((round) => (
          <div key={round.id} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Round {round.roundNumber}
            </h2>
            
            <div className="space-y-4">
              {round.matches.map((match) => (
                <div
                  key={match.id}
                  className="border rounded-lg p-4 hover:border-primary-500 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-semibold">Équipe 1</p>
                      <p className="text-gray-600">
                        {match.team1.players.join(', ')}
                      </p>
                    </div>
                    
                    <div className="px-6 text-center">
                      <p className="text-2xl font-bold">
                        {match.team1.score} - {match.team2.score}
                      </p>
                      <p className="text-sm text-gray-600">
                        {match.status === 'COMPLETED'
                          ? 'Terminé'
                          : match.status === 'IN_PROGRESS'
                          ? 'En cours'
                          : 'À venir'}
                      </p>
                    </div>
                    
                    <div className="flex-1 text-right">
                      <p className="font-semibold">Équipe 2</p>
                      <p className="text-gray-600">
                        {match.team2.players.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};