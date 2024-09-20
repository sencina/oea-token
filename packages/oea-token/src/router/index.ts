import { projectRouter } from '@modules/project/controller/project.controller';
import { Router } from 'express';

export const router = Router();

router.use('/event', projectRouter);
