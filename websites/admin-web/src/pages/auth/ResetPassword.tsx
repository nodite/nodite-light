import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import clsx from 'clsx'

import { Alert } from '@/components/Alerts/Alert'
import { Button } from '@/components/Buttons'
import { Card } from '@/components/Containers'
import { PasswordInput } from '@/components/Inputs'
import { auth } from '@/hooks/AuthProvider'

interface ResetPasswordTypes {
  password: string
}

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams('')
  const token = searchParams.get('recovery_token') as string
  const [success, setSuccess] = useState('')
  const [failed, setFailed] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordTypes>()

  const handleResetPassword = (data: ResetPasswordTypes) => {
    if (!token) {
      setFailed('You need a recovery token to continue!')
    }
    auth
      .verify('recovery', token)
      .then((response) => {
        response
          .update({ password: data.password })
          .then((result) => {
            setSuccess(
              `Password has been reset. Now, you can login with your email address: ${result.email}`
            )
          })
          .catch((error) => setFailed(`Failed to reset your password: ${error.message}`))
      })
      .catch((error) => setFailed(`Failed to reset your password: ${error.message}`))
  }

  useEffect(() => {
    if (!token) {
      navigate('/recovery')
    }
  }, [token, navigate])

  return (
    <main className='mx-auto w-full max-w-md p-6'>
      {failed && <Alert variant='danger'>{failed}</Alert>}

      <Card>
        {success && (
          <div className='p-4 sm:px-7 sm:pb-8'>
            <Alert variant='success'>{success}</Alert>
            <div className='mt-6 grid w-full text-center'>
              <Button as={Link} variant='primary' to='/login'>
                Continue to your account &rarr;
              </Button>
            </div>
          </div>
        )}

        <div className={clsx('p-4 sm:px-7 sm:py-8', success && 'hidden')}>
          <form autoComplete='off' onSubmit={handleSubmit(handleResetPassword)}>
            <div className='grid gap-y-4'>
              <PasswordInput
                label='New Password'
                {...register('password', {
                  required: 'You must specify a password',
                  minLength: {
                    value: 8,
                    message: 'Password must have at least 8 characters',
                  },
                })}
                error={errors.password}
              />
            </div>
            <div className='mt-6 grid w-full'>
              <Button
                type='submit'
                variant='primary'
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Reset Password
              </Button>
            </div>
          </form>

          <div className='mt-8 text-center'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {'Remember your password? '}
              <Link to='/login' className='text-blue-600 decoration-2 hover:underline'>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </main>
  )
}
