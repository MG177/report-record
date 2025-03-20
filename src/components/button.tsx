'use client'
import Link from 'next/link'

interface ButtonProps {
  text: string
  icon?: string
  iconPos?: 'left' | 'right'
  link?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

export default function Button({
  text,
  icon,
  iconPos = 'left',
  link,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  // Base styles with conditional padding based on whether there's text
  const baseStyles = `${
    text ? 'px-3' : 'px-3'
  } py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md min-w-[2.5rem]`

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }

  const styles = `${baseStyles} ${variantStyles[variant]} ${className}`

  const content = (
    <>
      {icon && iconPos === 'left' && (
        <i className={`pi ${icon} ${!text ? 'text-base' : ''}`} />
      )}
      {text}
      {icon && iconPos === 'right' && (
        <i className={`pi ${icon} ${!text ? 'text-base' : ''}`} />
      )}
    </>
  )

  if (link) {
    return (
      <Link href={link} className={styles}>
        {content}
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
      {content}
    </button>
  )
}
