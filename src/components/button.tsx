'use client'
import Link from 'next/link'
import { MouseEvent } from 'react'

interface ButtonProps {
  text: string
  className?: string
  link?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

export default function Button({
  text,
  className,
  link,
  onClick,
}: ButtonProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      event.preventDefault()
      onClick(event)
    }
  }

  return (
    <Link
      className={`px-6 py-2 bg-secondary rounded-xl text-background text-md sm:text-lg md:text-xl font-bold max-h-[80px] truncate ${className}`}
      href={link || '#'}
      onClick={handleClick}
    >
      {text}
    </Link>
  )
}
