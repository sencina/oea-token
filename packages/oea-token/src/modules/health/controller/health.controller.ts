import { Router } from 'express';
import 'express-async-errors';
import { PROVIDER } from '@modules/nft/utils/provider';

export const healthRouter = Router();

healthRouter.get('/', async (req, res) => {
  try {
    // Check blockchain provider connection
    const network = await PROVIDER.getNetwork();

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      blockchain: {
        network: network.name,
        chainId: network.chainId,
        connected: true,
      },
      environment: process.env.NODE_ENV || 'development',
      memory: {
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal,
        rss: process.memoryUsage().rss,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      blockchain: {
        connected: false,
        error: 'Blockchain provider connection failed',
      },
      environment: process.env.NODE_ENV || 'development',
    });
  }
});
