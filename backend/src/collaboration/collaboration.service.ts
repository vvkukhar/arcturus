import { CollaborationUser } from './collaboration.model';
import { generateId } from '../lib/utils';

export class CollaborationService {
  async addUser(name: string, role: string) {
    return CollaborationUser.create({ id: generateId(), name, role });
  }

  async listUsers() {
    return CollaborationUser.findAll();
  }
}