'use client'
import Link from 'next/link'
import { MouseEvent } from 'react'

interface ButtonProps {
  text: string
  className?: string
  link?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  disabled?: boolean
}

export default function Button({
  text,
  className,
  link,
  onClick,
  disabled = false,
}: ButtonProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onClick && !disabled) {
      event.preventDefault()
      onClick(event)
    }
  }

  const baseClasses = `px-6 py-2 bg-secondary rounded-xl text-background text-md sm:text-lg md:text-xl font-bold max-h-[80px] truncate`
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <Link
      className={`${baseClasses} ${disabledClasses} ${className}`}
      href={disabled ? '#' : link || '#'}
      onClick={handleClick}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
    >
      {text}
    </Link>
  )
}
