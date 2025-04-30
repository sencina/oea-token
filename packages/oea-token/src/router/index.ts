import { projectRouter } from '@modules/project/controller/project.controller';
import { healthRouter } from '@modules/health/controller/health.controller';
import { Router } from 'express';

export const router = Router();

router.use('/project', projectRouter);
router.use('/health', healthRouter);
