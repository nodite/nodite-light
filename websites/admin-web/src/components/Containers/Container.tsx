import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type ContainerProps<T extends ElementType> = {
  as?: T
  children: ReactNode
} & ComponentPropsWithoutRef<T>

export const Container = <T extends ElementType = 'div'>({
  as,
  children,
  ...props
}: ContainerProps<T>) => {
  const Component = as || 'div'
  return (
    <Component className='mx-auto h-full max-w-7xl' {...props}>
      {children}
    </Component>
  )
}
