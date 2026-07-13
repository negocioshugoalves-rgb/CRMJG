import { ListChecks } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { PRIORIDADE_LABELS, SETOR_LABELS, SETORES, STATUS_ACAO_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, PlanoAcao } from '@/lib/types'
import { createPlanoAcao } from './actions'

export const dynamic = 'force-dynamic'

type PlanoComEmpresa = PlanoAcao & { empresas?: Pick<Empresa, 'nome'> | null }
const prioridades = Object.keys(PRIORIDADE_LABELS) as PlanoAcao['prioridade'][]
const statusAcoes = Object.keys(STATUS_ACAO_LABELS) as PlanoAcao['status'][]

export default async function PlanosAcaoPage() {
  const supabase = createClient()
  const [{ data: empresasData }, { data: planosData }] = await Promise.all([
    supabase.from('empresas').select('id,nome').order('nome'),
    supabase.from('planos_acao').select('*, empresas(nome)').order('ordem').order('criado_em', { ascending: false }),
  ])
  const empresas = (empresasData ?? []) as Pick<Empresa, 'id' | 'nome'>[]
  const planos = (planosData ?? []) as PlanoComEmpresa[]

  return (
    <>
      <PageHeader title="Plano de acao" description="Transforme o diagnostico em etapas objetivas, com responsaveis, prazos e resultados esperados." />
      <section className="grid gap-6 xl:grid-cols-[440px_1fr]">
        <form action={createPlanoAcao} className="panel space-y-4 p-5">
          <div className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-brand-bronze" /><h3 className="font-semibold text-brand-ink">Nova acao</h3></div>
          <div className="space-y-1.5"><label className="label" htmlFor="empresa_id">Empresa</label><select className="field" id="empresa_id" name="empresa_id" required><option value="">Selecione</option>{empresas.map((empresa) => <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>)}</select></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><label className="label" htmlFor="setor">Area</label><select className="field" id="setor" name="setor">{SETORES.map((setor) => <option key={setor} value={setor}>{SETOR_LABELS[setor]}</option>)}</select></div>
            <div className="space-y-1.5"><label className="label" htmlFor="prioridade">Prioridade</label><select className="field" id="prioridade" name="prioridade">{prioridades.map((p) => <option key={p} value={p}>{PRIORIDADE_LABELS[p]}</option>)}</select></div>
          </div>
          <div className="space-y-1.5"><label className="label" htmlFor="titulo">Titulo</label><input className="field" id="titulo" name="titulo" required /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="descricao">O que sera feito</label><textarea className="field min-h-24" id="descricao" name="descricao" required /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="justificativa">Por que sera feito</label><textarea className="field min-h-20" id="justificativa" name="justificativa" /></div>
          <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><label className="label" htmlFor="responsavel">Responsavel</label><input className="field" id="responsavel" name="responsavel" /></div><div className="space-y-1.5"><label className="label" htmlFor="prazo">Prazo</label><input className="field" id="prazo" name="prazo" type="date" /></div></div>
          <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><label className="label" htmlFor="status">Status</label><select className="field" id="status" name="status">{statusAcoes.map((s) => <option key={s} value={s}>{STATUS_ACAO_LABELS[s]}</option>)}</select></div><div className="space-y-1.5"><label className="label" htmlFor="ordem">Ordem</label><input className="field" id="ordem" name="ordem" type="number" defaultValue="1" /></div></div>
          <div className="space-y-1.5"><label className="label" htmlFor="resultado_esperado">Resultado esperado</label><textarea className="field min-h-20" id="resultado_esperado" name="resultado_esperado" /></div>
          <button className="btn-primary w-full" disabled={!empresas.length} type="submit">Salvar acao</button>
        </form>
        {planos.length ? <div className="grid gap-4">{planos.map((plano) => <article className="panel p-5" key={plano.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold text-brand-ink">{plano.titulo}</h3><p className="text-sm text-stone-500">{plano.empresas?.nome || 'Empresa'} · {SETOR_LABELS[plano.setor]}</p></div><span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{STATUS_ACAO_LABELS[plano.status]}</span></div><p className="mt-4 text-sm leading-6 text-stone-700">{plano.descricao}</p>{plano.resultado_esperado ? <p className="mt-3 rounded-md bg-stone-50 p-3 text-sm text-stone-700"><strong>Resultado esperado:</strong> {plano.resultado_esperado}</p> : null}<div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-600"><span>Prioridade: {PRIORIDADE_LABELS[plano.prioridade]}</span><span>Responsavel: {plano.responsavel || '-'}</span><span>Prazo: {plano.prazo || '-'}</span></div></article>)}</div> : <EmptyState message="Nenhuma acao planejada ainda." />}
      </section>
    </>
  )
}
