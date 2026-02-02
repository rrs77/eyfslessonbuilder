import { query, queryOne } from './db';
import type { Level } from './types';

export async function getAllLevels(): Promise<Level[]> {
  return await query<Level>(
    `SELECT * FROM levels ORDER BY sort_order ASC`
  );
}

export async function getLevelById(id: string): Promise<Level | null> {
  return await queryOne<Level>(
    `SELECT * FROM levels WHERE id = $1`,
    [id]
  );
}
