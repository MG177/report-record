'use client'
import Link from 'next/link'

interface ButtonProps {
  text: string
  link?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

export default function Button({
  text,
  link,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md'
  
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }

  const styles = `${baseStyles} ${variantStyles[variant]} ${className}`

  if (link) {
    return (
      <Link href={link} className={styles}>
        {text}
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={styles}
    >
      {text}
    </button>
  )
}
