import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './db/mongoose.js';

const start = async () => {
  await connectDatabase(env.MONGODB_URI);

  const app = await createApp();

  await app.listen({
    port: env.PORT,
    host: '0.0.0.0'
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
