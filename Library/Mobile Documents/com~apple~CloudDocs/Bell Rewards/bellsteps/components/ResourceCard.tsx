'use client';

import { useState, useTransition } from 'react';
import { Heart, Play, FileText, Image, Gamepad2, ClipboardCheck, Eye, Grid } from 'lucide-react';
import { toggleFavourite } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import type { ResourceWithFavourite } from '@/lib/types';

interface ResourceCardProps {
  resource: ResourceWithFavourite;
}

const typeIcons = {
  video: Play,
  pdf: FileText,
  printable: FileText,
  game: Gamepad2,
  assessment: ClipboardCheck,
  teacher_script: FileText,
  visual_cues: Eye,
  pattern_cards: Grid,
};

const typeColors = {
  video: 'bg-red-500',
  pdf: 'bg-blue-500',
  printable: 'bg-purple-500',
  game: 'bg-green-500',
  assessment: 'bg-orange-500',
  teacher_script: 'bg-indigo-500',
  visual_cues: 'bg-pink-500',
  pattern_cards: 'bg-cyan-500',
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const [isFavourite, setIsFavourite] = useState(resource.is_favourite);
  const [isPending, startTransition] = useTransition();

  const Icon = typeIcons[resource.type] || FileText;
  const bgColor = typeColors[resource.type] || 'bg-gray-500';

  const handleToggleFavourite = () => {
    const newFavouriteState = !isFavourite;
    setIsFavourite(newFavouriteState);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('resourceId', resource.id);
        await toggleFavourite(formData);
        toast.success(newFavouriteState ? 'Saved to favourites!' : 'Removed from favourites');
      } catch (error) {
        setIsFavourite(!newFavouriteState);
        toast.error('Failed to update favourite');
      }
    });
  };

  const handleOpen = () => {
    window.open(resource.url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:border-gray-300 transition-all">
      <div className="flex items-start gap-4">
        <div className={`${bgColor} p-4 rounded-lg flex-shrink-0`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-xl font-bold text-gray-900">{resource.title}</h4>
            <button
              onClick={handleToggleFavourite}
              disabled={isPending}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  isFavourite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`}
              />
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">{resource.description}</p>
          
          {resource.tags_json && resource.tags_json.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {resource.tags_json.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <button
            onClick={handleOpen}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all transform hover:scale-105 text-xl shadow-lg"
          >
            {resource.type === 'video' ? '▶️ Play Video' : resource.type === 'game' ? '🎮 Play Game' : '📖 Open'}
          </button>
        </div>
      </div>
    </div>
  );
}
