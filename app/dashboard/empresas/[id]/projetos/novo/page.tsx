import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { PageHeader } from '@/components/page-header'
import { STATUS_PROJETO_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Projeto, Proposta } from '@/lib/types'
import { createProjetoEmpresa } from '../actions'

export const dynamic = 'force-dynamic'

const statusProjetos = Object.keys(STATUS_PROJETO_LABELS) as Projeto['status'][]

export default async function NovoProjetoEmpresaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: propostasData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('propostas').select('id,titulo,status').eq('empresa_id', params.id).order('criado_em', { ascending: false }),
  ])

  if (!empresaData) notFound()

  const empresa = empresaData as Empresa
  const propostas = (propostasData ?? []) as Pick<Proposta, 'id' | 'titulo' | 'status'>[]

  return (
    <>
      <PageHeader title={`Novo projeto - ${empresa.nome}`} description="Cadastre o projeto em uma tela limpa, como um documento operacional." />
      <CompanyNav empresaId={empresa.id} />

      <form action={createProjetoEmpresa} className="document-page space-y-6">
        <input type="hidden" name="empresa_id" value={empresa.id} />

        <div className="space-y-1.5">
          <label className="label" htmlFor="proposta_id">Proposta aceita</label>
          <select className="document-field" id="proposta_id" name="proposta_id">
            <option value="">Sem vínculo</option>
            {propostas.map((proposta) => (
              <option key={proposta.id} value={proposta.id}>{proposta.titulo}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="label" htmlFor="nome">Nome do projeto</label>
          <input className="document-field" id="nome" name="nome" required />
        </div>

        <div className="space-y-1.5">
          <label className="label" htmlFor="objetivo">Objetivo</label>
          <textarea className="document-field min-h-48" id="objetivo" name="objetivo" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="label" htmlFor="data_inicio">Início</label>
            <input className="document-field" id="data_inicio" name="data_inicio" type="date" />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="data_fim_prevista">Fim previsto</label>
            <input className="document-field" id="data_fim_prevista" name="data_fim_prevista" type="date" />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="status">Status</label>
            <select className="document-field" id="status" name="status">
              {statusProjetos.map((status) => (
                <option key={status} value={status}>{STATUS_PROJETO_LABELS[status]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="btn-primary" type="submit">Criar projeto</button>
          <Link className="btn-secondary" href={`/dashboard/empresas/${empresa.id}/projetos`}>Cancelar</Link>
        </div>
      </form>
    </>
  )
}

