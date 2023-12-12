import piniaPersist from 'pinia-plugin-persist';

const store = createPinia();
store.use(piniaPersist);

export default store;
