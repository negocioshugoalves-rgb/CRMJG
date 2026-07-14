import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
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
      <PageHeader title={`Interações - ${empresa.nome}`} description="Cards por contato realizado. Clique para abrir os detalhes." />
      <CompanyNav empresaId={empresa.id} />
      <div className="mb-6 flex justify-end"><Link className="btn-primary" href={`/dashboard/empresas/${empresa.id}/interacoes/novo`}><Plus className="h-4 w-4" /> Nova interação</Link></div>
      {interacoes.length ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{interacoes.map((interacao) => <Link className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md" href={`/dashboard/empresas/${empresa.id}/interacoes/${interacao.id}`} key={interacao.id}><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold capitalize text-brand-ink">{interacao.tipo}</h3><p className="mt-1 text-sm text-stone-500">{new Date(interacao.data).toLocaleString('pt-BR')}</p></div><ArrowRight className="h-4 w-4 text-stone-400" /></div><p className="mt-4 line-clamp-4 text-sm leading-6 text-stone-700">{interacao.descricao}</p>{interacao.proximo_followup ? <p className="mt-3 text-sm font-semibold text-brand-bronze">Follow-up: {interacao.proximo_followup}</p> : null}</Link>)}</section> : <EmptyState message="Nenhuma interação registrada para esta empresa." />}
    </>
  )
}

