import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { PageHeader } from '@/components/page-header'
import { ProposalAutofillForm } from '@/components/proposal-autofill-form'
import { SETOR_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Diagnostico, Empresa, PlanoAcao } from '@/lib/types'

export const dynamic = 'force-dynamic'

function buildResumo(diagnosticos: Diagnostico[]) {
  if (!diagnosticos.length) return ''
  return diagnosticos.map((item) => `${SETOR_LABELS[item.setor]}: ${item.parecer}`).join('\n\n')
}

function buildEscopo(planos: PlanoAcao[]) {
  if (!planos.length) return ''
  return planos.map((item) => `${item.ordem}. ${item.titulo}\n${item.descricao}`).join('\n\n')
}

export default async function NovaPropostaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: diagnosticosData }, { data: planosData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('diagnosticos').select('*').eq('empresa_id', params.id).order('avaliado_em'),
    supabase.from('planos_acao').select('*').eq('empresa_id', params.id).order('ordem'),
  ])

  if (!empresaData) notFound()

  const empresa = empresaData as Empresa
  const diagnosticos = (diagnosticosData ?? []) as Diagnostico[]
  const planos = (planosData ?? []) as PlanoAcao[]
  const sources = {
    [empresa.id]: {
      titulo: `Proposta de Consultoria Empresarial - ${empresa.nome}`,
      resumoDiagnostico: buildResumo(diagnosticos),
      escopoPlano: buildEscopo(planos),
    },
  }

  return (
    <>
      <PageHeader title={`Nova proposta - ${empresa.nome}`} description="Clique no botao para puxar automaticamente diagnostico e plano de acao desta empresa." />
      <CompanyNav empresaId={empresa.id} />
      <ProposalAutofillForm empresas={[{ id: empresa.id, nome: empresa.nome }]} sources={sources} defaultEmpresaId={empresa.id} cancelHref={`/dashboard/empresas/${empresa.id}/propostas`} redirectTo={`/dashboard/empresas/${empresa.id}/propostas`} />
    </>
  )
}
