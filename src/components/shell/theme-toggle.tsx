'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Switch between light and dark theme"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          />
        }
      >
        {/* Both icons render; CSS picks one, so server and client markup match. */}
        <Sun className="hidden dark:block" aria-hidden />
        <Moon className="dark:hidden" aria-hidden />
      </TooltipTrigger>
      <TooltipContent>Switch theme</TooltipContent>
    </Tooltip>
  )
}
