import currency from '@/configs/currencies';
import locales from '@/configs/locales';

export default {
  // product display information
  product: {
    name: import.meta.env.VITE_APP_TITLE || 'Nodite Light',
    version: '1.0.0',
  },

  locales,
  currency,
};
