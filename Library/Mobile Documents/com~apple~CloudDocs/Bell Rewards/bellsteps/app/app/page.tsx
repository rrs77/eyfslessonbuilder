import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getAllLevels } from '@/lib/levels';
import { getAllUserProgress } from '@/lib/actions';
import { LevelCard } from '@/components/LevelCard';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  const levels = await getAllLevels();
  const progress = await getAllUserProgress();
  
  const progressMap = new Map(
    progress.map((p) => [p.level_id, p.status])
  );

  // Find the next recommended level
  let nextLevelId: string | null = null;
  const achievedLevels = progress.filter((p) => p.status === 'achieved');
  if (achievedLevels.length > 0) {
    const lastAchieved = achievedLevels.sort(
      (a, b) => (b.achieved_at?.getTime() || 0) - (a.achieved_at?.getTime() || 0)
    )[0];
    const lastIndex = levels.findIndex((l) => l.id === lastAchieved.level_id);
    if (lastIndex < levels.length - 1) {
      nextLevelId = levels[lastIndex + 1].id;
    }
  } else {
    nextLevelId = levels[0]?.id || null;
  }

  return (
    <div>
      <h1 className="text-5xl font-bold text-gray-900 mb-8">🌟 Your Bell Journey 🌟</h1>

      {nextLevelId && (
        <div className="mb-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-400 rounded-2xl shadow-lg animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-orange-900 mb-2">
                🎉 Keep Going! 🎉
              </h2>
              <p className="text-orange-800 text-xl font-semibold">
                Your next adventure awaits!
              </p>
            </div>
            <Link
              href={`/app/levels/${nextLevelId}`}
              className="px-8 py-4 bg-orange-500 text-white rounded-xl font-bold text-xl hover:bg-orange-600 transition-all transform hover:scale-110 shadow-lg"
            >
              Let's Go! 🚀
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {levels.map((level) => (
          <LevelCard
            key={level.id}
            level={level}
            status={progressMap.get(level.id) || 'locked'}
          />
        ))}
      </div>
    </div>
  );
}
