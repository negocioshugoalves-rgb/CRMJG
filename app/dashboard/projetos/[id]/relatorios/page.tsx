import Link from 'next/link'
import { Plus } from 'lucide-react'
import { notFound } from 'next/navigation'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Indicador, Projeto, Relatorio } from '@/lib/types'

export const dynamic = 'force-dynamic'

type ProjetoCompleto = Projeto & { empresas?: Pick<Empresa, 'id' | 'nome'> | null }

function progresso(indicador: Indicador) {
  if (!indicador.valor_inicial || !indicador.meta || indicador.meta === indicador.valor_inicial || indicador.valor_atual === null) return null
  return Math.round(((indicador.valor_atual - indicador.valor_inicial) / (indicador.meta - indicador.valor_inicial)) * 100)
}

export default async function RelatoriosProjetoPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: projetoData }, { data: indicadoresData }, { data: relatoriosData }] = await Promise.all([
    supabase.from('projetos').select('*, empresas(id,nome)').eq('id', params.id).single(),
    supabase.from('indicadores').select('*').eq('projeto_id', params.id).order('atualizado_em', { ascending: false }),
    supabase.from('relatorios').select('*').eq('projeto_id', params.id).order('criado_em', { ascending: false }),
  ])
  if (!projetoData) notFound()
  const projeto = projetoData as ProjetoCompleto
  const indicadores = (indicadoresData ?? []) as Indicador[]
  const relatorios = (relatoriosData ?? []) as Relatorio[]

  return (
    <>
      <PageHeader title={`Relatórios - ${projeto.nome}`} description={`Acompanhamento do projeto${projeto.empresas?.nome ? ` de ${projeto.empresas.nome}` : ''}.`} />
      <div className="mb-6 flex flex-wrap gap-3">{projeto.empresas?.id ? <Link className="btn-secondary" href={`/dashboard/empresas/${projeto.empresas.id}/projetos`}>Voltar para projetos da empresa</Link> : null}<Link className="btn-primary" href={`/dashboard/projetos/${projeto.id}/relatorios/indicador/novo`}><Plus className="h-4 w-4" /> Novo indicador</Link><Link className="btn-primary" href={`/dashboard/projetos/${projeto.id}/relatorios/novo`}><Plus className="h-4 w-4" /> Novo relatorio</Link></div>
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-5"><h3 className="font-semibold text-brand-ink">Indicadores do projeto</h3>{indicadores.length ? <div className="mt-4 grid gap-3">{indicadores.map((indicador) => { const pct = progresso(indicador); return <div className="rounded-md border border-stone-200 p-4" key={indicador.id}><div className="flex items-center justify-between gap-4"><p className="font-semibold text-brand-ink">{indicador.nome}</p><span className="text-sm font-semibold text-brand-bronze">{pct === null ? '-' : `${pct}%`}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100"><div className="h-full bg-brand-gold" style={{ width: `${Math.max(0, Math.min(100, pct ?? 0))}%` }} /></div><p className="mt-2 text-sm text-stone-600">Atual: {indicador.valor_atual ?? '-'} {indicador.unidade || ''} · Meta: {indicador.meta ?? '-'}</p></div> })}</div> : <p className="mt-4 text-sm text-stone-500">Nenhum indicador cadastrado.</p>}</div>
        <div><h3 className="mb-4 text-lg font-bold text-brand-ink">Relatórios do projeto</h3>{relatorios.length ? <div className="grid gap-4">{relatorios.map((relatorio) => <article className="panel p-5" key={relatorio.id}><h4 className="font-semibold text-brand-ink">{relatorio.titulo}</h4><p className="mt-1 text-sm text-stone-500">{relatorio.periodo_inicio || '-'} até {relatorio.periodo_fim || '-'}</p><p className="mt-3 text-sm leading-6 text-stone-700"><strong>Executado:</strong> {relatorio.atividades_realizadas}</p>{relatorio.resultados_obtidos ? <p className="mt-3 text-sm leading-6 text-stone-700"><strong>Resultados:</strong> {relatorio.resultados_obtidos}</p> : null}{relatorio.proximos_passos ? <p className="mt-3 rounded-md bg-stone-50 p-3 text-sm leading-6 text-stone-700"><strong>Próximos passos:</strong> {relatorio.proximos_passos}</p> : null}</article>)}</div> : <EmptyState message="Nenhum relatório registrado para este projeto." />}</div>
      </section>
    </>
  )
}

