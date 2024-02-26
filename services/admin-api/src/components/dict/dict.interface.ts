import { IDictGroup } from '@/components/dict/dict_group.model';
import { IDictType } from '@/components/dict/dict_type.model';

export type IDictGroupCreate = Omit<IDictGroup, 'groupId'>;

export type IDictGroupUpdate = Omit<IDictGroup, 'groupId' | 'groupKey'>;

export type IDictTypeCreate = Omit<IDictType, 'dictId'>;

export type IDictTypeUpdate = Omit<IDictType, 'dictId' | 'dictKey'>;
