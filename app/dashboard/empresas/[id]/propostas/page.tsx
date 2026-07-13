import Link from 'next/link'
import { FileDown, Plus } from 'lucide-react'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { STATUS_PROPOSTA_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Proposta } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function PropostasEmpresaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: propostasData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('propostas').select('*').eq('empresa_id', params.id).order('criado_em', { ascending: false }),
  ])

  if (!empresaData) notFound()

  const empresa = empresaData as Empresa
  const propostas = (propostasData ?? []) as Proposta[]

  return (
    <>
      <PageHeader title={`Propostas - ${empresa.nome}`} description="Consulte propostas da empresa e crie uma nova proposta baseada no diagnostico e no plano de acao." />
      <CompanyNav empresaId={empresa.id} />

      <div className="mb-6 flex justify-end">
        <Link className="btn-primary" href={`/dashboard/empresas/${empresa.id}/propostas/novo`}>
          <Plus className="h-4 w-4" />
          Nova proposta
        </Link>
      </div>

      {propostas.length ? (
        <section className="grid gap-4 md:grid-cols-2">
          {propostas.map((proposta) => (
            <article className="panel p-5" key={proposta.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-brand-ink">{proposta.titulo}</h3>
                  <p className="mt-1 text-sm text-stone-500">Validade: {proposta.data_validade || '-'}</p>
                </div>
                <span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">
                  {STATUS_PROPOSTA_LABELS[proposta.status]}
                </span>
              </div>
              {proposta.resumo_diagnostico ? (
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-700">{proposta.resumo_diagnostico}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3">
                <Link className="btn-secondary w-fit" href={`/dashboard/propostas/${proposta.id}/pdf`} target="_blank">
                  <FileDown className="h-4 w-4" />
                  Baixar PDF
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState message="Nenhuma proposta criada para esta empresa." />
      )}
    </>
  )
}
