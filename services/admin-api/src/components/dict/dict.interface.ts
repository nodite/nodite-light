import { IDictGroup } from '@/components/dict/dict_group.model';

export type IDictGroupCreate = Omit<IDictGroup, 'groupId'>;

export type IDictGroupUpdate = Omit<IDictGroup, 'groupId' | 'groupKey'>;
