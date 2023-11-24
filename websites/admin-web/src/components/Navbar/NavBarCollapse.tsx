export function NavBarCollapse() {
  return (
    <div className='flex h-full min-h-screen w-16 flex-col items-center overflow-hidden rounded-r bg-white text-gray-700 shadow-sm dark:border-r dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400'>
      <a className='mt-3 flex items-center justify-center' href='/'>
        <svg
          className='h-8 w-8 fill-current'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path d='M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z' />
        </svg>
      </a>
      <div className='mt-3 flex flex-col items-center border-t border-gray-300 dark:border-gray-700'>
        <a
          className='mt-2 flex h-12 w-12 items-center justify-center rounded hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300'
          href='/'
        >
          <svg
            className='h-6 w-6 stroke-current'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
            />
          </svg>
        </a>
        <a
          className='mt-2 flex h-12 w-12 items-center justify-center rounded hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300'
          href='/'
        >
          <svg
            className='h-6 w-6 stroke-current'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </a>
        <a
          className='mt-2 flex h-12 w-12 items-center justify-center rounded bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
          href='/'
        >
          <svg
            className='h-6 w-6 stroke-current'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
        </a>
        <a
          className='mt-2 flex h-12 w-12 items-center justify-center rounded hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300'
          href='/'
        >
          <svg
            className='h-6 w-6 stroke-current'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2'
            />
          </svg>
        </a>
      </div>
      <div className='mt-2 flex flex-col items-center border-t border-gray-300 dark:border-gray-700'>
        <a
          className='mt-2 flex h-12 w-12 items-center justify-center rounded hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300'
          href='/'
        >
          <svg
            className='h-6 w-6 stroke-current'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
            />
          </svg>
        </a>
        <a
          className='mt-2 flex h-12 w-12 items-center justify-center rounded hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300'
          href='/'
        >
          <svg
            className='h-6 w-6 stroke-current'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
            />
          </svg>
        </a>
        <a
          className='relative mt-2 flex h-12 w-12 items-center justify-center rounded hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300'
          href='/'
        >
          <svg
            className='h-6 w-6 stroke-current'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
            />
          </svg>
          <span className='absolute left-0 top-0 ml-2 mt-2 h-2 w-2 rounded-full bg-red-500' />
        </a>
      </div>
      <a
        className='mt-auto flex h-16 w-16 items-center justify-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300'
        href='/'
      >
        <svg
          className='h-6 w-6 stroke-current'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      </a>
    </div>
  )
}
