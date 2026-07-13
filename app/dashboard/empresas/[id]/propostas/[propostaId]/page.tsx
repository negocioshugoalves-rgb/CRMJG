import Link from 'next/link'
import { FileDown } from 'lucide-react'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { PageHeader } from '@/components/page-header'
import { STATUS_PROPOSTA_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Proposta } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function PropostaDetalhePage({ params }: { params: { id: string; propostaId: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: propostaData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('propostas').select('*').eq('id', params.propostaId).eq('empresa_id', params.id).single(),
  ])
  if (!empresaData || !propostaData) notFound()
  const empresa = empresaData as Empresa
  const proposta = propostaData as Proposta

  return (
    <>
      <PageHeader title={proposta.titulo} description={`Proposta para ${empresa.nome}.`} />
      <CompanyNav empresaId={empresa.id} />
      <article className="document-page space-y-6"><div className="flex flex-wrap gap-3"><span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{STATUS_PROPOSTA_LABELS[proposta.status]}</span><Link className="btn-primary" href={`/dashboard/propostas/${proposta.id}/pdf`} target="_blank"><FileDown className="h-4 w-4" /> Baixar PDF</Link></div>{proposta.resumo_diagnostico ? <section><h3 className="font-semibold text-brand-ink">Resumo do diagnostico</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.resumo_diagnostico}</p></section> : null}{proposta.descricao ? <section><h3 className="font-semibold text-brand-ink">Escopo</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.descricao}</p></section> : null}{proposta.metodologia ? <section><h3 className="font-semibold text-brand-ink">Metodologia</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.metodologia}</p></section> : null}{proposta.cronograma ? <section><h3 className="font-semibold text-brand-ink">Cronograma</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.cronograma}</p></section> : null}{proposta.condicoes_comerciais ? <section><h3 className="font-semibold text-brand-ink">Condicoes comerciais</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.condicoes_comerciais}</p></section> : null}<div className="grid gap-4 sm:grid-cols-3"><div><p className="label">Investimento</p><p className="mt-1 text-sm text-stone-700">{proposta.valor ? proposta.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</p></div><div><p className="label">Envio</p><p className="mt-1 text-sm text-stone-700">{proposta.data_envio || '-'}</p></div><div><p className="label">Validade</p><p className="mt-1 text-sm text-stone-700">{proposta.data_validade || '-'}</p></div></div><Link className="btn-secondary w-fit" href={`/dashboard/empresas/${empresa.id}/propostas`}>Voltar</Link></article>
    </>
  )
}
