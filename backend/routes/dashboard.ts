import { Router, Request, Response } from 'express';
import { db } from '../../database/db';

export const dashboardRouter = Router();

dashboardRouter.get('/stats', (req: Request, res: Response) => {
  res.json(db.getStats());
});
