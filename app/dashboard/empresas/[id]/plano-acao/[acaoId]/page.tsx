import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { PageHeader } from '@/components/page-header'
import { PRIORIDADE_LABELS, SETOR_LABELS, STATUS_ACAO_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, PlanoAcao } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AcaoDetalhePage({ params }: { params: { id: string; acaoId: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: acaoData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('planos_acao').select('*').eq('id', params.acaoId).eq('empresa_id', params.id).single(),
  ])
  if (!empresaData || !acaoData) notFound()
  const empresa = empresaData as Empresa
  const acao = acaoData as PlanoAcao

  return (
    <>
      <PageHeader title={acao.titulo} description={`Plano de acao para ${empresa.nome}.`} />
      <CompanyNav empresaId={empresa.id} />
      <article className="document-page space-y-6"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{STATUS_ACAO_LABELS[acao.status]}</span><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">{PRIORIDADE_LABELS[acao.prioridade]}</span><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">{SETOR_LABELS[acao.setor]}</span></div><section><h3 className="font-semibold text-brand-ink">O que sera feito</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{acao.descricao}</p></section>{acao.justificativa ? <section><h3 className="font-semibold text-brand-ink">Justificativa</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{acao.justificativa}</p></section> : null}{acao.resultado_esperado ? <section><h3 className="font-semibold text-brand-ink">Resultado esperado</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{acao.resultado_esperado}</p></section> : null}<div className="grid gap-4 sm:grid-cols-3"><div><p className="label">Responsavel</p><p className="mt-1 text-sm text-stone-700">{acao.responsavel || '-'}</p></div><div><p className="label">Prazo</p><p className="mt-1 text-sm text-stone-700">{acao.prazo || '-'}</p></div><div><p className="label">Ordem</p><p className="mt-1 text-sm text-stone-700">{acao.ordem}</p></div></div><Link className="btn-secondary w-fit" href={`/dashboard/empresas/${empresa.id}/plano-acao`}>Voltar</Link></article>
    </>
  )
}
