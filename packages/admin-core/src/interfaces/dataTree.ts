export interface BuildOptions {
  idKey?: string;
  pidKey?: string;
}

export type DataTree<T> = T & { level?: number; children?: T[] };
