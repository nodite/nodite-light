import { confirmDialog } from 'vuetify3-dialog';

import i18n from '@/plugins/i18n';

export const deleteConfirm = async (message: string): Promise<boolean> => {
  return confirmDialog({
    title: i18n.ndt('Delete Confirm'),
    text: message,
    confirmationText: i18n.ndt('Confirm'),
    confirmationButtonOptions: {
      color: 'error',
    } as any,
    cancelText: i18n.ndt('Cancel'),
    level: 'error',
  });
};

export default {
  deleteConfirm,
};
