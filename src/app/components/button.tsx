"use client"
import Link from 'next/link'

interface ButtonProps {
    text: string;
    className?: string;
    link?: string;
}

export default function Button({ text, className, link }: ButtonProps) {
    return (
        <Link
            className={`px-6 py-2 bg-secondary rounded-xl text-background text-md sm:text-lg md:text-xl font-bold max-h-[80px] truncate ${className}`}
            href={link || '#'}
        >
            {text}
        </Link>
    );
}