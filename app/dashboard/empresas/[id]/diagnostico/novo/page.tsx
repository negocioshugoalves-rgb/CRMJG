import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { PageHeader } from '@/components/page-header'
import { PRIORIDADE_LABELS, SETOR_LABELS, SETORES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Diagnostico, Empresa } from '@/lib/types'
import { createDiagnostico } from '@/app/dashboard/diagnosticos/actions'

export const dynamic = 'force-dynamic'

const prioridades = Object.keys(PRIORIDADE_LABELS) as Diagnostico['prioridade'][]

export default async function NovoDiagnosticoPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data } = await supabase.from('empresas').select('*').eq('id', params.id).single()
  if (!data) notFound()
  const empresa = data as Empresa

  return (
    <>
      <PageHeader title={`Novo diagnóstico - ${empresa.nome}`} description="Preencha a análise em formato de documento, com espaço para textos longos." />
      <CompanyNav empresaId={empresa.id} />

      <form action={createDiagnostico} className="document-page space-y-6">
        <input type="hidden" name="empresa_id" value={empresa.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="label" htmlFor="setor">Área analisada</label>
            <select className="document-field" id="setor" name="setor">
              {SETORES.map((setor) => <option key={setor} value={setor}>{SETOR_LABELS[setor]}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="label" htmlFor="prioridade">Prioridade</label>
            <select className="document-field" id="prioridade" name="prioridade">
              {prioridades.map((prioridade) => <option key={prioridade} value={prioridade}>{PRIORIDADE_LABELS[prioridade]}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-1.5"><label className="label" htmlFor="situacao_atual">Situação atual</label><textarea className="document-field min-h-32" id="situacao_atual" name="situacao_atual" /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="problemas_identificados">Problemas identificados</label><textarea className="document-field min-h-32" id="problemas_identificados" name="problemas_identificados" /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="parecer">Parecer consultivo</label><textarea className="document-field min-h-48" id="parecer" name="parecer" required /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="pontos_fortes">Pontos fortes</label><textarea className="document-field min-h-32" id="pontos_fortes" name="pontos_fortes" /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="pontos_fracos">Pontos fracos</label><textarea className="document-field min-h-32" id="pontos_fracos" name="pontos_fracos" /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="recomendacoes">Recomendações</label><textarea className="document-field min-h-32" id="recomendacoes" name="recomendacoes" /></div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="btn-primary" type="submit">Salvar diagnóstico</button>
          <Link className="btn-secondary" href={`/dashboard/empresas/${empresa.id}/diagnostico`}>Cancelar</Link>
        </div>
      </form>
    </>
  )
}


