export default {
  title: '菜单',

  form: {
    parentRoot: '根目录',
    parent: '上级菜单',
    menuName: '菜单名称',
    orderNum: '显示排序',
    iType: '菜单类型',
    icon: '图标',
    iKey: '国际化键',
    iKeyHint: '请联系前端同学添加至 locales',
    path: '路径',
    redirect: '跳转至',
    component: '渲染组件',
    componentHint: '需要渲染的组件路径',
    layout: '布局',
    layoutHint: '用于视图显示的布局',
    perms: '权限标识',
    permsHint: '格式: [dom]:[obj]:[act], 例如: admin:menu:create',
    hidden: '是否隐藏',
  },

  headers: {
    menuName: '菜单名称',
    i18nName: '国际化名称',
    orderNum: '排序',
    path: '路径',
    iType: '类型',
    hidden: '可见性',
    perms: '权限',
  },

  type: {
    overline: 'Overline',
    directory: '目录',
    menu: '菜单',
    action: '操作',
  },

  treeview: {
    expandOrCollapse: '展开/折叠',
    selectAllOrNone: '全选/全不选',
    linkageOrNot: '父子联动',
  },
};
