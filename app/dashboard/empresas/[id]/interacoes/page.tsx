import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Interacao } from '@/lib/types'
import { createInteracao } from '@/app/dashboard/interacoes/actions'

export const dynamic = 'force-dynamic'

export default async function InteracoesEmpresaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: interacoesData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('interacoes').select('*').eq('empresa_id', params.id).order('data', { ascending: false }),
  ])

  if (!empresaData) notFound()

  const empresa = empresaData as Empresa
  const interacoes = (interacoesData ?? []) as Interacao[]

  return (
    <>
      <PageHeader title={`Interacoes - ${empresa.nome}`} description="Registre o historico de contatos desta empresa." />
      <CompanyNav empresaId={empresa.id} />

      <form action={createInteracao} className="document-page space-y-6">
        <input type="hidden" name="empresa_id" value={empresa.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="label" htmlFor="tipo">Tipo</label>
            <select className="document-field" id="tipo" name="tipo">
              <option value="ligacao">Ligacao</option>
              <option value="reuniao">Reuniao</option>
              <option value="email">E-mail</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="data">Data</label>
            <input className="document-field" id="data" name="data" type="datetime-local" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="descricao">Descricao</label>
          <textarea className="document-field min-h-40" id="descricao" name="descricao" required />
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="proximo_followup">Proximo follow-up</label>
          <input className="document-field" id="proximo_followup" name="proximo_followup" type="date" />
        </div>
        <button className="btn-primary w-full sm:w-fit" type="submit">Salvar interacao</button>
      </form>

      <section className="mt-8">
        <h3 className="mb-4 text-lg font-bold text-brand-ink">Historico desta empresa</h3>
        {interacoes.length ? (
          <div className="grid gap-4">
            {interacoes.map((interacao) => (
              <article className="panel p-5" key={interacao.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="font-semibold capitalize text-brand-ink">{interacao.tipo}</h4>
                  <span className="text-sm text-stone-500">{new Date(interacao.data).toLocaleString('pt-BR')}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-700">{interacao.descricao}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState message="Nenhuma interacao registrada para esta empresa." />
        )}
      </section>
    </>
  )
}
