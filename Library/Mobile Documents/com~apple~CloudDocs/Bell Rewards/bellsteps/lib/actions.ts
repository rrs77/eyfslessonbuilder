'use server';

import { auth } from '@/lib/auth';
import { query, queryOne, sql } from './db';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { ProgressStatus, ResourceWithFavourite } from './types';

const toggleFavouriteSchema = z.object({
  resourceId: z.string().uuid(),
});

const updateProgressSchema = z.object({
  levelId: z.string(),
  status: z.enum(['locked', 'in_progress', 'achieved']),
  notes: z.string().optional(),
});

export async function toggleFavourite(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const { resourceId } = toggleFavouriteSchema.parse({
    resourceId: formData.get('resourceId'),
  });

  // Check if already favourited
  const existing = await queryOne<{ user_id: string }>(
    `SELECT user_id FROM user_favourites WHERE user_id = $1 AND resource_id = $2`,
    [session.user.id, resourceId]
  );

  if (existing) {
    await sql.query(
      `DELETE FROM user_favourites WHERE user_id = $1 AND resource_id = $2`,
      [session.user.id, resourceId]
    );
  } else {
    await sql.query(
      `INSERT INTO user_favourites (user_id, resource_id) VALUES ($1, $2)`,
      [session.user.id, resourceId]
    );
  }

  revalidatePath('/app');
  revalidatePath('/app/saved');
  return { success: true };
}

export async function updateProgress(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const data = updateProgressSchema.parse({
    levelId: formData.get('levelId'),
    status: formData.get('status'),
    notes: formData.get('notes') || '',
  });

  const achievedAt = data.status === 'achieved' ? new Date() : null;

  await sql.query(
    `INSERT INTO user_progress (user_id, level_id, status, achieved_at, notes, updated_at)
     VALUES ($1, $2, $3, $4, $5, now())
     ON CONFLICT (user_id, level_id)
     DO UPDATE SET status = $3, achieved_at = $4, notes = $5, updated_at = now()`,
    [session.user.id, data.levelId, data.status, achievedAt, data.notes || '']
  );

  revalidatePath('/app');
  revalidatePath(`/app/levels/${data.levelId}`);
  return { success: true };
}

export async function getResourcesForLevel(
  levelId: string,
  type?: string
): Promise<ResourceWithFavourite[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  let queryText = `
    SELECT r.*, 
           CASE WHEN uf.user_id IS NOT NULL THEN true ELSE false END as is_favourite
    FROM resources r
    LEFT JOIN user_favourites uf ON r.id = uf.resource_id AND uf.user_id = $1
    WHERE r.level_id = $2
  `;
  const params: any[] = [session.user.id, levelId];

  if (type) {
    queryText += ` AND r.type = $3`;
    params.push(type);
  }

  queryText += ` ORDER BY r.sort_order, r.created_at`;

  return await query<ResourceWithFavourite>(queryText, params);
}

export async function getUserProgress(levelId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  return await queryOne<{
    status: ProgressStatus;
    achieved_at: Date | null;
    notes: string;
  }>(
    `SELECT status, achieved_at, notes FROM user_progress WHERE user_id = $1 AND level_id = $2`,
    [session.user.id, levelId]
  );
}

export async function getAllUserProgress() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return await query<{
    level_id: string;
    status: ProgressStatus;
    achieved_at: Date | null;
  }>(
    `SELECT level_id, status, achieved_at FROM user_progress WHERE user_id = $1`,
    [session.user.id]
  );
}

export async function getUserFavourites(): Promise<ResourceWithFavourite[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return await query<ResourceWithFavourite>(
    `SELECT r.*, true as is_favourite
     FROM resources r
     JOIN user_favourites uf ON r.id = uf.resource_id
     WHERE uf.user_id = $1
     ORDER BY uf.created_at DESC`,
    [session.user.id]
  );
}
