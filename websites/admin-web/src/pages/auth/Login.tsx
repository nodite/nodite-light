import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { Alert } from '@/components/Alerts/Alert'
import { Button } from '@/components/Buttons'
import { Card } from '@/components/Containers'
import { HorizontalDivider } from '@/components/Dividers'
import { PasswordInput, TextInput } from '@/components/Inputs'
import { GitHubButton, GoogleButton } from '@/components/SocialButton'
import { auth, useAuthentication } from '@/hooks/AuthProvider'

interface LoginTypes {
  email: string
  password: string
}

export default function Login() {
  const { login, loggedOut } = useAuthentication()
  const [failed, setFailed] = useState<string | null>()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginTypes>()

  const handleLogin = (data: LoginTypes) => {
    setFailed(null)
    const { email, password } = data
    auth
      .login(email, password, true)
      .then((_response) => login())
      .catch((error) => setFailed(error.message))
  }

  return (
    <main className='mx-auto w-full max-w-md p-6'>
      {failed && <Alert variant='danger'>{failed}</Alert>}
      {loggedOut && (
        <Alert variant='success'>
          <span className='font-bold'>Goodbye!</span> Your session has been terminated.
        </Alert>
      )}

      <Card>
        <div className='p-4 sm:px-7 sm:py-8'>
          <div className='space-y-2'>
            <GoogleButton />
            <GitHubButton />
          </div>

          <HorizontalDivider label='Or' />

          <form autoComplete='off' onSubmit={handleSubmit(handleLogin)}>
            <div className='grid gap-y-4'>
              <div>
                <TextInput
                  label='Email address'
                  {...register('email', { required: true })}
                  error={errors.email}
                />
              </div>

              <PasswordInput
                label='Password'
                disabled={isSubmitting}
                {...register('password', { required: true })}
                error={errors.password}
                withResetLink
              />
            </div>
            <div className='mt-6 grid w-full'>
              <Button
                type='submit'
                variant='primary'
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Sign in
              </Button>
            </div>
          </form>

          <div className='mt-8 text-center'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              <Link to='/' className='text-blue-600 decoration-2 hover:underline'>
                &larr; Go back to homepage
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </main>
  )
}
