import { Router } from 'express';
import { UserService } from '../users/user.service';

const router = Router();
const service = new UserService();

router.get('/', async (req, res) => {
  const users = await service.getAll();
  res.json(users);
});

router.post('/', async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await service.createUser(name, email, password, role);
  res.json(user);
});

export default router;