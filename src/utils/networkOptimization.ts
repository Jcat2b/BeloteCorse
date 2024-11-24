import { useEffect, useRef } from 'react';
import type { GameState } from '../types/game';

// Gestion optimisée des mises à jour réseau
export const useNetworkOptimization = (
  gameState: GameState,
  onUpdate: (state: GameState) => void
) => {
  const lastUpdate = useRef<number>(0);
  const pendingChanges = useRef<Partial<GameState>>({});
  const updateTimeout = useRef<NodeJS.Timeout>();

  // Fusionne les changements en attente
  const mergeChanges = (changes: Partial<GameState>) => {
    pendingChanges.current = {
      ...pendingChanges.current,
      ...changes,
      lastSaved: Date.now()
    };
  };

  // Applique les changements accumulés
  const flushChanges = () => {
    if (Object.keys(pendingChanges.current).length > 0) {
      onUpdate({
        ...gameState,
        ...pendingChanges.current
      });
      pendingChanges.current = {};
    }
  };

  useEffect(() => {
    // Nettoie le timeout en cours
    return () => {
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
    };
  }, []);

  return {
    // Planifie une mise à jour avec fusion des changements
    scheduleUpdate: (changes: Partial<GameState>) => {
      const now = Date.now();
      mergeChanges(changes);

      // Si la dernière mise à jour est récente, accumule les changements
      if (now - lastUpdate.current < 1000) {
        if (updateTimeout.current) {
          clearTimeout(updateTimeout.current);
        }
        updateTimeout.current = setTimeout(flushChanges, 1000);
      } else {
        // Sinon, applique immédiatement
        flushChanges();
        lastUpdate.current = now;
      }
    },

    // Force une mise à jour immédiate
    forceUpdate: () => {
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
      flushChanges();
      lastUpdate.current = Date.now();
    }
  };
};

// Gestion de la reconnexion automatique
export const useAutoReconnect = (
  isConnected: boolean,
  onReconnect: () => void
) => {
  const reconnectAttempts = useRef(0);
  const maxAttempts = 5;
  const baseDelay = 1000;

  useEffect(() => {
    if (!isConnected) {
      const attemptReconnect = () => {
        if (reconnectAttempts.current < maxAttempts) {
          // Délai exponentiel avec jitter
          const delay = Math.min(
            baseDelay * Math.pow(2, reconnectAttempts.current) +
              Math.random() * 1000,
            30000
          );

          setTimeout(() => {
            onReconnect();
            reconnectAttempts.current++;
          }, delay);
        }
      };

      attemptReconnect();
    } else {
      reconnectAttempts.current = 0;
    }
  }, [isConnected, onReconnect]);
};

// Cache des données réseau
export class NetworkCache {
  private static instance: NetworkCache;
  private cache: Map<string, { data: any; timestamp: number }>;
  private maxAge: number;

  private constructor() {
    this.cache = new Map();
    this.maxAge = 5 * 60 * 1000; // 5 minutes par défaut
  }

  static getInstance(): NetworkCache {
    if (!NetworkCache.instance) {
      NetworkCache.instance = new NetworkCache();
    }
    return NetworkCache.instance;
  }

  set(key: string, data: any, maxAge?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  setMaxAge(maxAge: number): void {
    this.maxAge = maxAge;
  }
}