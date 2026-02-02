import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { seedDatabase } from '@/scripts/seed';

export default async function AdminSeedPage() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) || [];
  const isAdmin = session.user?.email && adminEmails.includes(session.user.email);

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-red-100 border-4 border-red-500 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h1>
          <p className="text-red-700">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Seed Database</h1>

      <div className="bg-white rounded-xl shadow-md p-8">
        <p className="text-gray-700 mb-6">
          This will populate the database with all levels and resources. 
          This action cannot be undone.
        </p>

        <form action={seedDatabase}>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Run Seed Script
          </button>
        </form>
      </div>
    </div>
  );
}
