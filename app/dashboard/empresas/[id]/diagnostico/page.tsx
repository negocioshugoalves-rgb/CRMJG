import Link from 'next/link'
import { Plus } from 'lucide-react'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { PRIORIDADE_LABELS, SETOR_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Diagnostico, Empresa } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function DiagnosticoEmpresaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: diagnosticosData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase
      .from('diagnosticos')
      .select('*')
      .eq('empresa_id', params.id)
      .order('avaliado_em', { ascending: false }),
  ])

  if (!empresaData) notFound()

  const empresa = empresaData as Empresa
  const diagnosticos = (diagnosticosData ?? []) as Diagnostico[]

  return (
    <>
      <PageHeader title={`Diagnostico - ${empresa.nome}`} description="Consulte as analises ja registradas e adicione novas avaliacoes por area quando necessario." />
      <CompanyNav empresaId={empresa.id} />

      <div className="mb-6 flex justify-end">
        <Link className="btn-primary" href={`/dashboard/empresas/${empresa.id}/diagnostico/novo`}>
          <Plus className="h-4 w-4" />
          Novo diagnostico
        </Link>
      </div>

      {diagnosticos.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {diagnosticos.map((diagnostico) => (
            <article className="panel p-5" key={diagnostico.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-brand-ink">{SETOR_LABELS[diagnostico.setor]}</h3>
                  <p className="mt-1 text-sm text-stone-500">
                    {new Date(diagnostico.avaliado_em).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">
                  {PRIORIDADE_LABELS[diagnostico.prioridade]}
                </span>
              </div>
              {diagnostico.situacao_atual ? (
                <p className="mt-4 text-sm leading-6 text-stone-700"><strong>Situacao:</strong> {diagnostico.situacao_atual}</p>
              ) : null}
              <p className="mt-3 text-sm leading-6 text-stone-700"><strong>Parecer:</strong> {diagnostico.parecer}</p>
              {diagnostico.recomendacoes ? (
                <p className="mt-3 rounded-md bg-stone-50 p-3 text-sm leading-6 text-stone-700"><strong>Recomendacao:</strong> {diagnostico.recomendacoes}</p>
              ) : null}
            </article>
          ))}
        </section>
      ) : (
        <EmptyState message="Nenhum diagnostico registrado para esta empresa." />
      )}
    </>
  )
}
