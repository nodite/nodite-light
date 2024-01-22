import { Pinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

class SingletonPinia {
  static instance: Pinia;
}

if (!SingletonPinia.instance) {
  SingletonPinia.instance = createPinia();
  SingletonPinia.instance.use(piniaPluginPersistedstate);
}

export default SingletonPinia.instance;
