import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import clsx from 'clsx'

type CardProps<T extends ElementType> = {
  as?: T
  children: ReactNode
  className?: string
} & ComponentPropsWithoutRef<T>

export const Card = <T extends ElementType = 'div'>({ as, children, className }: CardProps<T>) => {
  const Component = as || 'div'
  return (
    <Component
      className={clsx(
        'rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800',
        className
      )}
    >
      {children}
    </Component>
  )
}
