import { useEffect, useCallback, useRef } from 'react';

// Debounce hook pour limiter les appels fréquents
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
};

// Throttle hook pour limiter le taux d'appels
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T => {
  const inThrottle = useRef(false);

  return useCallback(
    ((...args) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    }) as T,
    [callback, limit]
  );
};

// Mesure de performance pour les opérations critiques
export const measurePerformance = (
  operation: string,
  callback: () => void
): void => {
  const start = performance.now();
  callback();
  const end = performance.now();
  console.debug(`${operation} took ${end - start}ms`);
};

// Cache pour les calculs coûteux
export class ComputationCache<K, V> {
  private cache = new Map<K, { value: V; timestamp: number }>();
  private maxAge: number;
  private maxSize: number;

  constructor(maxAge: number = 5000, maxSize: number = 100) {
    this.maxAge = maxAge;
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize) {
      // Supprime l'entrée la plus ancienne
      const oldestKey = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, { value, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Optimisation du rendu des listes
export const useVirtualization = (
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) => {
  const getVisibleRange = useCallback(
    (scrollTop: number) => {
      const start = Math.floor(scrollTop / itemHeight);
      const visibleCount = Math.ceil(containerHeight / itemHeight);
      const end = Math.min(start + visibleCount + 1, itemCount);
      return { start, end };
    },
    [itemCount, itemHeight, containerHeight]
  );

  return {
    getVisibleRange,
    totalHeight: itemCount * itemHeight,
  };
};