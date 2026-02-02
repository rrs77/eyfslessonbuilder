import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import { sql } from '../lib/db';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

async function migrate() {
  try {
    const migrationPath = join(process.cwd(), 'migrations', '001_initial_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql.query(statement);
          console.log('✓ Executed statement');
        } catch (error: any) {
          // Ignore "already exists" errors
          if (error.message?.includes('already exists')) {
            console.log('⚠ Table/index already exists, skipping');
          } else {
            throw error;
          }
        }
      }
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
