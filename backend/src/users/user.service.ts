import bcrypt from 'bcrypt';
import { User } from './user.model';

export class UserService {
  async createUser(name: string, email: string, password: string, role: 'admin' | 'operator' = 'operator') {
    const passwordHash = await bcrypt.hash(password, 10);
    return User.create({
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash,
      role,
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  async getAll(): Promise<User[]> {
    return User.findAll();
  }
}