import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { PRIORIDADE_LABELS, SETOR_LABELS, SETORES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Diagnostico, Empresa } from '@/lib/types'
import { createDiagnostico } from '@/app/dashboard/diagnosticos/actions'

export const dynamic = 'force-dynamic'

const prioridades = Object.keys(PRIORIDADE_LABELS) as Diagnostico['prioridade'][]

export default async function DiagnosticoEmpresaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: diagnosticosData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase
      .from('diagnosticos')
      .select('*')
      .eq('empresa_id', params.id)
      .order('avaliado_em', { ascending: false }),
  ])

  if (!empresaData) notFound()

  const empresa = empresaData as Empresa
  const diagnosticos = (diagnosticosData ?? []) as Diagnostico[]

  return (
    <>
      <PageHeader title={`Diagnostico - ${empresa.nome}`} description="Registre a analise por area desta empresa." />
      <CompanyNav empresaId={empresa.id} />

      <form action={createDiagnostico} className="document-page space-y-6">
        <input type="hidden" name="empresa_id" value={empresa.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="label" htmlFor="setor">Area analisada</label>
            <select className="document-field" id="setor" name="setor">
              {SETORES.map((setor) => (
                <option key={setor} value={setor}>{SETOR_LABELS[setor]}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="prioridade">Prioridade</label>
            <select className="document-field" id="prioridade" name="prioridade">
              {prioridades.map((prioridade) => (
                <option key={prioridade} value={prioridade}>{PRIORIDADE_LABELS[prioridade]}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="situacao_atual">Situacao atual</label>
          <textarea className="document-field min-h-32" id="situacao_atual" name="situacao_atual" />
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="problemas_identificados">Problemas identificados</label>
          <textarea className="document-field min-h-32" id="problemas_identificados" name="problemas_identificados" />
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="parecer">Parecer consultivo</label>
          <textarea className="document-field min-h-40" id="parecer" name="parecer" required />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-1.5">
            <label className="label" htmlFor="pontos_fortes">Pontos fortes</label>
            <textarea className="document-field min-h-28" id="pontos_fortes" name="pontos_fortes" />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="pontos_fracos">Pontos fracos</label>
            <textarea className="document-field min-h-28" id="pontos_fracos" name="pontos_fracos" />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="recomendacoes">Recomendacoes</label>
            <textarea className="document-field min-h-28" id="recomendacoes" name="recomendacoes" />
          </div>
        </div>
        <button className="btn-primary w-full sm:w-fit" type="submit">Salvar diagnostico</button>
      </form>

      <section className="mt-8">
        <h3 className="mb-4 text-lg font-bold text-brand-ink">Diagnosticos desta empresa</h3>
        {diagnosticos.length ? (
          <div className="grid gap-4">
            {diagnosticos.map((diagnostico) => (
              <article className="panel p-5" key={diagnostico.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="font-semibold text-brand-ink">{SETOR_LABELS[diagnostico.setor]}</h4>
                  <span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">
                    {PRIORIDADE_LABELS[diagnostico.prioridade]}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-700">{diagnostico.parecer}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState message="Nenhum diagnostico registrado para esta empresa." />
        )}
      </section>
    </>
  )
}
