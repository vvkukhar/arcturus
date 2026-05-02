import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export type UserRole = 'admin' | 'operator' | 'viewer';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);