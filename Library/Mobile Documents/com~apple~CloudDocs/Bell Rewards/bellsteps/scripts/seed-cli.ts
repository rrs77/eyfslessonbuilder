import { config } from 'dotenv';
import { join } from 'path';
import { runSeed } from './seed-data';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

// CLI version that doesn't require auth
async function seedCLI() {
  try {
    console.log('Running seed script...');
    await runSeed();
    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedCLI();
