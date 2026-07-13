import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { STATUS_PROJETO_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Projeto, Proposta } from '@/lib/types'
import { createProjetoEmpresa } from './actions'

export const dynamic = 'force-dynamic'

type ProjetoCompleto = Projeto & { propostas?: Pick<Proposta, 'titulo'> | null }
const statusProjetos = Object.keys(STATUS_PROJETO_LABELS) as Projeto['status'][]

export default async function ProjetosEmpresaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: propostasData }, { data: projetosData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('propostas').select('id,titulo,status').eq('empresa_id', params.id).order('criado_em', { ascending: false }),
    supabase.from('projetos').select('*, propostas(titulo)').eq('empresa_id', params.id).order('criado_em', { ascending: false }),
  ])

  if (!empresaData) notFound()

  const empresa = empresaData as Empresa
  const propostas = (propostasData ?? []) as Pick<Proposta, 'id' | 'titulo' | 'status'>[]
  const projetos = (projetosData ?? []) as ProjetoCompleto[]

  return (
    <>
      <PageHeader title={`Projetos - ${empresa.nome}`} description="Crie e acompanhe projetos aceitos desta empresa." />
      <CompanyNav empresaId={empresa.id} />

      <form action={createProjetoEmpresa} className="document-page space-y-6">
        <input type="hidden" name="empresa_id" value={empresa.id} />
        <div className="space-y-1.5">
          <label className="label" htmlFor="proposta_id">Proposta aceita</label>
          <select className="document-field" id="proposta_id" name="proposta_id">
            <option value="">Sem vinculo</option>
            {propostas.map((proposta) => <option key={proposta.id} value={proposta.id}>{proposta.titulo}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="nome">Nome do projeto</label>
          <input className="document-field" id="nome" name="nome" required />
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="objetivo">Objetivo</label>
          <textarea className="document-field min-h-40" id="objetivo" name="objetivo" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="label" htmlFor="data_inicio">Inicio</label>
            <input className="document-field" id="data_inicio" name="data_inicio" type="date" />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="data_fim_prevista">Fim previsto</label>
            <input className="document-field" id="data_fim_prevista" name="data_fim_prevista" type="date" />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="status">Status</label>
            <select className="document-field" id="status" name="status">
              {statusProjetos.map((status) => <option key={status} value={status}>{STATUS_PROJETO_LABELS[status]}</option>)}
            </select>
          </div>
        </div>
        <button className="btn-primary w-full sm:w-fit" type="submit">Criar projeto</button>
      </form>

      <section className="mt-8">
        <h3 className="mb-4 text-lg font-bold text-brand-ink">Projetos desta empresa</h3>
        {projetos.length ? (
          <div className="grid gap-4">
            {projetos.map((projeto) => (
              <Link className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md" href={`/dashboard/projetos/${projeto.id}/relatorios`} key={projeto.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-brand-ink">{projeto.nome}</h4>
                    <p className="text-sm text-stone-500">Proposta: {projeto.propostas?.titulo || '-'}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-stone-400" />
                </div>
                <span className="mt-4 inline-flex rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">
                  {STATUS_PROJETO_LABELS[projeto.status]}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState message="Nenhum projeto criado para esta empresa." />
        )}
      </section>
    </>
  )
}

