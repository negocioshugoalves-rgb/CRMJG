import { MessageSquare } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Interacao } from '@/lib/types'
import { createInteracao } from './actions'

export const dynamic = 'force-dynamic'

type InteracaoComEmpresa = Interacao & {
  empresas?: Pick<Empresa, 'nome'> | null
}

export default async function InteracoesPage() {
  const supabase = createClient()
  const [{ data: empresasData }, { data: interacoesData }] = await Promise.all([
    supabase.from('empresas').select('id,nome').order('nome'),
    supabase
      .from('interacoes')
      .select('*, empresas(nome)')
      .order('data', { ascending: false }),
  ])

  const empresas = (empresasData ?? []) as Pick<Empresa, 'id' | 'nome'>[]
  const interacoes = (interacoesData ?? []) as InteracaoComEmpresa[]

  return (
    <>
      <PageHeader
        title="Interacoes"
        description="Registre contatos, reunioes, mensagens e proximos follow-ups para manter o relacionamento vivo."
      />

      <section className="space-y-8">
        <form action={createInteracao} className="document-page space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-bronze" />
            <h3 className="font-semibold text-brand-ink">Nova interacao</h3>
          </div>

          <div className="space-y-1.5">
            <label className="label" htmlFor="empresa_id">
              Empresa
            </label>
            <select className="document-field" id="empresa_id" name="empresa_id" required>
              <option value="">Selecione</option>
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="label" htmlFor="tipo">
                Tipo
              </label>
              <select className="document-field" id="tipo" name="tipo">
                <option value="ligacao">Ligacao</option>
                <option value="reuniao">Reuniao</option>
                <option value="email">E-mail</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="data">
                Data
              </label>
              <input className="document-field" id="data" name="data" type="datetime-local" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label" htmlFor="descricao">
              Descricao
            </label>
            <textarea className="document-field min-h-28" id="descricao" name="descricao" required />
          </div>

          <div className="space-y-1.5">
            <label className="label" htmlFor="proximo_followup">
              Proximo follow-up
            </label>
            <input className="document-field" id="proximo_followup" name="proximo_followup" type="date" />
          </div>

          <button className="btn-primary w-full" disabled={!empresas.length} type="submit">
            Salvar interacao
          </button>
        </form>

        {interacoes.length ? (
          <div className="panel overflow-hidden">
            <div className="divide-y divide-stone-100">
              {interacoes.map((interacao) => (
                <article className="px-5 py-4" key={interacao.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-brand-ink">
                        {interacao.empresas?.nome || 'Empresa'}
                      </h3>
                      <p className="text-sm capitalize text-stone-500">{interacao.tipo}</p>
                    </div>
                    <span className="text-sm text-stone-500">
                      {new Date(interacao.data).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-700">{interacao.descricao}</p>
                  {interacao.proximo_followup ? (
                    <p className="mt-3 text-sm font-semibold text-brand-bronze">
                      Proximo contato: {interacao.proximo_followup}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState message="Nenhuma interacao registrada ainda." />
        )}
      </section>
    </>
  )
}

