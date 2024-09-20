import { Router } from 'express';
import { ProjectService } from '../service/project.service';
import 'express-async-errors';

export const projectRouter = Router();
const service = new ProjectService();

projectRouter.post('/', async (req, res) => {
  const tokenId = await service.create();
  res.status(201).json(tokenId.toString());
});
