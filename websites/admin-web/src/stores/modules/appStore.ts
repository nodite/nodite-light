import { defineStore } from 'pinia';

export const useAppStore = defineStore({
  id: 'app',
  state: () => ({
    globalLoading: false,
  }),

  persist: [{ storage: localStorage, paths: [] }],

  getters: {},
  actions: {
    setGlobalLoading(value: boolean) {
      this.globalLoading = value;
    },
  },
});
