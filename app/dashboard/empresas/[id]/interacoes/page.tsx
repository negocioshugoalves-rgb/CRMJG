import Link from 'next/link'
import { Plus } from 'lucide-react'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Interacao } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function InteracoesEmpresaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: interacoesData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('interacoes').select('*').eq('empresa_id', params.id).order('data', { ascending: false }),
  ])
  if (!empresaData) notFound()
  const empresa = empresaData as Empresa
  const interacoes = (interacoesData ?? []) as Interacao[]

  return (
    <>
      <PageHeader title={`Interacoes - ${empresa.nome}`} description="Acompanhe o historico de relacionamento desta empresa em ordem cronologica." />
      <CompanyNav empresaId={empresa.id} />
      <div className="mb-6 flex justify-end"><Link className="btn-primary" href={`/dashboard/empresas/${empresa.id}/interacoes/novo`}><Plus className="h-4 w-4" /> Nova interacao</Link></div>
      {interacoes.length ? <section className="panel p-5"><div className="space-y-5 border-l-2 border-brand-light pl-5">{interacoes.map((interacao) => <article className="relative" key={interacao.id}><span className="absolute -left-[1.72rem] top-1 h-3 w-3 rounded-full bg-brand-gold" /><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold capitalize text-brand-ink">{interacao.tipo}</h3><span className="text-sm text-stone-500">{new Date(interacao.data).toLocaleString('pt-BR')}</span></div><p className="mt-2 text-sm leading-6 text-stone-700">{interacao.descricao}</p>{interacao.proximo_followup ? <p className="mt-2 text-sm font-semibold text-brand-bronze">Proximo follow-up: {interacao.proximo_followup}</p> : null}</article>)}</div></section> : <EmptyState message="Nenhuma interacao registrada para esta empresa." />}
    </>
  )
}
