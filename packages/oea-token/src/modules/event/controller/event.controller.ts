import { Router } from 'express';
import { EventService } from '../service/event.service';

export const eventRouter = Router();
const eventService = new EventService();

eventRouter.post('/', async (req, res, next) => {
  try {
    const event = await eventService.create();
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});
