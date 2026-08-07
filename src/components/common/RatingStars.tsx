import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 'sm',
  interactive = false,
  onRatingChange,
}) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6';

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const starNum = i + 1;
        const isFilled = rating >= starNum;
        const isHalf = rating >= starNum - 0.5 && rating < starNum;

        return (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starNum)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition`}
          >
            <Star
              className={`${iconSize} ${
                isFilled
                  ? 'text-amber-400 fill-amber-400'
                  : isHalf
                  ? 'text-amber-400 fill-amber-200'
                  : 'text-slate-200 fill-slate-100'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
