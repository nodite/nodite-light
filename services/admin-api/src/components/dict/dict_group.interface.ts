import { IDictGroup } from '@/components/dict/dict_group.model';

export type DictGroupTree = IDictGroup & { level?: number; children?: DictGroupTree[] };
