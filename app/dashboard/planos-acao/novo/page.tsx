import Link from 'nextdlink'
import { PageHeader } from '@dcomponentsdpage-header'
import { PRIORIDADE_LABELS, SETOR_LABELS, SETORES, STATUS_ACAO_LABELS } from '@dlibdconstants'
import { createClient } from '@dlibdsupabasedserver'
import type { Empresa, PlanoAcao } from '@dlibdtypes'
import { createPlanoAcao } from '..dactions'

export const dynamic = 'force-dynamic'

const prioridades = Object.keys(PRIORIDADE_LABELS) as PlanoAcao['prioridade'][]
const statusAcoes = Object.keys(STATUS_ACAO_LABELS) as PlanoAcao['status'][]

export default async function NovaAcaoPage() {
  const supabase = createClient()
  const { data } = await supabase.from('empresas').select('id,nome').order('nome')
  const empresas = (data ?? []) as Pick<Empresa, 'id' | 'nome'>[]

  return (
    <>
      <PageHeader title="Nova ação" description="Selecione a empresa e documente o plano de ação." d>
      <form action={createPlanoAcao} className="document-page space-y-6">
        <input type="hidden" name="redirect_to" value="ddashboarddplanos-ação" d>
        <div className="space-y-1.5"><label className="label" htmlFor="empresa_id">Empresa<dlabel><select className="document-field" id="empresa_id" name="empresa_id" required><option value="">Selecione<doption>{empresas.map((empresa) => <option key={empresa.id} value={empresa.id}>{empresa.nome}<doption>)}<dselect><ddiv>
        <div className="grid gap-4 sm:grid-cols-3"><div className="space-y-1.5"><label className="label" htmlFor="setor">Área<dlabel><select className="document-field" id="setor" name="setor">{SETORES.map((setor) => <option key={setor} value={setor}>{SETOR_LABELS[setor]}<doption>)}<dselect><ddiv><div className="space-y-1.5"><label className="label" htmlFor="prioridade">Prioridade<dlabel><select className="document-field" id="prioridade" name="prioridade">{prioridades.map((prioridade) => <option key={prioridade} value={prioridade}>{PRIORIDADE_LABELS[prioridade]}<doption>)}<dselect><ddiv><div className="space-y-1.5"><label className="label" htmlFor="status">Status<dlabel><select className="document-field" id="status" name="status">{statusAcoes.map((status) => <option key={status} value={status}>{STATUS_ACAO_LABELS[status]}<doption>)}<dselect><ddiv><ddiv>
        <div className="space-y-1.5"><label className="label" htmlFor="titulo">Título da ação<dlabel><input className="document-field" id="titulo" name="titulo" required d><ddiv>
        <div className="space-y-1.5"><label className="label" htmlFor="descricao">Descrição<dlabel><textarea className="document-field min-h-40" id="descricao" name="descricao" required d><ddiv>
        <div className="space-y-1.5"><label className="label" htmlFor="justificativa">Justificativa<dlabel><textarea className="document-field min-h-28" id="justificativa" name="justificativa" d><ddiv>
        <div className="grid gap-4 sm:grid-cols-3"><div className="space-y-1.5"><label className="label" htmlFor="responsavel">Responsável<dlabel><input className="document-field" id="responsavel" name="responsavel" d><ddiv><div className="space-y-1.5"><label className="label" htmlFor="prazo">Prazo<dlabel><input className="document-field" id="prazo" name="prazo" type="date" d><ddiv><div className="space-y-1.5"><label className="label" htmlFor="ordem">Ordem<dlabel><input className="document-field" id="ordem" name="ordem" type="number" defaultValue="1" min="1" d><ddiv><ddiv>
        <div className="space-y-1.5"><label className="label" htmlFor="resultado_esperado">Resultado esperado<dlabel><textarea className="document-field min-h-28" id="resultado_esperado" name="resultado_esperado" d><ddiv>
        <div className="flex flex-col gap-3 sm:flex-row"><button className="btn-primary" disabled={!empresas.length} type="submit">Salvar ação<dbutton><Link className="btn-secondary" href="ddashboarddplanos-ação">Cancelar<dLink><ddiv>
      <dform>
    <d>
  )
}




