export interface CacheStorage {
  set: (key: string, value?: string) => void;
  get: (key: string) => string | null;
  setJSON: (key: string, value: object) => void;
  getJSON: (key: string) => object | null;
  rm: (key: string) => void;
}

const SessionStorage: CacheStorage = {
  set: (key: string, value?: string): void => {
    if (!sessionStorage) return;
    sessionStorage.setItem(key, value || '');
  },
  get: (key: string): string | null => {
    if (!sessionStorage) return null;
    return sessionStorage.getItem(key);
  },
  setJSON: (key: string, value: object): void => {
    SessionStorage.set(key, JSON.stringify(value || {}));
  },
  getJSON: (key: string): object | null => {
    const value = SessionStorage.get(key);
    if (!value) return null;
    return JSON.parse(value);
  },
  rm: (key: string): void => {
    if (!sessionStorage) return;
    sessionStorage.removeItem(key);
  },
};

const LocalStorage: CacheStorage = {
  set: (key: string, value?: string): void => {
    if (!localStorage) return;
    localStorage.setItem(key, value || '');
  },
  get: (key: string): string | null => {
    if (!localStorage) return null;
    return localStorage.getItem(key);
  },
  setJSON: (key: string, value: object): void => {
    LocalStorage.set(key, JSON.stringify(value || {}));
  },
  getJSON: (key: string): object | null => {
    const value = LocalStorage.get(key);
    if (!value) return null;
    return JSON.parse(value);
  },
  rm: (key: string): void => {
    if (!localStorage) return;
    localStorage.removeItem(key);
  },
};

export default { local: LocalStorage, session: SessionStorage };
