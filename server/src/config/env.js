import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { z } from 'zod';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootEnv = resolve(__dirname, '..', '..', '..', '.env');
const serverEnv = resolve(__dirname, '..', '..', '.env');

if (existsSync(serverEnv)) {
  dotenv.config({ path: serverEnv });
} else {
  dotenv.config({ path: rootEnv });
}

const envSchema = z.object({
  MONGODB_URI: z.string().url().or(z.string().startsWith('mongodb://')).or(z.string().startsWith('mongodb+srv://')),
  GEMINI_API_KEY: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(4000)
});

export const env = envSchema.parse(process.env);
