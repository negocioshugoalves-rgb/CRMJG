import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { PageHeader } from '@/components/page-header'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Interacao } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function InteracaoDetalhePage({ params }: { params: { id: string; interacaoId: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: interacaoData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('interacoes').select('*').eq('id', params.interacaoId).eq('empresa_id', params.id).single(),
  ])
  if (!empresaData || !interacaoData) notFound()
  const empresa = empresaData as Empresa
  const interacao = interacaoData as Interacao

  return (
    <>
      <PageHeader title={`${interacao.tipo} - ${empresa.nome}`} description="Detalhes da interacao registrada." />
      <CompanyNav empresaId={empresa.id} />
      <article className="document-page space-y-6"><div className="grid gap-4 sm:grid-cols-3"><div><p className="label">Tipo</p><p className="mt-1 text-sm capitalize text-stone-700">{interacao.tipo}</p></div><div><p className="label">Data</p><p className="mt-1 text-sm text-stone-700">{new Date(interacao.data).toLocaleString('pt-BR')}</p></div><div><p className="label">Proximo follow-up</p><p className="mt-1 text-sm text-stone-700">{interacao.proximo_followup || '-'}</p></div></div><section><h3 className="font-semibold text-brand-ink">Descricao</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{interacao.descricao}</p></section><Link className="btn-secondary w-fit" href={`/dashboard/empresas/${empresa.id}/interacoes`}>Voltar</Link></article>
    </>
  )
}
