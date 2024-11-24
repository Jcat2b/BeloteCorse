import React from 'react';
import { motion } from 'framer-motion';
import type { Card } from '../../types/game';

interface AnimatedCardProps {
  card: Card;
  position: { x: number; y: number };
  rotation?: number;
  onAnimationComplete?: () => void;
  isPlayable?: boolean;
  onClick?: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  card,
  position,
  rotation = 0,
  onAnimationComplete,
  isPlayable = false,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{
        x: position.x,
        y: position.y,
        rotate: rotation,
        scale: 1,
        opacity: 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onAnimationComplete={onAnimationComplete}
      onClick={onClick}
      className={`absolute w-24 h-36 cursor-${isPlayable ? 'pointer' : 'default'}`}
      whileHover={isPlayable ? { scale: 1.1, y: -10 } : undefined}
    >
      <div
        className={`w-full h-full rounded-lg shadow-lg bg-white flex items-center justify-center
          text-2xl font-bold ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'}
          ${!isPlayable ? 'opacity-70' : ''}`}
      >
        <span>{card.value}</span>
        <span>{card.suit}</span>
      </div>
    </motion.div>
  );
};

export default AnimatedCard;