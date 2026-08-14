import { Router, Request, Response } from 'express';
import { db } from '../../database/db';

export const storesRouter = Router();

storesRouter.get('/', (req: Request, res: Response) => {
  let list = db.getStores();
  const { status, search } = req.query;

  if (status && status !== 'All') {
    list = list.filter((s) => s.status === status);
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.storeCode && s.storeCode.toLowerCase().includes(q)) ||
        (s.city && s.city.toLowerCase().includes(q)) ||
        (s.state && s.state.toLowerCase().includes(q)) ||
        (s.managerName && s.managerName.toLowerCase().includes(q))
    );
  }

  res.json(list);
});

storesRouter.post('/', (req: Request, res: Response) => {
  const newStore = db.createStore(req.body);
  res.status(201).json(newStore);
});

storesRouter.put('/:id', (req: Request, res: Response) => {
  const updated = db.updateStore(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Store not found' });
  res.json(updated);
});

storesRouter.delete('/:id', (req: Request, res: Response) => {
  const success = db.deleteStore(req.params.id);
  if (!success) return res.status(404).json({ message: 'Store not found' });
  res.json({ message: 'Store deleted successfully' });
});
