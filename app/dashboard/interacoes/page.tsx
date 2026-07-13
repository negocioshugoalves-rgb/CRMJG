import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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
      <PageHeader title="Interacoes" description="Historico geral de contatos. Para registrar uma nova interacao, abra o dossie da empresa." />
      {interacoes.length ? <section className="panel p-5"><div className="space-y-5 border-l-2 border-brand-light pl-5">{interacoes.map((interacao) => <Link className="relative block rounded-md p-3 transition hover:bg-stone-50" href={interacao.empresas?.id ? `/dashboard/empresas/${interacao.empresas.id}/interacoes` : '/dashboard/empresas'} key={interacao.id}><span className="absolute -left-[1.72rem] top-4 h-3 w-3 rounded-full bg-brand-gold" /><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold text-brand-ink">{interacao.empresas?.nome || 'Empresa'}</h3><p className="text-sm capitalize text-stone-500">{interacao.tipo}</p></div><span className="text-sm text-stone-500">{new Date(interacao.data).toLocaleString('pt-BR')}</span></div><p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-700">{interacao.descricao}</p><ArrowRight className="mt-2 h-4 w-4 text-stone-400" /></Link>)}</div></section> : <EmptyState message="Nenhuma interacao cadastrada. Abra uma empresa e registre o primeiro contato." />}
    </>
  )
}
