import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { PRIORIDADE_LABELS, SETOR_LABELS, STATUS_ACAO_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, PlanoAcao } from '@/lib/types'

export const dynamic = 'force-dynamic'

type PlanoComEmpresa = PlanoAcao & { empresas?: Pick<Empresa, 'id' | 'nome' | 'segmento'> | null }

type GrupoPlano = {
  empresa: Pick<Empresa, 'id' | 'nome' | 'segmento'>
  total: number
  setores: string[]
  status: Record<PlanoAcao['status'], number>
  maiorPrioridade: PlanoAcao['prioridade']
  primeiraAcao: string
}

const pesoPrioridade: Record<PlanoAcao['prioridade'], number> = { baixa: 1, media: 2, alta: 3, critica: 4 }

function agruparPorEmpresa(planos: PlanoComEmpresa[]) {
  const grupos = new Map<string, GrupoPlano>()

  planos.forEach((plano) => {
    if (!plano.empresas?.id) return
    const atual = grupos.get(plano.empresas.id)
    const setor = SETOR_LABELS[plano.setor]

    if (!atual) {
      grupos.set(plano.empresas.id, {
        empresa: plano.empresas,
        total: 1,
        setores: [setor],
        status: { planejada: plano.status === 'planejada' ? 1 : 0, em_andamento: plano.status === 'em_andamento' ? 1 : 0, concluida: plano.status === 'concluida' ? 1 : 0, pausada: plano.status === 'pausada' ? 1 : 0 },
        maiorPrioridade: plano.prioridade,
        primeiraAcao: plano.titulo,
      })
      return
    }

    atual.total += 1
    atual.status[plano.status] += 1
    if (!atual.setores.includes(setor)) atual.setores.push(setor)
    if (pesoPrioridade[plano.prioridade] > pesoPrioridade[atual.maiorPrioridade]) atual.maiorPrioridade = plano.prioridade
  })

  return Array.from(grupos.values())
}

export default async function PlanosAcaoPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('planos_acao')
    .select('*, empresas(id,nome,segmento)')
    .order('ordem')
    .order('criado_em', { ascending: false })

  const grupos = agruparPorEmpresa((data ?? []) as PlanoComEmpresa[])

  return (
    <>
      <PageHeader title="Planos de ação" description="Uma visão por empresa. Clique no card para abrir todas as ações planejadas do dossiê." />
      <div className="mb-6 flex justify-end"><Link className="btn-primary" href="/dashboard/planos-acao/novo"><Plus className="h-4 w-4" /> Nova ação</Link></div>
      {grupos.length ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{grupos.map((grupo) => <Link className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md" href={`/dashboard/empresas/${grupo.empresa.id}/plano-acao`} key={grupo.empresa.id}><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-brand-ink">{grupo.empresa.nome}</h3><p className="mt-1 text-sm text-stone-500">{grupo.empresa.segmento}</p></div><ArrowRight className="h-4 w-4 text-stone-400" /></div><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{grupo.total} ação{grupo.total === 1 ? '' : 'es'}</span><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">Maior prioridade: {PRIORIDADE_LABELS[grupo.maiorPrioridade]}</span></div><p className="mt-4 text-sm leading-6 text-stone-700">Áreas: {grupo.setores.join(', ')}</p><p className="mt-3 text-sm leading-6 text-stone-600">Primeira ação: {grupo.primeiraAcao}</p><p className="mt-3 text-xs font-semibold uppercase tracking-wide text-stone-500">{Object.entries(grupo.status).filter(([, total]) => total > 0).map(([status, total]) => `${STATUS_ACAO_LABELS[status as PlanoAcao['status']]}: ${total}`).join(' | ')}</p></Link>)}</section> : <EmptyState message="Nenhuma ação cadastrada. Crie o primeiro plano de ação." />}
    </>
  )
}





