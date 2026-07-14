'use client'

import Link from 'next/link'
import { FileText, Wand2 } from 'lucide-react'
import { STATUS_PROPOSTA_LABELS } from '@/lib/constants'
import type { StatusProposta } from '@/lib/types'
import { createProposta } from '@/app/dashboard/propostas/actions'

type EmpresaOption = {
  id: string
  nome: string
}

type ProposalSource = {
  titulo: string
  resumoDiagnostico: string
  escopoPlano: string
}

type Props = {
  empresas: EmpresaOption[]
  sources: Record<string, ProposalSource>
  defaultEmpresaId?: string
  cancelHref: string
  redirectTo: string
}

const statusProposta = Object.keys(STATUS_PROPOSTA_LABELS) as StatusProposta[]

export function ProposalAutofillForm({ empresas, sources, defaultEmpresaId = '', cancelHref, redirectTo }: Props) {
  function preencherProposta() {
    const empresaSelect = document.getElementById('empresa_id') as HTMLSelectElement | null
    const empresaId = defaultEmpresaId || empresaSelect?.value || ''
    const source = sources[empresaId]

    if (!source) return

    const titulo = document.getElementById('titulo') as HTMLInputElement | null
    const resumo = document.getElementById('resumo_diagnostico') as HTMLTextAreaElement | null
    const descricao = document.getElementById('descricao') as HTMLTextAreaElement | null

    if (titulo && !titulo.value) titulo.value = source.titulo
    if (resumo) resumo.value = source.resumoDiagnostico
    if (descricao) descricao.value = source.escopoPlano
  }

  return (
    <form action={createProposta} className="document-page space-y-6">
      <input type="hidden" name="redirect_to" value={redirectTo} />
      {defaultEmpresaId ? <input type="hidden" name="empresa_id" value={defaultEmpresaId} /> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-brand-bronze" />
          <h3 className="font-semibold text-brand-ink">Documento da proposta</h3>
        </div>
        <button className="btn-secondary" type="button" onClick={preencherProposta}>
          <Wand2 className="h-4 w-4" />
          Puxar diagnóstico e plano de ação
        </button>
      </div>

      {!defaultEmpresaId ? (
        <div className="space-y-1.5">
          <label className="label" htmlFor="empresa_id">Empresa</label>
          <select className="document-field" id="empresa_id" name="empresa_id" required>
            <option value="">Selecione</option>
            {empresas.map((empresa) => <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>)}
          </select>
        </div>
      ) : null}

      <div className="space-y-1.5"><label className="label" htmlFor="titulo">Título</label><input className="document-field" id="titulo" name="titulo" required /></div>
      <div className="space-y-1.5"><label className="label" htmlFor="resumo_diagnostico">Resumo do diagnóstico</label><textarea className="document-field min-h-56" id="resumo_diagnostico" name="resumo_diagnostico" /></div>
      <div className="space-y-1.5"><label className="label" htmlFor="descricao">Escopo / plano de ação proposto</label><textarea className="document-field min-h-64" id="descricao" name="descricao" /></div>
      <div className="space-y-1.5"><label className="label" htmlFor="metodologia">Metodologia</label><textarea className="document-field min-h-40" id="metodologia" name="metodologia" defaultValue="O trabalho será conduzido com diagnóstico detalhado, implantação de ferramentas gerenciais, acompanhamento de indicadores, reuniões de validação e relatórios periódicos de evolução." /></div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-1.5"><label className="label" htmlFor="cronograma">Cronograma</label><textarea className="document-field min-h-40" id="cronograma" name="cronograma" /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="condicoes_comerciais">Condições comerciais</label><textarea className="document-field min-h-40" id="condicoes_comerciais" name="condicoes_comerciais" /></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5"><label className="label" htmlFor="valor">Investimento</label><input className="document-field" id="valor" name="valor" type="number" step="0.01" /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="tipo_investimento">Tipo de investimento</label><select className="document-field" id="tipo_investimento" name="tipo_investimento" defaultValue="por_projeto"><option value="por_projeto">Por projeto</option><option value="mensal">Mensal</option></select></div>
        <div className="space-y-1.5"><label className="label" htmlFor="status">Status</label><select className="document-field" id="status" name="status">{statusProposta.map((status) => <option key={status} value={status}>{STATUS_PROPOSTA_LABELS[status]}</option>)}</select></div>
        <div className="space-y-1.5"><label className="label" htmlFor="data_validade">Validade</label><input className="document-field" id="data_validade" name="data_validade" type="date" /></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5"><label className="label" htmlFor="periodo_tipo">Período do projeto</label><select className="document-field" id="periodo_tipo" name="periodo_tipo" defaultValue="determinado"><option value="determinado">Determinado</option><option value="indeterminado">Indeterminado</option></select></div>
        <div className="space-y-1.5"><label className="label" htmlFor="periodo_inicio">Início previsto</label><input className="document-field" id="periodo_inicio" name="periodo_inicio" type="date" /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="periodo_fim">Término previsto</label><input className="document-field" id="periodo_fim" name="periodo_fim" type="date" /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="data_envio">Envio</label><input className="document-field" id="data_envio" name="data_envio" type="date" /></div>
      </div>

      <div className="space-y-1.5"><label className="label" htmlFor="periodo_descricao">Observações sobre período</label><input className="document-field" id="periodo_descricao" name="periodo_descricao" placeholder="Ex.: contrato inicial de 6 meses, renovável por acordo entre as partes" /></div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="btn-primary" disabled={!empresas.length} type="submit">Salvar proposta</button>
        <Link className="btn-secondary" href={cancelHref}>Cancelar</Link>
      </div>
    </form>
  )
}