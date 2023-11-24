import React from 'react'
import clsx from 'clsx'

import { classes } from './styles'

type AsProp<T extends React.ElementType> = {
  as?: T
}

type PropsToOmit<T extends React.ElementType, P> = keyof (AsProp<T> & P)

// This is the first reusable type utility we built
type PolymorphicComponentProp<T extends React.ElementType, Props = {}> = React.PropsWithChildren<
  Props & AsProp<T>
> &
  Omit<React.ComponentPropsWithoutRef<T>, PropsToOmit<T, Props>>

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
type ButtonProps<T extends React.ElementType> = PolymorphicComponentPropWithRef<
  T,
  {
    type?: 'button' | 'submit'
    variant?: 'default' | 'primary' | 'danger'
    size?: 'sm' | 'base' | 'lg'
    disabled?: boolean
    loading?: boolean
    className?: string
  }
>

/**
 * This is the type used in the type annotation for the component
 */
type ButtonComponent = <T extends React.ElementType = 'button'>(
  props: ButtonProps<T>
) => React.ReactElement | null

export const Button: ButtonComponent = React.forwardRef(
  <T extends React.ElementType = 'button'>(
    {
      as,
      type = 'button',
      variant = 'default',
      size = 'base',
      loading,
      className,
      children,
      ...props
    }: ButtonProps<T>,
    ref?: PolymorphicRef<T>
  ) => {
    const Component = as || 'button'
    return (
      <Component
        className={clsx(
          classes.base,
          classes.size[size],
          classes.variant[variant],
          props.disabled && classes.disabled,
          loading && classes.disabled,
          className
        )}
        type={type}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    )
  }
) as ButtonComponent
