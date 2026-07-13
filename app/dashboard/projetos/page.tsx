import { Briefcase } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { STATUS_PROJETO_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Projeto, Proposta } from '@/lib/types'
import { createProjeto } from './actions'

export const dynamic = 'force-dynamic'

type ProjetoCompleto = Projeto & { empresas?: Pick<Empresa, 'nome'> | null; propostas?: Pick<Proposta, 'titulo'> | null }
const statusProjetos = Object.keys(STATUS_PROJETO_LABELS) as Projeto['status'][]

export default async function ProjetosPage() {
  const supabase = createClient()
  const [{ data: empresasData }, { data: propostasData }, { data: projetosData }] = await Promise.all([
    supabase.from('empresas').select('id,nome').order('nome'),
    supabase.from('propostas').select('id,titulo,empresa_id,status').order('criado_em', { ascending: false }),
    supabase.from('projetos').select('*, empresas(nome), propostas(titulo)').order('criado_em', { ascending: false }),
  ])
  const empresas = (empresasData ?? []) as Pick<Empresa, 'id' | 'nome'>[]
  const propostas = (propostasData ?? []) as Pick<Proposta, 'id' | 'titulo' | 'empresa_id' | 'status'>[]
  const projetos = (projetosData ?? []) as ProjetoCompleto[]

  return (
    <>
      <PageHeader title="Projetos" description="Acompanhe a execucao depois que a proposta for aceita: objetivo, prazo, status e proposta vinculada." />
      <section className="space-y-8">
        <form action={createProjeto} className="document-page space-y-6">
          <div className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-brand-bronze" /><h3 className="font-semibold text-brand-ink">Novo projeto</h3></div>
          <div className="space-y-1.5"><label className="label" htmlFor="empresa_id">Empresa</label><select className="document-field" id="empresa_id" name="empresa_id" required><option value="">Selecione</option>{empresas.map((empresa) => <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>)}</select></div>
          <div className="space-y-1.5"><label className="label" htmlFor="proposta_id">Proposta aceita</label><select className="document-field" id="proposta_id" name="proposta_id"><option value="">Sem vinculo</option>{propostas.map((proposta) => <option key={proposta.id} value={proposta.id}>{proposta.titulo}</option>)}</select></div>
          <div className="space-y-1.5"><label className="label" htmlFor="nome">Nome do projeto</label><input className="document-field" id="nome" name="nome" required /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="objetivo">Objetivo</label><textarea className="document-field min-h-24" id="objetivo" name="objetivo" /></div>
          <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><label className="label" htmlFor="data_inicio">Inicio</label><input className="document-field" id="data_inicio" name="data_inicio" type="date" /></div><div className="space-y-1.5"><label className="label" htmlFor="data_fim_prevista">Fim previsto</label><input className="document-field" id="data_fim_prevista" name="data_fim_prevista" type="date" /></div></div>
          <div className="space-y-1.5"><label className="label" htmlFor="status">Status</label><select className="document-field" id="status" name="status">{statusProjetos.map((status) => <option key={status} value={status}>{STATUS_PROJETO_LABELS[status]}</option>)}</select></div>
          <button className="btn-primary w-full" disabled={!empresas.length} type="submit">Criar projeto</button>
        </form>
        {projetos.length ? <div className="grid gap-4">{projetos.map((projeto) => <article className="panel p-5" key={projeto.id}><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="font-semibold text-brand-ink">{projeto.nome}</h3><p className="text-sm text-stone-500">{projeto.empresas?.nome || 'Empresa'}</p></div><span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{STATUS_PROJETO_LABELS[projeto.status]}</span></div>{projeto.objetivo ? <p className="mt-4 text-sm leading-6 text-stone-700">{projeto.objetivo}</p> : null}<div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-600"><span>Inicio: {projeto.data_inicio || '-'}</span><span>Fim previsto: {projeto.data_fim_prevista || '-'}</span><span>Proposta: {projeto.propostas?.titulo || '-'}</span></div></article>)}</div> : <EmptyState message="Nenhum projeto ativo ainda." />}
      </section>
    </>
  )
}


