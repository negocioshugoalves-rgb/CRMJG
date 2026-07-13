import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
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
      <PageHeader title={`Plano de acao - ${empresa.nome}`} description="Cards por acao planejada. Clique em um card para abrir os detalhes." />
      <CompanyNav empresaId={empresa.id} />
      <div className="mb-6 flex justify-end"><Link className="btn-primary" href={`/dashboard/empresas/${empresa.id}/plano-acao/novo`}><Plus className="h-4 w-4" /> Nova acao</Link></div>
      {planos.length ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{planos.map((plano) => <Link className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md" href={`/dashboard/empresas/${empresa.id}/plano-acao/${plano.id}`} key={plano.id}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-brand-bronze">Acao {plano.ordem}</p><h3 className="mt-1 font-semibold text-brand-ink">{plano.titulo}</h3><p className="mt-1 text-sm text-stone-500">{SETOR_LABELS[plano.setor]}</p></div><ArrowRight className="h-4 w-4 text-stone-400" /></div><p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-700">{plano.descricao}</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{STATUS_ACAO_LABELS[plano.status]}</span><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">{PRIORIDADE_LABELS[plano.prioridade]}</span></div></Link>)}</section> : <EmptyState message="Nenhuma acao planejada para esta empresa." />}
    </>
  )
}
