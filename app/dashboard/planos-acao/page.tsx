import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { PRIORIDADE_LABELS, SETOR_LABELS, STATUS_ACAO_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, PlanoAcao } from '@/lib/types'

export const dynamic = 'force-dynamic'

type PlanoComEmpresa = PlanoAcao & { empresas?: Pick<Empresa, 'id' | 'nome'> | null }

export default async function PlanosAcaoPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('planos_acao')
    .select('*, empresas(id,nome)')
    .order('ordem')
    .order('criado_em', { ascending: false })

  const planos = (data ?? []) as PlanoComEmpresa[]

  return (
    <>
      <PageHeader title="Planos de acao" description="Visao geral das acoes planejadas. Para cadastrar novas acoes, abra o dossie da empresa." />
      {planos.length ? <section className="panel overflow-hidden"><div className="grid border-b border-stone-200 bg-stone-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 md:grid-cols-[1fr_1.2fr_0.8fr_0.8fr_0.8fr_auto]"><span>Empresa</span><span>Acao</span><span>Area</span><span>Status</span><span>Prioridade</span><span></span></div><div className="divide-y divide-stone-100">{planos.map((plano) => <Link className="grid gap-2 px-5 py-4 text-sm transition hover:bg-stone-50 md:grid-cols-[1fr_1.2fr_0.8fr_0.8fr_0.8fr_auto] md:items-center" href={plano.empresas?.id ? `/dashboard/empresas/${plano.empresas.id}/plano-acao` : '/dashboard/empresas'} key={plano.id}><span className="font-semibold text-brand-ink">{plano.empresas?.nome || 'Empresa'}</span><span>{plano.titulo}</span><span>{SETOR_LABELS[plano.setor]}</span><span>{STATUS_ACAO_LABELS[plano.status]}</span><span>{PRIORIDADE_LABELS[plano.prioridade]}</span><ArrowRight className="h-4 w-4 text-stone-400" /></Link>)}</div></section> : <EmptyState message="Nenhuma acao cadastrada. Abra uma empresa e crie o primeiro plano de acao." />}
    </>
  )
}
