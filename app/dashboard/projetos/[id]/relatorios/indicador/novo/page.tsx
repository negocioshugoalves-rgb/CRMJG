import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import { SETOR_LABELS, SETORES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Projeto } from '@/lib/types'
import { createIndicador } from '@/app/dashboard/relatorios/actions'

export const dynamic = 'force-dynamic'
type ProjetoCompleto = Projeto & { empresas?: Pick<Empresa, 'id' | 'nome'> | null }

export default async function NovoIndicadorPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data } = await supabase.from('projetos').select('*, empresas(id,nome)').eq('id', params.id).single()
  if (!data) notFound()
  const projeto = data as ProjetoCompleto

  return (
    <>
      <PageHeader title={`Novo indicador - ${projeto.nome}`} description="Cadastre uma metrica para acompanhar a evolucao do projeto." />
      <form action={createIndicador} className="document-page space-y-6">
        <input type="hidden" name="projeto_id" value={projeto.id} />
        <div className="space-y-1.5"><label className="label" htmlFor="nome">Indicador</label><input className="document-field" id="nome" name="nome" required /></div>
        <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><label className="label" htmlFor="area">Area</label><select className="document-field" id="area" name="area"><option value="">Geral</option>{SETORES.map((setor) => <option key={setor} value={setor}>{SETOR_LABELS[setor]}</option>)}</select></div><div className="space-y-1.5"><label className="label" htmlFor="unidade">Unidade</label><input className="document-field" id="unidade" name="unidade" placeholder="%, R$, dias..." /></div></div>
        <div className="grid gap-4 sm:grid-cols-3"><div className="space-y-1.5"><label className="label" htmlFor="valor_inicial">Valor inicial</label><input className="document-field" id="valor_inicial" name="valor_inicial" type="number" step="0.01" /></div><div className="space-y-1.5"><label className="label" htmlFor="valor_atual">Valor atual</label><input className="document-field" id="valor_atual" name="valor_atual" type="number" step="0.01" /></div><div className="space-y-1.5"><label className="label" htmlFor="meta">Meta</label><input className="document-field" id="meta" name="meta" type="number" step="0.01" /></div></div>
        <div className="flex flex-col gap-3 sm:flex-row"><button className="btn-primary" type="submit">Salvar indicador</button><Link className="btn-secondary" href={`/dashboard/projetos/${projeto.id}/relatorios`}>Cancelar</Link></div>
      </form>
    </>
  )
}
