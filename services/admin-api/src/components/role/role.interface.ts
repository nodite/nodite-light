import { IRole } from '@/components/role/role.model';

export type IRoleCreate = Omit<IRole, 'roleId'>;

export type IRoleUpdate = Omit<IRole, 'roleId' | 'roleKey'>;
