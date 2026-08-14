import { Router, Request, Response } from 'express';
import { db } from '../../database/db';

export const camerasRouter = Router();

camerasRouter.get('/', (req: Request, res: Response) => {
  let list = db.getCameras();
  const { storeId, status, search } = req.query;

  if (storeId && storeId !== 'All') {
    list = list.filter((c) => c.storeId === storeId);
  }

  if (status && status !== 'All') {
    list = list.filter((c) => c.status === status);
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.cameraCode && c.cameraCode.toLowerCase().includes(q)) ||
        (c.storeName && c.storeName.toLowerCase().includes(q)) ||
        (c.shelfName && c.shelfName.toLowerCase().includes(q))
    );
  }

  res.json(list);
});

camerasRouter.post('/', (req: Request, res: Response) => {
  const newCamera = db.createCamera(req.body);
  res.status(201).json(newCamera);
});

camerasRouter.put('/:id', (req: Request, res: Response) => {
  const updated = db.updateCamera(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Camera not found' });
  res.json(updated);
});

camerasRouter.delete('/:id', (req: Request, res: Response) => {
  const success = db.deleteCamera(req.params.id);
  if (!success) return res.status(404).json({ message: 'Camera not found' });
  res.json({ message: 'Camera deleted successfully' });
});
