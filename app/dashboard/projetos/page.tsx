import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { STATUS_PROJETO_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Projeto, Proposta } from '@/lib/types'

export const dynamic = 'force-dynamic'

type ProjetoCompleto = Projeto & { empresas?: Pick<Empresa, 'id' | 'nome'> | null; propostas?: Pick<Proposta, 'titulo'> | null }

export default async function ProjetosPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('projetos')
    .select('*, empresas(id,nome), propostas(titulo)')
    .order('criado_em', { ascending: false })

  const projetos = (data ?? []) as ProjetoCompleto[]

  return (
    <>
      <PageHeader title="Projetos" description="Acompanhe a execucao depois que a proposta for aceita: objetivo, prazo, status e proposta vinculada." />
      <div className="mb-6 flex justify-end"><Link className="btn-primary" href="/dashboard/projetos/novo"><Plus className="h-4 w-4" /> Novo projeto</Link></div>
      {projetos.length ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projetos.map((projeto) => <Link className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md" href={projeto.empresas?.id ? `/dashboard/empresas/${projeto.empresas.id}/projetos/${projeto.id}` : '/dashboard/empresas'} key={projeto.id}><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-brand-ink">{projeto.nome}</h3><p className="mt-1 text-sm text-stone-500">{projeto.empresas?.nome || 'Empresa'}</p></div><ArrowRight className="h-4 w-4 text-stone-400" /></div><span className="mt-4 inline-flex rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{STATUS_PROJETO_LABELS[projeto.status]}</span>{projeto.objetivo ? <p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-700">{projeto.objetivo}</p> : null}<div className="mt-4 text-sm text-stone-600"><p>Inicio: {projeto.data_inicio || '-'}</p><p>Fim previsto: {projeto.data_fim_prevista || '-'}</p><p>Proposta: {projeto.propostas?.titulo || '-'}</p></div></Link>)}</section> : <EmptyState message="Nenhum projeto ativo ainda." />}
    </>
  )
}
