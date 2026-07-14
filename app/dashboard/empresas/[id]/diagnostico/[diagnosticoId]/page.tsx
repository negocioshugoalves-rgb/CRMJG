import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { PageHeader } from '@/components/page-header'
import { PRIORIDADE_LABELS, SETOR_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Diagnostico, Empresa } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function DiagnosticoDetalhePage({ params }: { params: { id: string; diagnosticoId: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: diagnosticoData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('diagnosticos').select('*').eq('id', params.diagnosticoId).eq('empresa_id', params.id).single(),
  ])
  if (!empresaData || !diagnosticoData) notFound()
  const empresa = empresaData as Empresa
  const diagnostico = diagnosticoData as Diagnostico

  return (
    <>
      <PageHeader title={`${SETOR_LABELS[diagnostico.setor]} - ${empresa.nome}`} description="Detalhes do diagnóstico desta área." />
      <CompanyNav empresaId={empresa.id} />
      <article className="document-page space-y-6"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{PRIORIDADE_LABELS[diagnostico.prioridade]}</span><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">{new Date(diagnostico.avaliado_em).toLocaleDateString('pt-BR')}</span></div>{diagnostico.situacao_atual ? <section><h3 className="font-semibold text-brand-ink">Situação atual</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{diagnostico.situacao_atual}</p></section> : null}{diagnostico.problemas_identificados ? <section><h3 className="font-semibold text-brand-ink">Problemas identificados</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{diagnostico.problemas_identificados}</p></section> : null}<section><h3 className="font-semibold text-brand-ink">Parecer consultivo</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{diagnostico.parecer}</p></section>{diagnostico.pontos_fortes ? <section><h3 className="font-semibold text-brand-ink">Pontos fortes</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{diagnostico.pontos_fortes}</p></section> : null}{diagnostico.pontos_fracos ? <section><h3 className="font-semibold text-brand-ink">Pontos fracos</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{diagnostico.pontos_fracos}</p></section> : null}{diagnostico.recomendacoes ? <section><h3 className="font-semibold text-brand-ink">Recomendações</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{diagnostico.recomendacoes}</p></section> : null}<Link className="btn-secondary w-fit" href={`/dashboard/empresas/${empresa.id}/diagnostico`}>Voltar</Link></article>
    </>
  )
}

