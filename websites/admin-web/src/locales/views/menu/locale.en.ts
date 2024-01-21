export default {
  title: 'Menu',

  form: {
    parentRoot: 'Root',
    parent: 'Parent Menu',
    menuName: 'Menu Name',
    orderNum: 'Order',
    iType: 'Menu Type',
    icon: 'Icon',
    path: 'Path',
    redirect: 'redirect to',
    component: 'Component',
    componentHint: 'The path of the component to be rendered.',
    layout: 'Layout',
    layoutHint: 'The layout used for component render.',
    perms: 'Permission',
    permsHint: 'Format: [dom]:[obj]:[act], e.g. admin:menu:create',
    hidden: 'Visibility',
  },

  headers: {
    menuName: 'Menu Name',
    i18nName: 'i18n Name',
    orderNum: 'Order',
    path: 'Path',
    iType: 'Type',
    hidden: 'Visibility',
    perms: 'Perms',
  },

  type: {
    overline: 'Overline',
    directory: 'Directory',
    menu: 'Menu',
    action: 'Action',
  },

  treeview: {
    expandOrCollapse: 'Expand/Collapse',
    selectAllOrNone: 'Select All/None',
    linkageOrNot: 'Linkage/Not',
  },
};
