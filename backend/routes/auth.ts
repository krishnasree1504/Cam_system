import { Router, Request, Response } from 'express';
import { db } from '../../database/db';

export const authRouter = Router();

authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = db.getUserByEmail(email);

  if (user) {
    const token = `jwt_mock_token_${user.id}_${Date.now()}`;
    return res.json({ token, user });
  }

  // Fallback demo account login
  const fallbackUser = db.createUser({
    name: email.split('@')[0],
    email,
    role: email.includes('admin') ? 'Admin' : email.includes('manager') ? 'Store Manager' : 'Analyst',
  });

  const token = `jwt_mock_token_${fallbackUser.id}_${Date.now()}`;
  return res.json({ token, user: fallbackUser });
});

authRouter.post('/register', (req: Request, res: Response) => {
  const { name, email, password, role, assignedStoreId, assignedStoreName } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (role === 'Store Manager' && !assignedStoreId) {
    return res.status(400).json({ message: 'Assigned store is required for Store Managers' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  let finalStoreName = assignedStoreName;
  if (assignedStoreId && !finalStoreName) {
    const store = db.getStores().find((s) => s.id === assignedStoreId);
    if (store) finalStoreName = store.name;
  }

  const user = db.createUser({
    name,
    email,
    role,
    assignedStoreId: role === 'Store Manager' ? assignedStoreId : undefined,
    assignedStoreName: role === 'Store Manager' ? finalStoreName : undefined,
  });
  const token = `jwt_mock_token_${user.id}_${Date.now()}`;
  return res.status(201).json({ token, user });
});

authRouter.get('/me', (req: Request, res: Response) => {
  const users = db.getUsers();
  return res.json({ user: users[0] });
});
