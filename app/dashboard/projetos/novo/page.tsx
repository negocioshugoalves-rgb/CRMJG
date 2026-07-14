import Link from 'next/link'
import { Briefcase } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { STATUS_PROJETO_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Projeto, Proposta } from '@/lib/types'
import { createProjeto } from '../actions'

export const dynamic = 'force-dynamic'

const statusProjetos = Object.keys(STATUS_PROJETO_LABELS) as Projeto['status'][]

export default async function NovoProjetoPage() {
  const supabase = createClient()
  const [{ data: empresasData }, { data: propostasData }] = await Promise.all([
    supabase.from('empresas').select('id,nome').order('nome'),
    supabase.from('propostas').select('id,titulo,empresa_id,status').order('criado_em', { ascending: false }),
  ])
  const empresas = (empresasData ?? []) as Pick<Empresa, 'id' | 'nome'>[]
  const propostas = (propostasData ?? []) as Pick<Proposta, 'id' | 'titulo' | 'empresa_id' | 'status'>[]

  return (
    <>
      <PageHeader title="Novo projeto" description="Crie o projeto de execução vinculado a uma empresa e, se desejar, a uma proposta aceita." />
      <form action={createProjeto} className="document-page space-y-6">
        <input type="hidden" name="redirect_to" value="/dashboard/projetos" />
        <div className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-brand-bronze" /><h3 className="font-semibold text-brand-ink">Dados do projeto</h3></div>
        <div className="space-y-1.5"><label className="label" htmlFor="empresa_id">Empresa</label><select className="document-field" id="empresa_id" name="empresa_id" required><option value="">Selecione</option>{empresas.map((empresa) => <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>)}</select></div>
        <div className="space-y-1.5"><label className="label" htmlFor="proposta_id">Proposta aceita</label><select className="document-field" id="proposta_id" name="proposta_id"><option value="">Sem vínculo</option>{propostas.map((proposta) => <option key={proposta.id} value={proposta.id}>{proposta.titulo}</option>)}</select></div>
        <div className="space-y-1.5"><label className="label" htmlFor="nome">Nome do projeto</label><input className="document-field" id="nome" name="nome" required /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="objetivo">Objetivo</label><textarea className="document-field min-h-48" id="objetivo" name="objetivo" /></div>
        <div className="grid gap-4 sm:grid-cols-3"><div className="space-y-1.5"><label className="label" htmlFor="data_inicio">Início</label><input className="document-field" id="data_inicio" name="data_inicio" type="date" /></div><div className="space-y-1.5"><label className="label" htmlFor="data_fim_prevista">Fim previsto</label><input className="document-field" id="data_fim_prevista" name="data_fim_prevista" type="date" /></div><div className="space-y-1.5"><label className="label" htmlFor="status">Status</label><select className="document-field" id="status" name="status">{statusProjetos.map((status) => <option key={status} value={status}>{STATUS_PROJETO_LABELS[status]}</option>)}</select></div></div>
        <div className="flex flex-col gap-3 sm:flex-row"><button className="btn-primary" disabled={!empresas.length} type="submit">Criar projeto</button><Link className="btn-secondary" href="/dashboard/projetos">Cancelar</Link></div>
      </form>
    </>
  )
}



