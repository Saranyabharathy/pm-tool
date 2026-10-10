import { hueBackground, initials } from '@/lib/color'
import { cn } from '@/lib/utils'

const sizes = {
  sm: 'size-5 text-[10px]',
  md: 'size-6 text-[11px]',
  lg: 'size-8 text-xs',
}

type UserAvatarProps = {
  id: string
  name: string
  size?: keyof typeof sizes
  className?: string
}

// Initials on the person's identity hue. The name is exposed as the label and
// as a native tooltip.
export function UserAvatar({ id, name, size = 'md', className }: UserAvatarProps) {
  return (
    <span
      role="img"
      aria-label={name}
      title={name}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none',
        hueBackground(id),
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
