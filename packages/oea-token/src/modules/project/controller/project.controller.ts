import { Router } from 'express';
import { ProjectService } from '../service/project.service';
import 'express-async-errors';
import { BodyValidation } from '@utils';
import { CreateProjectDto } from '../dto';

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
  const htmlResponse = `
    <html>
      <head>
        <title>Authentication Status</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #121212;
            color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            text-align: center;
            padding: 40px;
            border-radius: 10px;
            background: #1a1a1a;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          }
          h1 {
            color: ${isAuthenticated ? '#0ef' : '#ff3860'};
            font-size: 2rem;
            margin-bottom: 20px;
          }
          p {
            font-size: 1.1rem;
            margin: 10px 0;
            color: #bbb;
          }
          .status {
            color: ${isAuthenticated ? '#0ef' : '#ff3860'};
            font-size: 1.2rem;
            font-weight: bold;
          }
          .token-id {
            color: #08f;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${isAuthenticated ? 'Verification Successful' : 'Verification Failed'}</h1>
          <p>Address: <span>${address}</span></p>
          <p>Token ID: <span class="token-id">${tokenId}</span></p>
          <p class="status">${isAuthenticated ? 'The address is verified!' : 'Verification failed.'}</p>
        </div>
      </body>
    </html>
  `;

  res.status(isAuthenticated ? 200 : 403).send(htmlResponse);
});
