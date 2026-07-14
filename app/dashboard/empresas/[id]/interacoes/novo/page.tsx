import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { PageHeader } from '@/components/page-header'
import { createClient } from '@/lib/supabase/server'
import type { Empresa } from '@/lib/types'
import { createInteracao } from '@/app/dashboard/interacoes/actions'

export const dynamic = 'force-dynamic'

export default async function NovaInteracaoPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data } = await supabase.from('empresas').select('*').eq('id', params.id).single()
  if (!data) notFound()
  const empresa = data as Empresa

  return (
    <>
      <PageHeader title={`Nova interação - ${empresa.nome}`} description="Registre reuniões, mensagens, e-mails, ligações e follow-ups." />
      <CompanyNav empresaId={empresa.id} />
      <form action={createInteracao} className="document-page space-y-6">
        <input type="hidden" name="empresa_id" value={empresa.id} />
        <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><label className="label" htmlFor="tipo">Tipo</label><select className="document-field" id="tipo" name="tipo"><option value="ligacao">Ligação</option><option value="reuniao">Reunião</option><option value="email">E-mail</option><option value="whatsapp">WhatsApp</option><option value="outro">Outro</option></select></div><div className="space-y-1.5"><label className="label" htmlFor="data">Data</label><input className="document-field" id="data" name="data" type="datetime-local" /></div></div>
        <div className="space-y-1.5"><label className="label" htmlFor="descricao">Descrição</label><textarea className="document-field min-h-56" id="descricao" name="descricao" required /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="proximo_followup">Próximo follow-up</label><input className="document-field" id="proximo_followup" name="proximo_followup" type="date" /></div>
        <div className="flex flex-col gap-3 sm:flex-row"><button className="btn-primary" type="submit">Salvar interação</button><Link className="btn-secondary" href={`/dashboard/empresas/${empresa.id}/interacoes`}>Cancelar</Link></div>
      </form>
    </>
  )
}


