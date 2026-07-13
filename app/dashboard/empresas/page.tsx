import { Building2 } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { STATUS_FUNIL, STATUS_FUNIL_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa } from '@/lib/types'
import { createEmpresa } from './actions'

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
        description="Cadastre prospects e clientes, acompanhe responsaveis e mantenha o status do funil sempre atualizado."
      />

      <section className="space-y-8">
        <form action={createEmpresa} className="document-page space-y-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-brand-bronze" />
            <h3 className="font-semibold text-brand-ink">Nova empresa</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="label" htmlFor="nome">
                Nome
              </label>
              <input className="document-field" id="nome" name="nome" required />
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="cnpj">
                CNPJ
              </label>
              <input className="document-field" id="cnpj" name="cnpj" required />
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="segmento">
                Segmento
              </label>
              <input className="document-field" id="segmento" name="segmento" required />
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="porte">
                Porte
              </label>
              <select className="document-field" id="porte" name="porte">
                <option value="">Nao informado</option>
                <option>Pequena</option>
                <option>Media</option>
                <option>Grande</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="contato_nome">
                Contato
              </label>
              <input className="document-field" id="contato_nome" name="contato_nome" required />
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="contato_telefone">
                Telefone
              </label>
              <input className="document-field" id="contato_telefone" name="contato_telefone" />
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="contato_email">
                E-mail
              </label>
              <input className="document-field" id="contato_email" name="contato_email" type="email" />
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="origem_prospeccao">
                Origem
              </label>
              <input className="document-field" id="origem_prospeccao" name="origem_prospeccao" />
            </div>
            <div className="space-y-1.5">
              <label className="label" htmlFor="status_funil">
                Status
              </label>
              <select className="document-field" id="status_funil" name="status_funil">
                {STATUS_FUNIL.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_FUNIL_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="label" htmlFor="observacoes">
                Observacoes
              </label>
              <textarea className="document-field min-h-24" id="observacoes" name="observacoes" />
            </div>
          </div>

          <button className="btn-primary w-full" type="submit">
            Salvar empresa
          </button>
        </form>

        <div>
          {empresas.length ? (
            <div className="panel overflow-hidden">
              <div className="grid border-b border-stone-200 bg-stone-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
                <span>Empresa</span>
                <span>Contato</span>
                <span>Segmento</span>
                <span>Status</span>
              </div>
              <div className="divide-y divide-stone-100">
                {empresas.map((empresa) => (
                  <div className="grid gap-2 px-5 py-4 text-sm md:grid-cols-[1.2fr_1fr_1fr_1fr] md:items-center" key={empresa.id}>
                    <div>
                      <p className="font-semibold text-brand-ink">{empresa.nome}</p>
                      <p className="text-stone-500">{empresa.cnpj}</p>
                    </div>
                    <div>
                      <p className="text-stone-700">{empresa.contato_nome}</p>
                      <p className="text-stone-500">{empresa.contato_email || empresa.contato_telefone || '-'}</p>
                    </div>
                    <p className="text-stone-700">{empresa.segmento}</p>
                    <span className="w-fit rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">
                      {STATUS_FUNIL_LABELS[empresa.status_funil]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState message="Nenhuma empresa cadastrada. Use o formulario para iniciar o funil." />
          )}
        </div>
      </section>
    </>
  )
}

