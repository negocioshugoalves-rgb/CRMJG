import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  BarChart3,
  Building2,
  ClipboardList,
  FileText,
  HelpCircle,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { signOut } from './actions'

const navItems = [
  { href: '/dashboard', label: 'Resumo', icon: BarChart3 },
  { href: '/dashboard/empresas', label: 'Empresas', icon: Building2 },
  { href: '/dashboard/diagnosticos', label: 'Diagnosticos', icon: ClipboardList },
  { href: '/dashboard/propostas', label: 'Propostas', icon: FileText },
  { href: '/dashboard/interacoes', label: 'Interacoes', icon: MessageSquare },
  { href: '/dashboard/usuarios', label: 'Usuarios', icon: Users },
  { href: '/dashboard/configuracoes', label: 'Configuracoes', icon: Settings },
  { href: '/dashboard/ajuda', label: 'Ajuda', icon: HelpCircle },
]

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-brand-paper">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-stone-200 bg-white p-5 lg:block">
        <Link href="/dashboard" className="block">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-bronze">
            JG Represent
          </p>
          <h1 className="mt-2 text-2xl font-bold text-brand-ink">CRM</h1>
        </Link>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-brand-paper hover:text-brand-ink"
                href={item.href}
                key={item.href}
              >
                <Icon className="h-4 w-4 text-brand-bronze" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5">
          <p className="mb-3 truncate text-xs text-stone-500">{user.email}</p>
          <form action={signOut}>
            <button className="btn-secondary w-full" type="submit">
              Sair
            </button>
          </form>
        </div>
      </aside>

      <header className="border-b border-stone-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <Link className="font-bold text-brand-ink" href="/dashboard">
            CRM JG
          </Link>
          <form action={signOut}>
            <button className="btn-secondary" type="submit">
              Sair
            </button>
          </form>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <Link
              className="whitespace-nowrap rounded-md bg-brand-paper px-3 py-2 text-xs font-semibold text-stone-700"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
