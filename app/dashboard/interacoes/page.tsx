import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Interacao } from '@/lib/types'

export const dynamic = 'force-dynamic'

type InteracaoComEmpresa = Interacao & { empresas?: Pick<Empresa, 'id' | 'nome'> | null }

export default async function InteracoesPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('interacoes')
    .select('*, empresas(id,nome)')
    .order('data', { ascending: false })

  const interacoes = (data ?? []) as InteracaoComEmpresa[]

  return (
    <>
      <PageHeader title="Interacoes" description="Historico geral de contatos. Clique em um card para abrir o detalhe no dossie da empresa." />
      <div className="mb-6 flex justify-end"><Link className="btn-primary" href="/dashboard/interacoes/novo"><Plus className="h-4 w-4" /> Nova interacao</Link></div>
      {interacoes.length ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{interacoes.map((interacao) => <Link className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md" href={interacao.empresas?.id ? `/dashboard/empresas/${interacao.empresas.id}/interacoes/${interacao.id}` : '/dashboard/empresas'} key={interacao.id}><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-brand-ink">{interacao.empresas?.nome || 'Empresa'}</h3><p className="mt-1 text-sm capitalize text-stone-500">{interacao.tipo}</p></div><ArrowRight className="h-4 w-4 text-stone-400" /></div><p className="mt-4 text-sm text-stone-500">{new Date(interacao.data).toLocaleString('pt-BR')}</p><p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-700">{interacao.descricao}</p>{interacao.proximo_followup ? <p className="mt-3 text-sm font-semibold text-brand-bronze">Follow-up: {interacao.proximo_followup}</p> : null}</Link>)}</section> : <EmptyState message="Nenhuma interacao cadastrada. Registre o primeiro contato." />}
    </>
  )
}
