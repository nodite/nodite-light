import type { FC } from 'react'
import clsx from 'clsx'

interface HorizontalDividerProps {
  label?: string
  className?: string
}

export const HorizontalDivider: FC<HorizontalDividerProps> = ({ label, className }) => {
  const defaultClassName =
    'flex py-5 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600 before:border-t before:border-gray-200 after:border-t after:border-gray-200'
  const withLabelClassName =
    'items-center text-xs uppercase text-gray-400 before:mr-6 after:ml-6 before:flex-[1_1_0%] after:flex-[1_1_0%]'

  return (
    <div className={clsx(defaultClassName, label && withLabelClassName, className)}>
      {label && label}
    </div>
  )
}
