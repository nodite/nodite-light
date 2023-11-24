import React, { useState } from 'react'
import { FieldError } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'

type PropsToOmit<P> = keyof P

// This is the first reusable type utility we built
type PolymorphicComponentProp<
  T extends React.ElementType,
  Props = {},
> = React.PropsWithChildren<Props> & Omit<React.ComponentPropsWithoutRef<T>, PropsToOmit<T>>

// This is a new type utitlity with ref!
type PolymorphicComponentPropWithRef<
  T extends React.ElementType,
  Props = {},
> = PolymorphicComponentProp<T, Props> & { ref?: PolymorphicRef<T> }

// This is the type for the "ref" only
type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref']

/**
 * This is the updated component props using PolymorphicComponentPropWithRef
 */
type PasswordInputProps<T extends React.ElementType> = PolymorphicComponentPropWithRef<
  T,
  {
    name: string
    label: string
    disabled?: boolean
    withResetLink?: boolean
    error?: FieldError | undefined
  }
>

/**
 * This is the type used in the type annotation for the component
 */
type PasswordInputComponent = <T extends React.ElementType = 'input'>(
  props: PasswordInputProps<T>
) => React.ReactElement | null

export const PasswordInput: PasswordInputComponent = React.forwardRef(
  <T extends React.ElementType = 'input'>(
    {
      name,
      label,
      disabled = false,
      withResetLink = false,
      error,
      ...props
    }: PasswordInputProps<T>,
    ref?: PolymorphicRef<T>
  ) => {
    const [reveal, setReveal] = useState<boolean>(false)
    const RevealIcon = reveal ? EyeIcon : EyeSlashIcon

    return (
      <fieldset disabled={disabled}>
        <div className='flex items-center justify-between'>
          <label htmlFor={name} className='mb-2 block text-sm text-gray-600 dark:text-white'>
            {label}
          </label>
          {withResetLink && (
            <Link
              to='/recovery'
              className='text-sm text-blue-600 decoration-2 hover:underline'
              tabIndex={-1}
            >
              Forgot password?
            </Link>
          )}
        </div>
        <div className='relative'>
          <input
            id={name}
            name={name}
            className='block w-full rounded-md border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
            type={reveal ? 'text' : 'password'}
            aria-describedby={`${name}-error`}
            disabled={disabled}
            ref={ref}
            {...props}
          />
          <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
            <button type='button' onClick={() => setReveal((prevState) => !prevState)}>
              <RevealIcon className='h-6 w-6 text-gray-500' />
            </button>
          </div>
          <div className='pointer-events-none absolute inset-y-0 right-0 hidden items-center pr-3'>
            <svg
              className='h-5 w-5 text-red-500'
              width={16}
              height={16}
              fill='currentColor'
              viewBox='0 0 16 16'
              aria-hidden='true'
            >
              <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z' />
            </svg>
          </div>
        </div>
        {error && (
          <span className='mt-2 text-xs text-red-600'>
            {error.message || 'This field is required'}
          </span>
        )}
      </fieldset>
    )
  }
) as PasswordInputComponent
