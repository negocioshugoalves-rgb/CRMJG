import Link from 'next/link'
import { ArrowRight, Building2, ClipboardList, FileText, MessageSquare } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { createClient } from '@/lib/supabase/server'
import type { Empresa } from '@/lib/types'
import { STATUS_FUNIL_LABELS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

async function countRows(table: string) {
  const supabase = createClient()
  const { count } = await supabase.from(table).select('id', { count: 'exact', head: true })
  return count ?? 0
}

export default async function DashboardPage() {
  const supabase = createClient()
  const [{ data: empresas }, totalEmpresas, totalDiagnosticos, totalPropostas, totalInteracoes] =
    await Promise.all([
      supabase
        .from('empresas')
        .select('id,nome,segmento,status_funil,contato_nome,criado_em')
        .order('criado_em', { ascending: false })
        .limit(6),
      countRows('empresas'),
      countRows('diagnosticos'),
      countRows('propostas'),
      countRows('interacoes'),
    ])

  const cards = [
    { label: 'Empresas', value: totalEmpresas, icon: Building2, href: '/dashboard/empresas' },
    {
      label: 'Diagnosticos',
      value: totalDiagnosticos,
      icon: ClipboardList,
      href: '/dashboard/diagnosticos',
    },
    { label: 'Propostas', value: totalPropostas, icon: FileText, href: '/dashboard/propostas' },
    {
      label: 'Interacoes',
      value: totalInteracoes,
      icon: MessageSquare,
      href: '/dashboard/interacoes',
    },
  ]

  return (
    <>
      <PageHeader
        title="Resumo comercial"
        description="Acompanhe o funil, os diagnosticos, as propostas e os proximos contatos em um unico painel."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md" href={card.href} key={card.label}>
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-brand-bronze" />
                <ArrowRight className="h-4 w-4 text-stone-400" />
              </div>
              <p className="mt-6 text-sm font-medium text-stone-600">{card.label}</p>
              <p className="mt-1 text-3xl font-bold text-brand-ink">{card.value}</p>
            </Link>
          )
        })}
      </section>

      <section className="mt-8 panel overflow-hidden">
        <div className="border-b border-stone-200 px-5 py-4">
          <h3 className="font-semibold text-brand-ink">Empresas recentes</h3>
        </div>
        <div className="divide-y divide-stone-100">
          {(empresas as Pick<Empresa, 'id' | 'nome' | 'segmento' | 'status_funil' | 'contato_nome'>[] | null)?.length ? (
            (empresas as Pick<Empresa, 'id' | 'nome' | 'segmento' | 'status_funil' | 'contato_nome'>[]).map((empresa) => (
              <div className="grid gap-2 px-5 py-4 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center" key={empresa.id}>
                <div>
                  <p className="font-semibold text-brand-ink">{empresa.nome}</p>
                  <p className="text-sm text-stone-500">{empresa.segmento}</p>
                </div>
                <p className="text-sm text-stone-600">{empresa.contato_nome}</p>
                <span className="w-fit rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">
                  {STATUS_FUNIL_LABELS[empresa.status_funil]}
                </span>
                <Link className="text-sm font-semibold text-brand-bronze" href="/dashboard/empresas">
                  Abrir
                </Link>
              </div>
            ))
          ) : (
            <p className="px-5 py-8 text-sm text-stone-500">Nenhuma empresa cadastrada ainda.</p>
          )}
        </div>
      </section>
    </>
  )
}
