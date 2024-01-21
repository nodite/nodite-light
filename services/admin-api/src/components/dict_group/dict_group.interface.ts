import { IDictGroup } from '@/components/dict_group/dict_group.model';

export type DictGroupTree = IDictGroup & { level?: number; children?: DictGroupTree[] };
