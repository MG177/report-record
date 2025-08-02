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
  // Base styles with mobile-first approach
  const baseStyles = `${
    text ? 'px-4 sm:px-6' : 'px-3'
  } py-3 sm:py-3.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95 min-h-[44px] min-w-[44px] text-sm sm:text-base`

  const variantStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-blue-600/25',
    secondary:
      'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100 hover:border-gray-300',
    danger:
      'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-red-600/25',
  }

  const styles = `${baseStyles} ${variantStyles[variant]} ${className}`

  const content = (
    <>
      {icon && iconPos === 'left' && (
        <i className={`pi ${icon} ${!text ? 'text-lg' : 'text-base'}`} />
      )}
      {text && <span className="whitespace-nowrap">{text}</span>}
      {icon && iconPos === 'right' && (
        <i className={`pi ${icon} ${!text ? 'text-lg' : 'text-base'}`} />
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
