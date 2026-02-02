import { redirect } from 'next/navigation';
import { auth, signOut } from '@/lib/auth';

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Profile</h1>

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <p className="text-lg text-gray-900">{session.user?.email}</p>
        </div>

        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button
            type="submit"
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
