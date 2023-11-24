import React from 'react'

type Rainbow = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'violet'

type AsProp<C extends React.ElementType> = {
  as?: C
}

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P)

// This is the first reusable type utility we built
type PolymorphicComponentProp<C extends React.ElementType, Props = {}> = React.PropsWithChildren<
  Props & AsProp<C>
> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>

// This is a new type utitlity with ref!
type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props = {},
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> }

// This is the type for the "ref" only
type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref']

/**
 * This is the updated component props using PolymorphicComponentPropWithRef
 */
type TextProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  { color?: Rainbow | 'black' }
>

/**
 * This is the type used in the type annotation for the component
 */
type TextComponent = <C extends React.ElementType = 'span'>(
  props: TextProps<C>
) => React.ReactElement | null

export const Text: TextComponent = React.forwardRef(
  <C extends React.ElementType = 'span'>(
    { as, color, children }: TextProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'span'

    const style = color ? { style: { color } } : {}

    return (
      <Component {...style} ref={ref}>
        {children}
      </Component>
    )
  }
) as TextComponent
