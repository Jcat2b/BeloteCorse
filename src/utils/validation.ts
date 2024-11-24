import type { Card, CardSuit, GameState, Player } from '../types/game';

// Validation des entrées utilisateur
export const validateUserInput = {
  // Validation du nom d'utilisateur
  username: (username: string): string | null => {
    if (!username) return 'Le nom d\'utilisateur est requis';
    if (username.length < 3) return 'Le nom doit contenir au moins 3 caractères';
    if (username.length > 20) return 'Le nom ne doit pas dépasser 20 caractères';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Le nom ne doit contenir que des lettres, chiffres et underscores';
    }
    return null;
  },

  // Validation de l'email
  email: (email: string): string | null => {
    if (!email) return 'L\'email est requis';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Email invalide';
    return null;
  },

  // Validation du mot de passe
  password: (password: string): string | null => {
    if (!password) return 'Le mot de passe est requis';
    if (password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères';
    if (!/[A-Z]/.test(password)) return 'Le mot de passe doit contenir au moins une majuscule';
    if (!/[0-9]/.test(password)) return 'Le mot de passe doit contenir au moins un chiffre';
    return null;
  }
};

// Validation de l'état du jeu
export const validateGameState = {
  // Vérifie si une carte peut être jouée
  playCard: (
    card: Card,
    player: Player,
    gameState: GameState
  ): string | null => {
    if (gameState.phase !== 'PLAYING') {
      return 'Ce n\'est pas la phase de jeu';
    }

    if (gameState.currentPlayer !== player.position) {
      return 'Ce n\'est pas votre tour';
    }

    const hasCard = player.hand.some(
      c => c.suit === card.suit && c.value === card.value
    );
    if (!hasCard) {
      return 'Vous n\'avez pas cette carte';
    }

    return null;
  },

  // Vérifie si une enchère est valide
  placeBid: (
    points: number,
    suit: CardSuit,
    player: Player,
    gameState: GameState
  ): string | null => {
    if (gameState.phase !== 'BIDDING') {
      return 'Ce n\'est pas la phase d\'enchères';
    }

    if (gameState.currentPlayer !== player.position) {
      return 'Ce n\'est pas votre tour';
    }

    if (points % 10 !== 0) {
      return 'L\'enchère doit être un multiple de 10';
    }

    if (points < 80) {
      return 'L\'enchère minimale est de 80';
    }

    if (points > 160 && points !== 250) {
      return 'L\'enchère maximale est de 160 (ou 250 pour capot)';
    }

    if (gameState.contract.points >= points) {
      return 'L\'enchère doit être supérieure à l\'enchère précédente';
    }

    return null;
  },

  // Vérifie si un joueur peut coincher
  coinche: (
    player: Player,
    gameState: GameState
  ): string | null => {
    if (!gameState.contract.suit) {
      return 'Aucun contrat à coincher';
    }

    if (gameState.contract.team === player.team) {
      return 'Vous ne pouvez pas coincher votre propre contrat';
    }

    if (gameState.contract.coinched) {
      return 'Le contrat est déjà coinché';
    }

    return null;
  },

  // Vérifie si un joueur peut surcoincher
  surcoinche: (
    player: Player,
    gameState: GameState
  ): string | null => {
    if (!gameState.contract.coinched) {
      return 'Le contrat n\'est pas coinché';
    }

    if (gameState.contract.team !== player.team) {
      return 'Vous ne pouvez pas surcoincher un contrat adverse';
    }

    if (gameState.contract.surcoinched) {
      return 'Le contrat est déjà surcoinché';
    }

    return null;
  }
};