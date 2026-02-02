import Link from 'next/link';
import { BellIcon } from './BellIcon';
import type { Level, ProgressStatus } from '@/lib/types';

interface LevelCardProps {
  level: Level;
  status?: ProgressStatus;
}

export function LevelCard({ level, status = 'locked' }: LevelCardProps) {
  const statusColors = {
    locked: 'bg-gray-200 text-gray-600',
    in_progress: 'bg-yellow-400 text-yellow-900',
    achieved: 'bg-green-400 text-green-900',
  };

  const statusLabels = {
    locked: '🔒 Coming Soon',
    in_progress: '⭐ Learning',
    achieved: '🎉 Complete!',
  };

  return (
    <Link
      href={`/app/levels/${level.id}`}
      className="block group"
    >
      <div
        className="relative rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105 bg-white border-4"
        style={{ borderColor: level.theme_color }}
      >
        <div className="flex flex-col items-center gap-4">
          <BellIcon color={level.theme_color} size={100} />
          <h3 className="text-2xl font-bold text-center" style={{ color: level.theme_color }}>
            {level.title}
          </h3>
          <div className={`px-4 py-2 rounded-full font-semibold text-sm ${statusColors[status]}`}>
            {statusLabels[status]}
          </div>
        </div>
      </div>
    </Link>
  );
}
