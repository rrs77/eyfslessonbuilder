'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { runSeed } from './seed-data';

export async function seedDatabase() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) || [];
  if (!adminEmails.includes(session.user.email)) {
    throw new Error('Admin access required');
  }

  await runSeed();
  redirect('/app?seeded=true');
}
