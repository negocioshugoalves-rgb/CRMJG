import { ClipboardList } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { PRIORIDADE_LABELS, SETOR_LABELS, SETORES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Diagnostico, Empresa } from '@/lib/types'
import { createDiagnostico } from './actions'

export const dynamic = 'force-dynamic'

type DiagnosticoComEmpresa = Diagnostico & { empresas?: Pick<Empresa, 'nome'> | null }
const prioridades = Object.keys(PRIORIDADE_LABELS) as Diagnostico['prioridade'][]

export default async function DiagnosticosPage() {
  const supabase = createClient()
  const [{ data: empresasData }, { data: diagnosticosData }] = await Promise.all([
    supabase.from('empresas').select('id,nome').order('nome'),
    supabase.from('diagnosticos').select('*, empresas(nome)').order('avaliado_em', { ascending: false }),
  ])

  const empresas = (empresasData ?? []) as Pick<Empresa, 'id' | 'nome'>[]
  const diagnosticos = (diagnosticosData ?? []) as DiagnosticoComEmpresa[]

  return (
    <>
      <PageHeader
        title="Diagnostico empresarial"
        description="Mapeie a situacao atual da empresa cliente, os problemas, oportunidades e prioridades por area de gestao."
      />

      <section className="space-y-8">
        <form action={createDiagnostico} className="document-page space-y-6">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-brand-bronze" />
            <h3 className="font-semibold text-brand-ink">Nova analise</h3>
          </div>

          <div className="space-y-1.5">
            <label className="label" htmlFor="empresa_id">Empresa</label>
            <select className="document-field" id="empresa_id" name="empresa_id" required>
              <option value="">Selecione</option>
              {empresas.map((empresa) => <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>)}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="label" htmlFor="setor">Area analisada</label>
              <select className="document-field" id="setor" name="setor">
                {SETORES.map((setor) => <option key={setor} value={setor}>{SETOR_LABELS[setor]}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="prioridade">Prioridade</label>
              <select className="document-field" id="prioridade" name="prioridade">
                {prioridades.map((prioridade) => <option key={prioridade} value={prioridade}>{PRIORIDADE_LABELS[prioridade]}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5"><label className="label" htmlFor="situacao_atual">Situacao atual</label><textarea className="document-field min-h-20" id="situacao_atual" name="situacao_atual" /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="problemas_identificados">Problemas identificados</label><textarea className="document-field min-h-20" id="problemas_identificados" name="problemas_identificados" /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="parecer">Parecer consultivo</label><textarea className="document-field min-h-28" id="parecer" name="parecer" required /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="pontos_fortes">Pontos fortes</label><textarea className="document-field min-h-20" id="pontos_fortes" name="pontos_fortes" /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="pontos_fracos">Pontos fracos</label><textarea className="document-field min-h-20" id="pontos_fracos" name="pontos_fracos" /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="recomendacoes">Recomendacoes iniciais</label><textarea className="document-field min-h-20" id="recomendacoes" name="recomendacoes" /></div>

          <button className="btn-primary w-full" disabled={!empresas.length} type="submit">Salvar diagnostico</button>
        </form>

        {diagnosticos.length ? (
          <div className="grid gap-4">
            {diagnosticos.map((diagnostico) => (
              <article className="panel p-5" key={diagnostico.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><h3 className="font-semibold text-brand-ink">{diagnostico.empresas?.nome || 'Empresa'}</h3><p className="text-sm text-stone-500">{SETOR_LABELS[diagnostico.setor]}</p></div>
                  <span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{PRIORIDADE_LABELS[diagnostico.prioridade]}</span>
                </div>
                {diagnostico.situacao_atual ? <p className="mt-4 text-sm leading-6 text-stone-700"><strong>Situacao atual:</strong> {diagnostico.situacao_atual}</p> : null}
                {diagnostico.problemas_identificados ? <p className="mt-3 text-sm leading-6 text-stone-700"><strong>Problemas:</strong> {diagnostico.problemas_identificados}</p> : null}
                <p className="mt-3 text-sm leading-6 text-stone-700"><strong>Parecer:</strong> {diagnostico.parecer}</p>
                {diagnostico.recomendacoes ? <p className="mt-3 rounded-md bg-stone-50 p-3 text-sm text-stone-700"><strong>Recomendacao:</strong> {diagnostico.recomendacoes}</p> : null}
              </article>
            ))}
          </div>
        ) : <EmptyState message="Nenhum diagnostico registrado ainda." />}
      </section>
    </>
  )
}

