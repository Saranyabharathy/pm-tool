'use client'

import { Check } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import dynamic from 'next/dynamic'
import BlurText from '@/components/reactbits/blur-text'
import { Logo } from '@/components/shell/logo'

// Canvas animation: client only, and not needed for first paint.
const ShapeGrid = dynamic(() => import('@/components/reactbits/shape-grid'), { ssr: false })

const HEADLINE = 'Keep every project moving.'

const points = ['Boards you can drag and drop', 'Priorities, due dates and owners', 'Comments next to the work']

// The decorative half of the sign-in screens. Nobody works here, so this is
// one of the few places motion is allowed (DESIGN.md, section 9).
export function AuthBrandPanel() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative hidden overflow-hidden bg-hue-1 text-white lg:flex lg:flex-col lg:justify-between lg:p-10">
      {!reduceMotion && (
        <div className="absolute inset-0 opacity-70" aria-hidden>
          <ShapeGrid
            direction="diagonal"
            speed={0.25}
            squareSize={48}
            borderColor="rgba(255, 255, 255, 0.14)"
            hoverFillColor="rgba(255, 255, 255, 0.1)"
          />
        </div>
      )}
      {/* Keeps the text readable over the grid. */}
      <div className="absolute inset-0 bg-linear-to-t from-hue-1 via-hue-1/60 to-transparent" aria-hidden />

      <Logo className="relative text-base text-white [&>span]:bg-white [&>span]:text-hue-1" />

      <div className="relative max-w-md">
        {reduceMotion ? (
          <h2 className="text-4xl leading-tight font-semibold tracking-tight">{HEADLINE}</h2>
        ) : (
          <h2 aria-label={HEADLINE}>
            <BlurText
              text={HEADLINE}
              delay={90}
              animateBy="words"
              direction="bottom"
              className="text-4xl leading-tight font-semibold tracking-tight"
            />
          </h2>
        )}
        <ul className="mt-6 space-y-2.5 text-[15px] text-white/90">
          {points.map((point) => (
            <li key={point} className="flex items-center gap-2.5">
              <span className="flex size-5 items-center justify-center rounded-full bg-white/20">
                <Check className="size-3.5" aria-hidden />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
