import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { PRIORIDADE_LABELS, SETOR_LABELS, STATUS_ACAO_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, PlanoAcao } from '@/lib/types'

export const dynamic = 'force-dynamic'

type PlanoComEmpresa = PlanoAcao & { empresas?: Pick<Empresa, 'id' | 'nome'> | null }

export default async function PlanosAcaoPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('planos_acao')
    .select('*, empresas(id,nome)')
    .order('ordem')
    .order('criado_em', { ascending: false })

  const planos = (data ?? []) as PlanoComEmpresa[]

  return (
    <>
      <PageHeader title="Planos de acao" description="Visao geral das acoes planejadas. Clique em um card para abrir o detalhe no dossie da empresa." />
      <div className="mb-6 flex justify-end"><Link className="btn-primary" href="/dashboard/planos-acao/novo"><Plus className="h-4 w-4" /> Nova acao</Link></div>
      {planos.length ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{planos.map((plano) => <Link className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md" href={plano.empresas?.id ? `/dashboard/empresas/${plano.empresas.id}/plano-acao/${plano.id}` : '/dashboard/empresas'} key={plano.id}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-brand-bronze">{plano.empresas?.nome || 'Empresa'}</p><h3 className="mt-1 font-semibold text-brand-ink">{plano.titulo}</h3><p className="mt-1 text-sm text-stone-500">{SETOR_LABELS[plano.setor]}</p></div><ArrowRight className="h-4 w-4 text-stone-400" /></div><p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-700">{plano.descricao}</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{STATUS_ACAO_LABELS[plano.status]}</span><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">{PRIORIDADE_LABELS[plano.prioridade]}</span></div></Link>)}</section> : <EmptyState message="Nenhuma acao cadastrada. Crie o primeiro plano de acao." />}
    </>
  )
}
