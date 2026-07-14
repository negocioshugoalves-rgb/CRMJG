import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { PRIORIDADE_LABELS, SETOR_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Diagnostico, Empresa } from '@/lib/types'

export const dynamic = 'force-dynamic'

type DiagnosticoComEmpresa = Diagnostico & { empresas?: Pick<Empresa, 'id' | 'nome' | 'segmento'> | null }

type GrupoDiagnostico = {
  empresa: Pick<Empresa, 'id' | 'nome' | 'segmento'>
  total: number
  setores: string[]
  prioridadeMaisAlta: Diagnostico['prioridade']
  ultimoParecer: string
}

const pesoPrioridade: Record<Diagnostico['prioridade'], number> = { baixa: 1, media: 2, alta: 3, critica: 4 }

function agruparPorEmpresa(diagnosticos: DiagnosticoComEmpresa[]) {
  const grupos = new Map<string, GrupoDiagnostico>()

  diagnosticos.forEach((diagnostico) => {
    if (!diagnostico.empresas?.id) return
    const atual = grupos.get(diagnostico.empresas.id)
    const setor = SETOR_LABELS[diagnostico.setor]

    if (!atual) {
      grupos.set(diagnostico.empresas.id, {
        empresa: diagnostico.empresas,
        total: 1,
        setores: [setor],
        prioridadeMaisAlta: diagnostico.prioridade,
        ultimoParecer: diagnostico.parecer,
      })
      return
    }

    atual.total += 1
    if (!atual.setores.includes(setor)) atual.setores.push(setor)
    if (pesoPrioridade[diagnostico.prioridade] > pesoPrioridade[atual.prioridadeMaisAlta]) atual.prioridadeMaisAlta = diagnostico.prioridade
    if (!atual.ultimoParecer) atual.ultimoParecer = diagnostico.parecer
  })

  return Array.from(grupos.values())
}

export default async function DiagnosticosPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('diagnosticos')
    .select('*, empresas(id,nome,segmento)')
    .order('avaliado_em', { ascending: false })

  const grupos = agruparPorEmpresa((data ?? []) as DiagnosticoComEmpresa[])

  return (
    <>
      <PageHeader title="Diagnósticos" description="Uma visão por empresa. Clique no card para abrir todos os diagnósticos do dossiê." />
      <div className="mb-6 flex justify-end"><Link className="btn-primary" href="/dashboard/diagnosticos/novo"><Plus className="h-4 w-4" /> Novo diagnóstico</Link></div>
      {grupos.length ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{grupos.map((grupo) => <Link className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md" href={`/dashboard/empresas/${grupo.empresa.id}/diagnostico`} key={grupo.empresa.id}><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-brand-ink">{grupo.empresa.nome}</h3><p className="mt-1 text-sm text-stone-500">{grupo.empresa.segmento}</p></div><ArrowRight className="h-4 w-4 text-stone-400" /></div><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{grupo.total} diagnóstico{grupo.total === 1 ? '' : 's'}</span><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">Maior prioridade: {PRIORIDADE_LABELS[grupo.prioridadeMaisAlta]}</span></div><p className="mt-4 text-sm leading-6 text-stone-700">Áreas: {grupo.setores.join(', ')}</p>{grupo.ultimoParecer ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">{grupo.ultimoParecer}</p> : null}</Link>)}</section> : <EmptyState message="Nenhum diagnóstico cadastrado. Crie o primeiro diagnóstico para iniciar a análise." />}
    </>
  )
}
