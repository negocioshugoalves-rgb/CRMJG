import { BarChart3, FileText } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { SETOR_LABELS, SETORES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Indicador, Projeto, Relatorio } from '@/lib/types'
import { createIndicador, createRelatorio } from './actions'

export const dynamic = 'force-dynamic'

type ProjetoComEmpresa = Projeto & { empresas?: Pick<Empresa, 'nome'> | null }
type RelatorioComProjeto = Relatorio & { projetos?: Pick<Projeto, 'nome'> & { empresas?: Pick<Empresa, 'nome'> | null } }
type IndicadorComProjeto = Indicador & { projetos?: Pick<Projeto, 'nome'> | null }

function progresso(indicador: Indicador) {
  if (!indicador.valor_inicial || !indicador.meta || indicador.meta === indicador.valor_inicial || indicador.valor_atual === null) return null
  return Math.round(((indicador.valor_atual - indicador.valor_inicial) / (indicador.meta - indicador.valor_inicial)) * 100)
}

export default async function RelatoriosPage() {
  const supabase = createClient()
  const [{ data: projetosData }, { data: indicadoresData }, { data: relatoriosData }] = await Promise.all([
    supabase.from('projetos').select('*, empresas(nome)').order('criado_em', { ascending: false }),
    supabase.from('indicadores').select('*, projetos(nome)').order('atualizado_em', { ascending: false }),
    supabase.from('relatorios').select('*, projetos(nome, empresas(nome))').order('criado_em', { ascending: false }),
  ])
  const projetos = (projetosData ?? []) as ProjetoComEmpresa[]
  const indicadores = (indicadoresData ?? []) as IndicadorComProjeto[]
  const relatorios = (relatoriosData ?? []) as RelatorioComProjeto[]

  return (
    <>
      <PageHeader title="Relatorios e indicadores" description="Registre o andamento do projeto, resultados alcançados, pontos de atencao e proximos passos com indicadores mensuraveis." />
      <section className="space-y-8">
        <div className="space-y-6">
          <form action={createIndicador} className="document-page space-y-6">
            <div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-brand-bronze" /><h3 className="font-semibold text-brand-ink">Novo indicador</h3></div>
            <div className="space-y-1.5"><label className="label" htmlFor="projeto_id_indicador">Projeto</label><select className="document-field" id="projeto_id_indicador" name="projeto_id" required><option value="">Selecione</option>{projetos.map((projeto) => <option key={projeto.id} value={projeto.id}>{projeto.nome}</option>)}</select></div>
            <div className="space-y-1.5"><label className="label" htmlFor="nome">Indicador</label><input className="document-field" id="nome" name="nome" required /></div>
            <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><label className="label" htmlFor="area">Area</label><select className="document-field" id="area" name="area"><option value="">Geral</option>{SETORES.map((setor) => <option key={setor} value={setor}>{SETOR_LABELS[setor]}</option>)}</select></div><div className="space-y-1.5"><label className="label" htmlFor="unidade">Unidade</label><input className="document-field" id="unidade" name="unidade" placeholder="%, R$, dias..." /></div></div>
            <div className="grid gap-4 sm:grid-cols-3"><div className="space-y-1.5"><label className="label" htmlFor="valor_inicial">Inicial</label><input className="document-field" id="valor_inicial" name="valor_inicial" type="number" step="0.01" /></div><div className="space-y-1.5"><label className="label" htmlFor="valor_atual">Atual</label><input className="document-field" id="valor_atual" name="valor_atual" type="number" step="0.01" /></div><div className="space-y-1.5"><label className="label" htmlFor="meta">Meta</label><input className="document-field" id="meta" name="meta" type="number" step="0.01" /></div></div>
            <button className="btn-primary w-full" disabled={!projetos.length} type="submit">Salvar indicador</button>
          </form>
          <form action={createRelatorio} className="document-page space-y-6">
            <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-brand-bronze" /><h3 className="font-semibold text-brand-ink">Novo relatorio</h3></div>
            <div className="space-y-1.5"><label className="label" htmlFor="projeto_id_relatorio">Projeto</label><select className="document-field" id="projeto_id_relatorio" name="projeto_id" required><option value="">Selecione</option>{projetos.map((projeto) => <option key={projeto.id} value={projeto.id}>{projeto.nome}</option>)}</select></div>
            <div className="space-y-1.5"><label className="label" htmlFor="titulo">Titulo</label><input className="document-field" id="titulo" name="titulo" required /></div>
            <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><label className="label" htmlFor="periodo_inicio">Inicio</label><input className="document-field" id="periodo_inicio" name="periodo_inicio" type="date" /></div><div className="space-y-1.5"><label className="label" htmlFor="periodo_fim">Fim</label><input className="document-field" id="periodo_fim" name="periodo_fim" type="date" /></div></div>
            <div className="space-y-1.5"><label className="label" htmlFor="atividades_realizadas">Atividades realizadas</label><textarea className="document-field min-h-24" id="atividades_realizadas" name="atividades_realizadas" required /></div>
            <div className="space-y-1.5"><label className="label" htmlFor="resultados_obtidos">Resultados obtidos</label><textarea className="document-field min-h-20" id="resultados_obtidos" name="resultados_obtidos" /></div>
            <div className="space-y-1.5"><label className="label" htmlFor="pontos_atencao">Pontos de atencao</label><textarea className="document-field min-h-20" id="pontos_atencao" name="pontos_atencao" /></div>
            <div className="space-y-1.5"><label className="label" htmlFor="proximos_passos">Proximos passos</label><textarea className="document-field min-h-20" id="proximos_passos" name="proximos_passos" /></div>
            <button className="btn-primary w-full" disabled={!projetos.length} type="submit">Salvar relatorio</button>
          </form>
        </div>
        <div className="space-y-6">
          <div className="panel p-5"><h3 className="font-semibold text-brand-ink">Indicadores</h3>{indicadores.length ? <div className="mt-4 grid gap-3">{indicadores.map((indicador) => { const pct = progresso(indicador); return <div className="rounded-md border border-stone-200 p-4" key={indicador.id}><div className="flex items-center justify-between gap-4"><div><p className="font-semibold text-brand-ink">{indicador.nome}</p><p className="text-sm text-stone-500">{indicador.projetos?.nome || 'Projeto'}</p></div><span className="text-sm font-semibold text-brand-bronze">{pct === null ? '-' : `${pct}%`}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100"><div className="h-full bg-brand-gold" style={{ width: `${Math.max(0, Math.min(100, pct ?? 0))}%` }} /></div><p className="mt-2 text-sm text-stone-600">Atual: {indicador.valor_atual ?? '-'} {indicador.unidade || ''} · Meta: {indicador.meta ?? '-'}</p></div> })}</div> : <p className="mt-4 text-sm text-stone-500">Nenhum indicador cadastrado.</p>}</div>
          {relatorios.length ? <div className="grid gap-4">{relatorios.map((relatorio) => <article className="panel p-5" key={relatorio.id}><h3 className="font-semibold text-brand-ink">{relatorio.titulo}</h3><p className="text-sm text-stone-500">{relatorio.projetos?.empresas?.nome || 'Cliente'} · {relatorio.projetos?.nome || 'Projeto'}</p><p className="mt-4 text-sm leading-6 text-stone-700"><strong>Executado:</strong> {relatorio.atividades_realizadas}</p>{relatorio.resultados_obtidos ? <p className="mt-3 text-sm leading-6 text-stone-700"><strong>Resultados:</strong> {relatorio.resultados_obtidos}</p> : null}{relatorio.proximos_passos ? <p className="mt-3 rounded-md bg-stone-50 p-3 text-sm text-stone-700"><strong>Proximos passos:</strong> {relatorio.proximos_passos}</p> : null}</article>)}</div> : <EmptyState message="Nenhum relatorio de acompanhamento ainda." />}
        </div>
      </section>
    </>
  )
}


