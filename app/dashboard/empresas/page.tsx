import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { STATUS_FUNIL_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function EmpresasPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('empresas')
    .select('*')
    .order('criado_em', { ascending: false })

  const empresas = (data ?? []) as Empresa[]

  return (
    <>
      <PageHeader
        title="Empresas"
        description="Cadastre clientes e prospects. Depois abra o dossiê da empresa para trabalhar diagnóstico, plano, propostas e execução em um único contexto."
      />

      <div className="mb-6 flex justify-end">
        <Link className="btn-primary" href="/dashboard/empresas/novo">
          <Plus className="h-4 w-4" />
          Nova empresa
        </Link>
      </div>

      {empresas.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {empresas.map((empresa) => (
            <Link
              className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              href={`/dashboard/empresas/${empresa.id}`}
              key={empresa.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-brand-ink">{empresa.nome}</h3>
                  <p className="mt-1 text-sm text-stone-500">{empresa.segmento}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-stone-400" />
              </div>
              <div className="mt-4 text-sm text-stone-600">
                <p>{empresa.contato_nome}</p>
                <p className="text-stone-500">{empresa.contato_email || empresa.contato_telefone || '-'}</p>
              </div>
              <span className="mt-4 inline-flex rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">
                {STATUS_FUNIL_LABELS[empresa.status_funil]}
              </span>
            </Link>
          ))}
        </section>
      ) : (
        <EmptyState message="Nenhuma empresa cadastrada. Cadastre a primeira empresa para iniciar o fluxo." />
      )}
    </>
  )
}


