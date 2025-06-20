import express, { Application } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { router } from '@router';
import { ErrorHandling } from '@utils/errors';
import { PORT } from '@env';
import path from 'path';
import { AppInitializer } from '@initializer/app.initializer';

require('express-async-errors');
const app: Application = express();

const gracefulShutdown = async (signal: string) => {
  console.log(`${signal} received, shutting down gracefully`);
  await AppInitializer.shutdown();
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

app.use(
  cors({
    origin: '*',
  })
);

app.use('/api', router);

app.use(ErrorHandling);

app.listen(PORT, async () => {
  await AppInitializer.initializeServices();
  console.log(`Server is Fire at http://localhost:${PORT}`);
});
