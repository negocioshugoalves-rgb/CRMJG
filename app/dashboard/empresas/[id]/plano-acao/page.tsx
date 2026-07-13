import Link from 'next/link'
import { Plus } from 'lucide-react'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { PRIORIDADE_LABELS, SETOR_LABELS, STATUS_ACAO_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, PlanoAcao } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function PlanoAcaoEmpresaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: planosData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('planos_acao').select('*').eq('empresa_id', params.id).order('ordem'),
  ])
  if (!empresaData) notFound()
  const empresa = empresaData as Empresa
  const planos = (planosData ?? []) as PlanoAcao[]

  return (
    <>
      <PageHeader title={`Plano de acao - ${empresa.nome}`} description="Consulte as acoes planejadas e crie novas etapas quando necessario." />
      <CompanyNav empresaId={empresa.id} />
      <div className="mb-6 flex justify-end"><Link className="btn-primary" href={`/dashboard/empresas/${empresa.id}/plano-acao/novo`}><Plus className="h-4 w-4" /> Nova acao</Link></div>
      {planos.length ? <section className="panel overflow-hidden"><div className="grid border-b border-stone-200 bg-stone-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 md:grid-cols-[0.4fr_1.2fr_1fr_0.8fr_0.8fr_0.8fr]"><span>Ordem</span><span>Acao</span><span>Area</span><span>Status</span><span>Prioridade</span><span>Prazo</span></div><div className="divide-y divide-stone-100">{planos.map((plano) => <article className="grid gap-2 px-5 py-4 text-sm md:grid-cols-[0.4fr_1.2fr_1fr_0.8fr_0.8fr_0.8fr] md:items-center" key={plano.id}><span className="font-semibold text-brand-ink">{plano.ordem}</span><div><p className="font-semibold text-brand-ink">{plano.titulo}</p><p className="mt-1 line-clamp-2 text-stone-600">{plano.descricao}</p></div><span>{SETOR_LABELS[plano.setor]}</span><span>{STATUS_ACAO_LABELS[plano.status]}</span><span>{PRIORIDADE_LABELS[plano.prioridade]}</span><span>{plano.prazo || '-'}</span></article>)}</div></section> : <EmptyState message="Nenhuma acao planejada para esta empresa." />}
    </>
  )
}
