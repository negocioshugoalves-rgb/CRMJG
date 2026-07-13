import { FileText } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { STATUS_PROPOSTA_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Proposta } from '@/lib/types'
import { createProposta } from './actions'

export const dynamic = 'force-dynamic'

type PropostaComEmpresa = Proposta & {
  empresas?: Pick<Empresa, 'nome'> | null
}

const statusProposta = Object.keys(STATUS_PROPOSTA_LABELS) as Proposta['status'][]

export default async function PropostasPage() {
  const supabase = createClient()
  const [{ data: empresasData }, { data: propostasData }] = await Promise.all([
    supabase.from('empresas').select('id,nome').order('nome'),
    supabase
      .from('propostas')
      .select('*, empresas(nome)')
      .order('criado_em', { ascending: false }),
  ])

  const empresas = (empresasData ?? []) as Pick<Empresa, 'id' | 'nome'>[]
  const propostas = (propostasData ?? []) as PropostaComEmpresa[]

  return (
    <>
      <PageHeader
        title="Propostas"
        description="Controle escopo, valor, status e validade das propostas comerciais geradas a partir dos diagnosticos."
      />

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form action={createProposta} className="panel space-y-4 p-5">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-bronze" />
            <h3 className="font-semibold text-brand-ink">Nova proposta</h3>
          </div>

          <div className="space-y-1.5">
            <label className="label" htmlFor="empresa_id">
              Empresa
            </label>
            <select className="field" id="empresa_id" name="empresa_id" required>
              <option value="">Selecione</option>
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="titulo">
              Titulo
            </label>
            <input className="field" id="titulo" name="titulo" required />
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="descricao">
              Escopo
            </label>
            <textarea className="field min-h-24" id="descricao" name="descricao" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="label" htmlFor="valor">
                Valor
              </label>
              <input className="field" id="valor" name="valor" type="number" step="0.01" />
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="status">
                Status
              </label>
              <select className="field" id="status" name="status">
                {statusProposta.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_PROPOSTA_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="data_envio">
                Envio
              </label>
              <input className="field" id="data_envio" name="data_envio" type="date" />
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="data_validade">
                Validade
              </label>
              <input className="field" id="data_validade" name="data_validade" type="date" />
            </div>
          </div>

          <button className="btn-primary w-full" disabled={!empresas.length} type="submit">
            Salvar proposta
          </button>
        </form>

        {propostas.length ? (
          <div className="grid gap-4">
            {propostas.map((proposta) => (
              <article className="panel p-5" key={proposta.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-brand-ink">{proposta.titulo}</h3>
                    <p className="text-sm text-stone-500">{proposta.empresas?.nome || 'Empresa'}</p>
                  </div>
                  <span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">
                    {STATUS_PROPOSTA_LABELS[proposta.status]}
                  </span>
                </div>
                {proposta.descricao ? (
                  <p className="mt-4 text-sm leading-6 text-stone-700">{proposta.descricao}</p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-600">
                  <span>
                    Valor:{' '}
                    {proposta.valor
                      ? proposta.valor.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })
                      : '-'}
                  </span>
                  <span>Validade: {proposta.data_validade || '-'}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState message="Nenhuma proposta cadastrada ainda." />
        )}
      </section>
    </>
  )
}
