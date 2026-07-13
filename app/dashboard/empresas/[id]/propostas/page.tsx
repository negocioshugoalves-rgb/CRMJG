import Link from 'next/link'
import { FileDown } from 'lucide-react'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { SETOR_LABELS, STATUS_PROPOSTA_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Diagnostico, Empresa, PlanoAcao, Proposta } from '@/lib/types'
import { createProposta } from '@/app/dashboard/propostas/actions'

export const dynamic = 'force-dynamic'

const statusProposta = Object.keys(STATUS_PROPOSTA_LABELS) as Proposta['status'][]

function buildResumo(diagnosticos: Diagnostico[]) {
  if (!diagnosticos.length) return ''

  return diagnosticos
    .map((item) => `${SETOR_LABELS[item.setor]}: ${item.parecer}`)
    .join('\n\n')
}

function buildEscopo(planos: PlanoAcao[]) {
  if (!planos.length) return ''

  return planos
    .map((item) => `${item.ordem}. ${item.titulo}\n${item.descricao}`)
    .join('\n\n')
}

export default async function PropostasEmpresaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: diagnosticosData }, { data: planosData }, { data: propostasData }] =
    await Promise.all([
      supabase.from('empresas').select('*').eq('id', params.id).single(),
      supabase.from('diagnosticos').select('*').eq('empresa_id', params.id).order('avaliado_em'),
      supabase.from('planos_acao').select('*').eq('empresa_id', params.id).order('ordem'),
      supabase.from('propostas').select('*').eq('empresa_id', params.id).order('criado_em', { ascending: false }),
    ])

  if (!empresaData) notFound()

  const empresa = empresaData as Empresa
  const diagnosticos = (diagnosticosData ?? []) as Diagnostico[]
  const planos = (planosData ?? []) as PlanoAcao[]
  const propostas = (propostasData ?? []) as Proposta[]
  const resumo = buildResumo(diagnosticos)
  const escopo = buildEscopo(planos)

  return (
    <>
      <PageHeader title={`Propostas - ${empresa.nome}`} description="Monte propostas usando os diagnosticos e planos desta empresa como base." />
      <CompanyNav empresaId={empresa.id} />

      <form action={createProposta} className="document-page space-y-6">
        <input type="hidden" name="empresa_id" value={empresa.id} />
        <div className="space-y-1.5">
          <label className="label" htmlFor="titulo">Titulo</label>
          <input className="document-field" id="titulo" name="titulo" defaultValue={`Proposta de Consultoria Empresarial - ${empresa.nome}`} required />
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="resumo_diagnostico">Resumo do diagnostico</label>
          <textarea className="document-field min-h-48" id="resumo_diagnostico" name="resumo_diagnostico" defaultValue={resumo} />
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="descricao">Escopo / plano de acao proposto</label>
          <textarea className="document-field min-h-56" id="descricao" name="descricao" defaultValue={escopo} />
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="metodologia">Metodologia</label>
          <textarea
            className="document-field min-h-40"
            id="metodologia"
            name="metodologia"
            defaultValue="O trabalho sera conduzido com diagnostico detalhado, implantacao de ferramentas gerenciais, acompanhamento de indicadores, reunioes de validacao e relatorios periodicos de evolucao."
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1.5">
            <label className="label" htmlFor="cronograma">Cronograma</label>
            <textarea className="document-field min-h-32" id="cronograma" name="cronograma" />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="condicoes_comerciais">Condicoes comerciais</label>
            <textarea className="document-field min-h-32" id="condicoes_comerciais" name="condicoes_comerciais" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <label className="label" htmlFor="valor">Investimento</label>
            <input className="document-field" id="valor" name="valor" type="number" step="0.01" />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="status">Status</label>
            <select className="document-field" id="status" name="status">
              {statusProposta.map((status) => <option key={status} value={status}>{STATUS_PROPOSTA_LABELS[status]}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="data_envio">Envio</label>
            <input className="document-field" id="data_envio" name="data_envio" type="date" />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="data_validade">Validade</label>
            <input className="document-field" id="data_validade" name="data_validade" type="date" />
          </div>
        </div>
        <button className="btn-primary w-full sm:w-fit" type="submit">Salvar proposta</button>
      </form>

      <section className="mt-8">
        <h3 className="mb-4 text-lg font-bold text-brand-ink">Propostas desta empresa</h3>
        {propostas.length ? (
          <div className="grid gap-4">
            {propostas.map((proposta) => (
              <article className="panel p-5" key={proposta.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-brand-ink">{proposta.titulo}</h4>
                    <p className="text-sm text-stone-500">Validade: {proposta.data_validade || '-'}</p>
                  </div>
                  <span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">
                    {STATUS_PROPOSTA_LABELS[proposta.status]}
                  </span>
                </div>
                <Link className="btn-secondary mt-4 w-fit" href={`/dashboard/propostas/${proposta.id}/pdf`} target="_blank">
                  <FileDown className="h-4 w-4" />
                  Baixar PDF
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState message="Nenhuma proposta criada para esta empresa." />
        )}
      </section>
    </>
  )
}
