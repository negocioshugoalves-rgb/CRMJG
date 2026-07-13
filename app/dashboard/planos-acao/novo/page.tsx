import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { PRIORIDADE_LABELS, SETOR_LABELS, SETORES, STATUS_ACAO_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, PlanoAcao } from '@/lib/types'
import { createPlanoAcao } from '../actions'

export const dynamic = 'force-dynamic'

const prioridades = Object.keys(PRIORIDADE_LABELS) as PlanoAcao['prioridade'][]
const statusAcoes = Object.keys(STATUS_ACAO_LABELS) as PlanoAcao['status'][]

export default async function NovaAcaoPage() {
  const supabase = createClient()
  const { data } = await supabase.from('empresas').select('id,nome').order('nome')
  const empresas = (data ?? []) as Pick<Empresa, 'id' | 'nome'>[]

  return (
    <>
      <PageHeader title="Nova acao" description="Selecione a empresa e documente o plano de acao." />
      <form action={createPlanoAcao} className="document-page space-y-6">
        <input type="hidden" name="redirect_to" value="/dashboard/planos-acao" />
        <div className="space-y-1.5"><label className="label" htmlFor="empresa_id">Empresa</label><select className="document-field" id="empresa_id" name="empresa_id" required><option value="">Selecione</option>{empresas.map((empresa) => <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>)}</select></div>
        <div className="grid gap-4 sm:grid-cols-3"><div className="space-y-1.5"><label className="label" htmlFor="setor">Area</label><select className="document-field" id="setor" name="setor">{SETORES.map((setor) => <option key={setor} value={setor}>{SETOR_LABELS[setor]}</option>)}</select></div><div className="space-y-1.5"><label className="label" htmlFor="prioridade">Prioridade</label><select className="document-field" id="prioridade" name="prioridade">{prioridades.map((prioridade) => <option key={prioridade} value={prioridade}>{PRIORIDADE_LABELS[prioridade]}</option>)}</select></div><div className="space-y-1.5"><label className="label" htmlFor="status">Status</label><select className="document-field" id="status" name="status">{statusAcoes.map((status) => <option key={status} value={status}>{STATUS_ACAO_LABELS[status]}</option>)}</select></div></div>
        <div className="space-y-1.5"><label className="label" htmlFor="titulo">Titulo da acao</label><input className="document-field" id="titulo" name="titulo" required /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="descricao">Descricao</label><textarea className="document-field min-h-40" id="descricao" name="descricao" required /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="justificativa">Justificativa</label><textarea className="document-field min-h-28" id="justificativa" name="justificativa" /></div>
        <div className="grid gap-4 sm:grid-cols-3"><div className="space-y-1.5"><label className="label" htmlFor="responsavel">Responsavel</label><input className="document-field" id="responsavel" name="responsavel" /></div><div className="space-y-1.5"><label className="label" htmlFor="prazo">Prazo</label><input className="document-field" id="prazo" name="prazo" type="date" /></div><div className="space-y-1.5"><label className="label" htmlFor="ordem">Ordem</label><input className="document-field" id="ordem" name="ordem" type="number" defaultValue="1" min="1" /></div></div>
        <div className="space-y-1.5"><label className="label" htmlFor="resultado_esperado">Resultado esperado</label><textarea className="document-field min-h-28" id="resultado_esperado" name="resultado_esperado" /></div>
        <div className="flex flex-col gap-3 sm:flex-row"><button className="btn-primary" disabled={!empresas.length} type="submit">Salvar acao</button><Link className="btn-secondary" href="/dashboard/planos-acao">Cancelar</Link></div>
      </form>
    </>
  )
}


