import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { createClient } from '@/lib/supabase/server'
import type { Empresa } from '@/lib/types'
import { createInteracao } from '../actions'

export const dynamic = 'force-dynamic'

export default async function NovaInteracaoPage() {
  const supabase = createClient()
  const { data } = await supabase.from('empresas').select('id,nome').order('nome')
  const empresas = (data ?? []) as Pick<Empresa, 'id' | 'nome'>[]

  return (
    <>
      <PageHeader title="Nova interação" description="Registre um contato, reunião, ligação ou próximo acompanhamento." />
      <form action={createInteracao} className="document-page space-y-6">
        <input type="hidden" name="redirect_to" value="/dashboard/interacoes" />
        <div className="space-y-1.5"><label className="label" htmlFor="empresa_id">Empresa</label><select className="document-field" id="empresa_id" name="empresa_id" required><option value="">Selecione</option>{empresas.map((empresa) => <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>)}</select></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><label className="label" htmlFor="tipo">Tipo</label><select className="document-field" id="tipo" name="tipo"><option value="reuniao">Reunião</option><option value="ligacao">Ligação</option><option value="email">E-mail</option><option value="whatsapp">WhatsApp</option><option value="outro">Outro</option></select></div>
          <div className="space-y-1.5"><label className="label" htmlFor="data">Data</label><input className="document-field" id="data" name="data" type="datetime-local" /></div>
        </div>
        <div className="space-y-1.5"><label className="label" htmlFor="descricao">Descrição</label><textarea className="document-field min-h-48" id="descricao" name="descricao" required /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="proximo_followup">Próximo follow-up</label><input className="document-field" id="proximo_followup" name="proximo_followup" type="date" /></div>
        <div className="flex flex-col gap-3 sm:flex-row"><button className="btn-primary" disabled={!empresas.length} type="submit">Salvar interação</button><Link className="btn-secondary" href="/dashboard/interacoes">Cancelar</Link></div>
      </form>
    </>
  )
}
