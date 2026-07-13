import Link from 'next/link'
import { Building2 } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { STATUS_FUNIL, STATUS_FUNIL_LABELS } from '@/lib/constants'
import { createEmpresa } from '../actions'

export const dynamic = 'force-dynamic'

export default function NovaEmpresaPage() {
  return (
    <>
      <PageHeader title="Nova empresa" description="Cadastre a empresa em uma tela limpa. Depois abra o dossie para conduzir todo o fluxo consultivo." />

      <form action={createEmpresa} className="document-page space-y-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-brand-bronze" />
          <h3 className="font-semibold text-brand-ink">Dados da empresa</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><label className="label" htmlFor="nome">Nome</label><input className="document-field" id="nome" name="nome" required /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="cnpj">CNPJ</label><input className="document-field" id="cnpj" name="cnpj" required /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="segmento">Segmento</label><input className="document-field" id="segmento" name="segmento" required /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="porte">Porte</label><select className="document-field" id="porte" name="porte"><option value="">Nao informado</option><option>Pequena</option><option>Media</option><option>Grande</option></select></div>
          <div className="space-y-1.5"><label className="label" htmlFor="contato_nome">Contato</label><input className="document-field" id="contato_nome" name="contato_nome" required /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="contato_telefone">Telefone</label><input className="document-field" id="contato_telefone" name="contato_telefone" /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="contato_email">E-mail</label><input className="document-field" id="contato_email" name="contato_email" type="email" /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="origem_prospeccao">Origem</label><input className="document-field" id="origem_prospeccao" name="origem_prospeccao" /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="status_funil">Status</label><select className="document-field" id="status_funil" name="status_funil">{STATUS_FUNIL.map((status) => <option key={status} value={status}>{STATUS_FUNIL_LABELS[status]}</option>)}</select></div>
          <div className="space-y-1.5 sm:col-span-2"><label className="label" htmlFor="observacoes">Observacoes</label><textarea className="document-field min-h-32" id="observacoes" name="observacoes" /></div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="btn-primary" type="submit">Salvar empresa</button>
          <Link className="btn-secondary" href="/dashboard/empresas">Cancelar</Link>
        </div>
      </form>
    </>
  )
}
