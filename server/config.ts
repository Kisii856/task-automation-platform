
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().default('5000'),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);
  
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.toString());
    process.exit(1);
  }
  
  return parsed.data;
}

export const config = validateEnv();
