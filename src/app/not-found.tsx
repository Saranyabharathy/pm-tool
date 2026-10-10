import Link from 'next/link'
import { buttonClass } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold text-white">Page not found</h1>
      <p className="text-sm text-slate-400">It does not exist, or you do not have access to it.</p>
      <Link href="/projects" className={buttonClass('secondary')}>
        Back to projects
      </Link>
    </div>
  )
}
