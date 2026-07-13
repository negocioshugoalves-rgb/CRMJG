import Link from 'next/link'
import {
  Briefcase,
  Building2,
  ClipboardList,
  FileText,
  ListChecks,
  MessageSquare,
} from 'lucide-react'

const tabs = [
  { href: '', label: 'Resumo', icon: Building2 },
  { href: 'diagnostico', label: 'Diagnostico', icon: ClipboardList },
  { href: 'plano-acao', label: 'Plano de acao', icon: ListChecks },
  { href: 'propostas', label: 'Propostas', icon: FileText },
  { href: 'projetos', label: 'Projetos', icon: Briefcase },
  { href: 'interacoes', label: 'Interacoes', icon: MessageSquare },
]

export function CompanyNav({ empresaId }: { empresaId: string }) {
  return (
    <nav className="mb-6 flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const href = tab.href
          ? `/dashboard/empresas/${empresaId}/${tab.href}`
          : `/dashboard/empresas/${empresaId}`

        return (
          <Link
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-brand-paper"
            href={href}
            key={tab.label}
          >
            <Icon className="h-4 w-4 text-brand-bronze" />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
