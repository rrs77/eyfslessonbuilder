import { redirect } from 'next/navigation';
import { auth, signOut } from '@/lib/auth';
import Link from 'next/link';
import { BellIcon } from '@/components/BellIcon';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/app" className="flex items-center gap-3">
              <BellIcon color="#3498DB" size={40} />
              <span className="text-2xl font-bold text-gray-900">BellSteps</span>
            </Link>
            
            <nav className="flex items-center gap-4">
              <Link
                href="/app/saved"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                Saved
              </Link>
              <Link
                href="/app/profile"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                Profile
              </Link>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/' });
                }}
              >
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Sign Out
                </button>
              </form>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
