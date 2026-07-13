import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { PRIORIDADE_LABELS, SETOR_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Diagnostico, Empresa } from '@/lib/types'

export const dynamic = 'force-dynamic'

type DiagnosticoComEmpresa = Diagnostico & { empresas?: Pick<Empresa, 'id' | 'nome'> | null }

export default async function DiagnosticosPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('diagnosticos')
    .select('*, empresas(id,nome)')
    .order('avaliado_em', { ascending: false })

  const diagnosticos = (data ?? []) as DiagnosticoComEmpresa[]

  return (
    <>
      <PageHeader title="Diagnosticos" description="Visao geral das analises cadastradas. Clique em um card para abrir o detalhe no dossie da empresa." />
      <div className="mb-6 flex justify-end"><Link className="btn-primary" href="/dashboard/diagnosticos/novo"><Plus className="h-4 w-4" /> Novo diagnostico</Link></div>
      {diagnosticos.length ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{diagnosticos.map((diagnostico) => <Link className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md" href={diagnostico.empresas?.id ? `/dashboard/empresas/${diagnostico.empresas.id}/diagnostico/${diagnostico.id}` : '/dashboard/empresas'} key={diagnostico.id}><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-brand-ink">{diagnostico.empresas?.nome || 'Empresa'}</h3><p className="mt-1 text-sm text-stone-500">{SETOR_LABELS[diagnostico.setor]}</p></div><ArrowRight className="h-4 w-4 text-stone-400" /></div><span className="mt-4 inline-flex rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{PRIORIDADE_LABELS[diagnostico.prioridade]}</span><p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-700">{diagnostico.parecer}</p></Link>)}</section> : <EmptyState message="Nenhum diagnostico cadastrado. Crie o primeiro diagnostico para iniciar a analise." />}
    </>
  )
}
