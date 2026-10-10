import { redirect } from 'next/navigation'
import { AuthBrandPanel } from '@/components/auth-brand-panel'
import { Logo } from '@/components/shell/logo'
import { ThemeToggle } from '@/components/shell/theme-toggle'
import { getSession } from '@/lib/session'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (await getSession()) redirect('/projects')

  return (
    <div className="grid min-h-dvh flex-1 lg:grid-cols-2">
      <AuthBrandPanel />
      <div className="flex flex-col bg-card">
        <div className="flex items-center justify-between p-4">
          <Logo className="lg:invisible" />
          <ThemeToggle />
        </div>
        <main className="flex flex-1 items-center justify-center px-6 pb-16">{children}</main>
      </div>
    </div>
  )
}
