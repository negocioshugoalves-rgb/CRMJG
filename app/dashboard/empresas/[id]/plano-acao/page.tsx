import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { PRIORIDADE_LABELS, SETOR_LABELS, SETORES, STATUS_ACAO_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, PlanoAcao } from '@/lib/types'
import { createPlanoAcao } from '@/app/dashboard/planos-acao/actions'

export const dynamic = 'force-dynamic'

const prioridades = Object.keys(PRIORIDADE_LABELS) as PlanoAcao['prioridade'][]
const statusAcoes = Object.keys(STATUS_ACAO_LABELS) as PlanoAcao['status'][]

export default async function PlanoAcaoEmpresaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: planosData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('planos_acao').select('*').eq('empresa_id', params.id).order('ordem'),
  ])

  if (!empresaData) notFound()

  const empresa = empresaData as Empresa
  const planos = (planosData ?? []) as PlanoAcao[]

  return (
    <>
      <PageHeader title={`Plano de acao - ${empresa.nome}`} description="Organize as acoes propostas para esta empresa." />
      <CompanyNav empresaId={empresa.id} />

      <form action={createPlanoAcao} className="document-page space-y-6">
        <input type="hidden" name="empresa_id" value={empresa.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="label" htmlFor="setor">Area</label>
            <select className="document-field" id="setor" name="setor">
              {SETORES.map((setor) => <option key={setor} value={setor}>{SETOR_LABELS[setor]}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="prioridade">Prioridade</label>
            <select className="document-field" id="prioridade" name="prioridade">
              {prioridades.map((p) => <option key={p} value={p}>{PRIORIDADE_LABELS[p]}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="titulo">Titulo</label>
          <input className="document-field" id="titulo" name="titulo" required />
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="descricao">O que sera feito</label>
          <textarea className="document-field min-h-40" id="descricao" name="descricao" required />
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="justificativa">Por que sera feito</label>
          <textarea className="document-field min-h-32" id="justificativa" name="justificativa" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <label className="label" htmlFor="responsavel">Responsavel</label>
            <input className="document-field" id="responsavel" name="responsavel" />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="prazo">Prazo</label>
            <input className="document-field" id="prazo" name="prazo" type="date" />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="status">Status</label>
            <select className="document-field" id="status" name="status">
              {statusAcoes.map((s) => <option key={s} value={s}>{STATUS_ACAO_LABELS[s]}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="ordem">Ordem</label>
            <input className="document-field" id="ordem" name="ordem" type="number" defaultValue="1" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="resultado_esperado">Resultado esperado</label>
          <textarea className="document-field min-h-32" id="resultado_esperado" name="resultado_esperado" />
        </div>
        <button className="btn-primary w-full sm:w-fit" type="submit">Salvar acao</button>
      </form>

      <section className="mt-8">
        <h3 className="mb-4 text-lg font-bold text-brand-ink">Acoes desta empresa</h3>
        {planos.length ? (
          <div className="grid gap-4">
            {planos.map((plano) => (
              <article className="panel p-5" key={plano.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-brand-ink">{plano.ordem}. {plano.titulo}</h4>
                    <p className="text-sm text-stone-500">{SETOR_LABELS[plano.setor]}</p>
                  </div>
                  <span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">
                    {STATUS_ACAO_LABELS[plano.status]}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-700">{plano.descricao}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState message="Nenhuma acao planejada para esta empresa." />
        )}
      </section>
    </>
  )
}
