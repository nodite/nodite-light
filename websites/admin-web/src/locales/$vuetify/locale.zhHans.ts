import { localeZhHans as DeleteConfirmForm } from '@nodite-light/vuetify-delete-confirm-form';
import { localeZhHans as IconPicker } from '@nodite-light/vuetify-icon-picker';
import { localeZhHans as LanguageSelector } from '@nodite-light/vuetify-language-selector';

export default {
  badge: '徽章',
  close: '关',
  input: {
    appendAction: '追加操作',
  },
  dataIterator: {
    noResultsText: '未找到匹配的记录',
    loadingText: '正在载入项目...',
  },
  dataTable: {
    itemsPerPageText: '每页行数：',
    ariaLabel: {
      sortDescending: '降序排列。',
      sortAscending: '升序排列。',
      sortNone: '未排序。',
      activateNone: '激活以删除排序。',
      activateDescending: '激活以降序排列。',
      activateAscending: '激活以升序排序。',
    },
    sortBy: '排序方式',
  },
  dataFooter: {
    itemsPerPageText: '每页项目：',
    itemsPerPageAll: '所有',
    nextPage: '下一页',
    prevPage: '上一页',
    firstPage: '第一页',
    lastPage: '最后一页',
    pageText: '{2}中的{0}-{1}',
  },
  datePicker: {
    itemsSelected: '已选择{0}',
    nextMonthAriaLabel: '下个月',
    nextYearAriaLabel: '明年',
    prevMonthAriaLabel: '上个月',
    prevYearAriaLabel: '去年',
  },
  noDataText: '无可用数据',
  carousel: {
    prev: '上一张',
    next: '下一张',
    ariaLabel: {
      delimiter: '{1}的轮播幻灯片{0}',
    },
  },
  calendar: {
    moreEvents: '还有{0}个',
  },
  fileInput: {
    counter: '{0}个文件',
    counterSize: '{0}个文件（共{1}个）',
  },
  timePicker: {
    am: 'AM',
    pm: 'PM',
  },
  pagination: {
    ariaLabel: {
      wrapper: '分页导航',
      next: '下一页',
      previous: '上一页',
      page: '转到页面{0}',
      currentPage: '当前页，第{0}页',
    },
  },

  ...IconPicker,
  ...DeleteConfirmForm,
  ...LanguageSelector,
};
