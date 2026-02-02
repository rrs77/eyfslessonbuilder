import { sql } from '@vercel/postgres';

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  try {
    const result = await sql.query(text, params);
    return result.rows as T[];
  } catch (error: any) {
    console.error('Database query error:', error);
    // If database connection fails, provide helpful error
    if (error.code === 'ECONNREFUSED' || error.message?.includes('connection')) {
      throw new Error('Database connection failed. Please ensure PostgreSQL is running and POSTGRES_URL is set correctly.');
    }
    throw error;
  }
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const results = await query<T>(text, params);
  return results[0] || null;
}

export { sql };
