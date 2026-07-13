import Link from 'next/link'
import { ArrowRight, FileDown, Plus } from 'lucide-react'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { STATUS_PROPOSTA_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Proposta } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function PropostasEmpresaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: propostasData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('propostas').select('*').eq('empresa_id', params.id).order('criado_em', { ascending: false }),
  ])
  if (!empresaData) notFound()
  const empresa = empresaData as Empresa
  const propostas = (propostasData ?? []) as Proposta[]

  return (
    <>
      <PageHeader title={`Propostas - ${empresa.nome}`} description="Cards por proposta. Clique para ver detalhes ou baixar a versao em PDF." />
      <CompanyNav empresaId={empresa.id} />
      <div className="mb-6 flex justify-end"><Link className="btn-primary" href={`/dashboard/empresas/${empresa.id}/propostas/novo`}><Plus className="h-4 w-4" /> Nova proposta</Link></div>
      {propostas.length ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{propostas.map((proposta) => <article className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md" key={proposta.id}><Link href={`/dashboard/empresas/${empresa.id}/propostas/${proposta.id}`}><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-brand-ink">{proposta.titulo}</h3><p className="mt-1 text-sm text-stone-500">Validade: {proposta.data_validade || '-'}</p></div><ArrowRight className="h-4 w-4 text-stone-400" /></div><span className="mt-4 inline-flex rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{STATUS_PROPOSTA_LABELS[proposta.status]}</span>{proposta.resumo_diagnostico ? <p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-700">{proposta.resumo_diagnostico}</p> : null}</Link><Link className="btn-secondary mt-4 w-fit" href={`/dashboard/propostas/${proposta.id}/pdf`} target="_blank"><FileDown className="h-4 w-4" /> Baixar PDF</Link></article>)}</section> : <EmptyState message="Nenhuma proposta criada para esta empresa." />}
    </>
  )
}
