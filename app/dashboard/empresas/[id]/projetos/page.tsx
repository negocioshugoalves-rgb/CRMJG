import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { STATUS_PROJETO_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Projeto, Proposta } from '@/lib/types'

export const dynamic = 'force-dynamic'

type ProjetoCompleto = Projeto & { propostas?: Pick<Proposta, 'titulo'> | null }

export default async function ProjetosEmpresaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: projetosData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('projetos').select('*, propostas(titulo)').eq('empresa_id', params.id).order('criado_em', { ascending: false }),
  ])

  if (!empresaData) notFound()

  const empresa = empresaData as Empresa
  const projetos = (projetosData ?? []) as ProjetoCompleto[]

  return (
    <>
      <PageHeader title={`Projetos - ${empresa.nome}`} description="Cards por projeto. Clique para abrir detalhes, editar status ou acessar relatórios." />
      <CompanyNav empresaId={empresa.id} />

      <div className="mb-6 flex justify-end">
        <Link className="btn-primary" href={`/dashboard/empresas/${empresa.id}/projetos/novo`}>
          <Plus className="h-4 w-4" />
          Novo projeto
        </Link>
      </div>

      {projetos.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projetos.map((projeto) => (
            <Link
              className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              href={`/dashboard/empresas/${empresa.id}/projetos/${projeto.id}`}
              key={projeto.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-brand-ink">{projeto.nome}</h3>
                  <p className="mt-1 text-sm text-stone-500">Proposta: {projeto.propostas?.titulo || '-'}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-stone-400" />
              </div>
              <span className="mt-4 inline-flex rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">
                {STATUS_PROJETO_LABELS[projeto.status]}
              </span>
              {projeto.objetivo ? <p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-700">{projeto.objetivo}</p> : null}
            </Link>
          ))}
        </section>
      ) : (
        <EmptyState message="Nenhum projeto criado para esta empresa." />
      )}
    </>
  )
}

