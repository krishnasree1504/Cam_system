import { Router, Request, Response } from 'express';
import { db } from '../../database/db';

export const usersRouter = Router();

usersRouter.get('/', (req: Request, res: Response) => {
  res.json(db.getUsers());
});

usersRouter.post('/', (req: Request, res: Response) => {
  const newUser = db.createUser(req.body);
  res.status(201).json(newUser);
});

usersRouter.put('/:id', (req: Request, res: Response) => {
  const updated = db.updateUser(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'User not found' });
  res.json(updated);
});

usersRouter.delete('/:id', (req: Request, res: Response) => {
  const success = db.deleteUser(req.params.id);
  if (!success) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted successfully' });
});
