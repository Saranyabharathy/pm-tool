import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (await getSession()) redirect('/projects')

  return <div className="flex flex-1 items-center justify-center p-4">{children}</div>
}
