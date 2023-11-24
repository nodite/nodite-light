export const classes = {
  base: 'focus:outline-none focus:ring-2 focus:ring-offset-2 border border-transparent transition ease-in-out duration-300 rounded-md',
  disabled: 'opacity-50 cursor-not-allowed',
  size: {
    sm: 'px-4 py-2 text-xs',
    base: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-lg',
  },
  variant: {
    default:
      'dark:focus:ring-offset-gray-800 hover:bg-gray-600 bg-gray-800 focus:ring-gray-500 text-white',
    primary:
      'dark:focus:ring-offset-gray-800 hover:bg-blue-600 bg-blue-500 focus:ring-blue-500 text-white',
    danger:
      'dark:focus:ring-offset-gray-800 hover:bg-red-600 bg-red-500 focus:ring-red-500 text-white',
  },
}
