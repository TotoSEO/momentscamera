'use client'

import Link from 'next/link'
import { motion, type HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-pop-red text-white shadow-pop hover:shadow-pop-lg',
  secondary: 'bg-pop-yellow text-ink shadow-pop hover:shadow-pop-lg',
  dark: 'bg-ink text-cream shadow-[5px_6px_0_0_var(--color-pop-blue)] hover:shadow-[9px_11px_0_0_var(--color-pop-blue)]',
  ghost: 'bg-paper text-ink shadow-pop-sm hover:shadow-pop',
}

const sizes: Record<Size, string> = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-7 py-3.5 text-base',
  lg: 'px-9 py-5 text-lg md:text-xl',
}

const base =
  'inline-flex items-center justify-center gap-2.5 rounded-full border-3 border-ink font-display font-bold ' +
  'transition-shadow duration-200 disabled:pointer-events-none disabled:opacity-50 select-none'

/** L'effet ressort est porté par Motion, pas par une transition CSS : il survit au tap mobile. */
const pop = {
  whileHover: { y: -3, x: -1 },
  whileTap: { y: 2, x: 1, scale: 0.98 },
  transition: { type: 'spring' as const, stiffness: 500, damping: 22 },
}

type ButtonProps = {
  variant?: Variant
  size?: Size
  shine?: boolean
} & HTMLMotionProps<'button'>

export function Button({ variant = 'primary', size = 'md', shine, className, ...props }: ButtonProps) {
  return (
    <motion.button
      {...pop}
      className={cn(base, variants[variant], sizes[size], shine && 'cta-shine', className)}
      {...props}
    />
  )
}

type ButtonLinkProps = {
  href: string
  variant?: Variant
  size?: Size
  shine?: boolean
  className?: string
  children: React.ReactNode
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  shine,
  className,
  children,
}: ButtonLinkProps) {
  const external = href.startsWith('http')
  const classes = cn(base, variants[variant], sizes[size], shine && 'cta-shine', className)

  if (external) {
    return (
      <motion.a {...pop} href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.div {...pop} className="inline-flex">
      <Link href={href} className={classes}>
        {children}
      </Link>
    </motion.div>
  )
}
