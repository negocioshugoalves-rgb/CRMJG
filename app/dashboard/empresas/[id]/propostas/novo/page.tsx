import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { PageHeader } from '@/components/page-header'
import { SETOR_LABELS, STATUS_PROPOSTA_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Diagnostico, Empresa, PlanoAcao, Proposta } from '@/lib/types'
import { createProposta } from '@/app/dashboard/propostas/actions'

export const dynamic = 'force-dynamic'

const statusProposta = Object.keys(STATUS_PROPOSTA_LABELS) as Proposta['status'][]

function buildResumo(diagnosticos: Diagnostico[]) {
  if (!diagnosticos.length) return ''
  return diagnosticos.map((item) => `${SETOR_LABELS[item.setor]}: ${item.parecer}`).join('\n\n')
}

function buildEscopo(planos: PlanoAcao[]) {
  if (!planos.length) return ''
  return planos.map((item) => `${item.ordem}. ${item.titulo}\n${item.descricao}`).join('\n\n')
}

export default async function NovaPropostaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: diagnosticosData }, { data: planosData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('diagnosticos').select('*').eq('empresa_id', params.id).order('avaliado_em'),
    supabase.from('planos_acao').select('*').eq('empresa_id', params.id).order('ordem'),
  ])

  if (!empresaData) notFound()

  const empresa = empresaData as Empresa
  const diagnosticos = (diagnosticosData ?? []) as Diagnostico[]
  const planos = (planosData ?? []) as PlanoAcao[]

  return (
    <>
      <PageHeader title={`Nova proposta - ${empresa.nome}`} description="A proposta ja vem preenchida com base no diagnostico e no plano de acao desta empresa." />
      <CompanyNav empresaId={empresa.id} />

      <form action={createProposta} className="document-page space-y-6">
        <input type="hidden" name="empresa_id" value={empresa.id} />
        <div className="space-y-1.5">
          <label className="label" htmlFor="titulo">Titulo</label>
          <input className="document-field" id="titulo" name="titulo" defaultValue={`Proposta de Consultoria Empresarial - ${empresa.nome}`} required />
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="resumo_diagnostico">Resumo do diagnostico</label>
          <textarea className="document-field min-h-56" id="resumo_diagnostico" name="resumo_diagnostico" defaultValue={buildResumo(diagnosticos)} />
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="descricao">Escopo / plano de acao proposto</label>
          <textarea className="document-field min-h-64" id="descricao" name="descricao" defaultValue={buildEscopo(planos)} />
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="metodologia">Metodologia</label>
          <textarea className="document-field min-h-40" id="metodologia" name="metodologia" defaultValue="O trabalho sera conduzido com diagnostico detalhado, implantacao de ferramentas gerenciais, acompanhamento de indicadores, reunioes de validacao e relatorios periodicos de evolucao." />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1.5">
            <label className="label" htmlFor="cronograma">Cronograma</label>
            <textarea className="document-field min-h-40" id="cronograma" name="cronograma" />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="condicoes_comerciais">Condicoes comerciais</label>
            <textarea className="document-field min-h-40" id="condicoes_comerciais" name="condicoes_comerciais" />
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
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="btn-primary" type="submit">Salvar proposta</button>
          <Link className="btn-secondary" href={`/dashboard/empresas/${empresa.id}/propostas`}>Cancelar</Link>
        </div>
      </form>
    </>
  )
}
