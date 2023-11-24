import { useRoutes } from 'react-router-dom'

import { AppLayout, AuthLayout } from '@/components/Layouts'
import { withAdmin, withLoggedIn, withLoggedOut } from '@/hooks/AuthContext'
import Error404 from '@/pages/404'
import { AdminDashboard } from '@/pages/admin'
import { Login, Recovery, ResetPassword } from '@/pages/auth'
import { UserDashboard } from '@/pages/users'

export const AppRoutes = () => {
  return useRoutes([
    {
      element: <AppLayout />,
      children: [
        { path: '/', element: withAdmin(AdminDashboard)() },
        { path: 'dashboard', element: withLoggedIn(UserDashboard)() },
      ],
    },
    {
      element: <AuthLayout />,
      children: [
        { path: 'login', element: withLoggedOut(Login)() },
        { path: 'recovery', element: withLoggedOut(Recovery)() },
        { path: 'reset-password', element: withLoggedOut(ResetPassword)() },
      ],
    },
    { path: '*', element: <Error404 /> },
  ])
}
