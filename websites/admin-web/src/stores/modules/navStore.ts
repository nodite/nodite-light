import { NavigationConfig } from '@/types/config';

interface NavState {
  routesLoaded: boolean;
  routes: NavigationConfig.Route[];
  sidebarLoaded: boolean;
  sidebar: NavigationConfig.Menu[];
}

export const useNavStore = defineStore('nav', {
  state: (): NavState => ({
    routesLoaded: false,
    routes: [],
    sidebarLoaded: false,
    sidebar: [],
  }),

  persist: [{ storage: sessionStorage, paths: ['sidebarLoaded', 'sidebar'] }],

  getters: {
    isRouterReady(state: NavState): boolean {
      return state.routesLoaded;
    },
  },

  actions: {},
});
