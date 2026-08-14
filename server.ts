import { startServer } from './backend/server';

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
