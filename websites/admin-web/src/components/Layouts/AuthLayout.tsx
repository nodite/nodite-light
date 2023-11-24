import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <main className='flex h-full min-h-screen items-center bg-gray-100 py-16 dark:bg-slate-900'>
      <Outlet />
    </main>
  )
}
