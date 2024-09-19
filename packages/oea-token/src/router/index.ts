import { eventRouter } from '@modules/event/controller/event.controller';
import { Router } from 'express';

export const router = Router();

router.use('/event', eventRouter);
