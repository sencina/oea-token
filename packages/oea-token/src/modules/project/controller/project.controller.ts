import { Router } from 'express';
import { ProjectService } from '../service/project.service';
import 'express-async-errors';
import { BodyValidation } from '@utils';
import { CreateProjectDto } from '../dto';

export const projectRouter = Router();
const service = new ProjectService();

projectRouter.post('/', BodyValidation(CreateProjectDto), async (req, res) => {
  const project = req.body;
  const tokenId = await service.create(project);
  res.status(201).json(tokenId);
});
