import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { SETOR_LABELS, SETORES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Indicador, Projeto, Relatorio } from '@/lib/types'
import { createIndicador, createRelatorio } from '@/app/dashboard/relatorios/actions'

export const dynamic = 'force-dynamic'

type ProjetoCompleto = Projeto & { empresas?: Pick<Empresa, 'id' | 'nome'> | null }

function progresso(indicador: Indicador) {
  if (!indicador.valor_inicial || !indicador.meta || indicador.meta === indicador.valor_inicial || indicador.valor_atual === null) {
    return null
  }

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
      <PageHeader
        title={`Relatorios - ${projeto.nome}`}
        description={`Acompanhamento do projeto${projeto.empresas?.nome ? ` de ${projeto.empresas.nome}` : ''}.`}
      />

      {projeto.empresas?.id ? (
        <Link className="btn-secondary mb-6 w-fit" href={`/dashboard/empresas/${projeto.empresas.id}/projetos`}>
          Voltar para projetos da empresa
        </Link>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <form action={createIndicador} className="document-page space-y-6">
          <input type="hidden" name="projeto_id" value={projeto.id} />
          <h3 className="font-semibold text-brand-ink">Novo indicador</h3>
          <div className="space-y-1.5">
            <label className="label" htmlFor="nome">Indicador</label>
            <input className="document-field" id="nome" name="nome" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="label" htmlFor="area">Area</label>
              <select className="document-field" id="area" name="area">
                <option value="">Geral</option>
                {SETORES.map((setor) => <option key={setor} value={setor}>{SETOR_LABELS[setor]}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="unidade">Unidade</label>
              <input className="document-field" id="unidade" name="unidade" placeholder="%, R$, dias..." />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="label" htmlFor="valor_inicial">Inicial</label>
              <input className="document-field" id="valor_inicial" name="valor_inicial" type="number" step="0.01" />
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="valor_atual">Atual</label>
              <input className="document-field" id="valor_atual" name="valor_atual" type="number" step="0.01" />
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="meta">Meta</label>
              <input className="document-field" id="meta" name="meta" type="number" step="0.01" />
            </div>
          </div>
          <button className="btn-primary w-full sm:w-fit" type="submit">Salvar indicador</button>
        </form>

        <form action={createRelatorio} className="document-page space-y-6">
          <input type="hidden" name="projeto_id" value={projeto.id} />
          <h3 className="font-semibold text-brand-ink">Novo relatorio</h3>
          <div className="space-y-1.5">
            <label className="label" htmlFor="titulo">Titulo</label>
            <input className="document-field" id="titulo" name="titulo" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="label" htmlFor="periodo_inicio">Inicio</label>
              <input className="document-field" id="periodo_inicio" name="periodo_inicio" type="date" />
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="periodo_fim">Fim</label>
              <input className="document-field" id="periodo_fim" name="periodo_fim" type="date" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="atividades_realizadas">Atividades realizadas</label>
            <textarea className="document-field min-h-32" id="atividades_realizadas" name="atividades_realizadas" required />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="resultados_obtidos">Resultados obtidos</label>
            <textarea className="document-field min-h-28" id="resultados_obtidos" name="resultados_obtidos" />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="pontos_atencao">Pontos de atencao</label>
            <textarea className="document-field min-h-28" id="pontos_atencao" name="pontos_atencao" />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="proximos_passos">Proximos passos</label>
            <textarea className="document-field min-h-28" id="proximos_passos" name="proximos_passos" />
          </div>
          <button className="btn-primary w-full sm:w-fit" type="submit">Salvar relatorio</button>
        </form>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-5">
          <h3 className="font-semibold text-brand-ink">Indicadores do projeto</h3>
          {indicadores.length ? (
            <div className="mt-4 grid gap-3">
              {indicadores.map((indicador) => {
                const pct = progresso(indicador)
                return (
                  <div className="rounded-md border border-stone-200 p-4" key={indicador.id}>
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-brand-ink">{indicador.nome}</p>
                      <span className="text-sm font-semibold text-brand-bronze">{pct === null ? '-' : `${pct}%`}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
                      <div className="h-full bg-brand-gold" style={{ width: `${Math.max(0, Math.min(100, pct ?? 0))}%` }} />
                    </div>
                    <p className="mt-2 text-sm text-stone-600">
                      Atual: {indicador.valor_atual ?? '-'} {indicador.unidade || ''} · Meta: {indicador.meta ?? '-'}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="mt-4 text-sm text-stone-500">Nenhum indicador cadastrado.</p>
          )}
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-brand-ink">Relatorios do projeto</h3>
          {relatorios.length ? (
            <div className="grid gap-4">
              {relatorios.map((relatorio) => (
                <article className="panel p-5" key={relatorio.id}>
                  <h4 className="font-semibold text-brand-ink">{relatorio.titulo}</h4>
                  <p className="mt-3 text-sm leading-6 text-stone-700">
                    <strong>Executado:</strong> {relatorio.atividades_realizadas}
                  </p>
                  {relatorio.resultados_obtidos ? (
                    <p className="mt-3 text-sm leading-6 text-stone-700">
                      <strong>Resultados:</strong> {relatorio.resultados_obtidos}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState message="Nenhum relatorio registrado para este projeto." />
          )}
        </div>
      </section>
    </>
  )
}
