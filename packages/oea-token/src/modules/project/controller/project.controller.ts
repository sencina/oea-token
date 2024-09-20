import { Router } from 'express';
import { ProjectService } from '../service/project.service';

export const projectRouter = Router();
const service = new ProjectService();

projectRouter.post('/', async (req, res, next) => {
  try {
    const tokenId = await service.create();
    res.status(201).json(tokenId.toString());
  } catch (error) {
    next(error);
  }
});
