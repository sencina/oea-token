import { Router } from 'express';
import { ProjectService } from '../service/project.service';
import 'express-async-errors';
import { BodyValidation } from '@utils';
import { CreateProjectDto } from '../dto';
import { generateAuthStatusHTML } from '../templates/auth-status.template';

export const projectRouter = Router();
const service = new ProjectService();

projectRouter.post('/', BodyValidation(CreateProjectDto), async (req, res) => {
  const project = req.body;
  const host = req.get('host');
  const protocol = req.protocol;
  const tokenId = await service.create(project, host!, protocol);
  res.status(201).json(tokenId);
});

projectRouter.get('/:address/:tokenId', async (req, res) => {
  const { address, tokenId } = req.params;
  const { isAuthenticated } = await service.authenticate(address, tokenId);

  const htmlResponse = generateAuthStatusHTML({
    isAuthenticated,
    address,
    tokenId,
  });

  res.status(isAuthenticated ? 200 : 403).send(htmlResponse);
});
