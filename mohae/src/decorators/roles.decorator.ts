import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = true;
export const Role = (role: boolean) => SetMetadata(ROLES_KEY, role);
