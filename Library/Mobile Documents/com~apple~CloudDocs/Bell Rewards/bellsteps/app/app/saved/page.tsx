import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getUserFavourites } from '@/lib/actions';
import { getLevelById } from '@/lib/levels';
import { ResourceCard } from '@/components/ResourceCard';
import Link from 'next/link';

export default async function SavedPage() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  const favourites = await getUserFavourites();
  
  // Group by level
  const grouped = new Map<string, typeof favourites>();
  for (const fav of favourites) {
    if (!grouped.has(fav.level_id)) {
      grouped.set(fav.level_id, []);
    }
    grouped.get(fav.level_id)!.push(fav);
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Saved Resources</h1>

      {favourites.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-600 text-xl mb-4">You haven't saved any resources yet.</p>
          <Link
            href="/app"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Browse levels →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(async ([levelId, resources]) => {
            const level = await getLevelById(levelId);
            return (
              <div key={levelId} className="bg-white rounded-xl shadow-md p-6">
                <Link
                  href={`/app/levels/${levelId}`}
                  className="text-2xl font-bold mb-4 block hover:text-blue-600"
                  style={{ color: level?.theme_color || '#333' }}
                >
                  {level?.title || levelId}
                </Link>
                <div className="grid gap-4">
                  {resources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
