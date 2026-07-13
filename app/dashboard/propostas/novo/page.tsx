import { PageHeader } from '@/components/page-header'
import { ProposalAutofillForm } from '@/components/proposal-autofill-form'
import { SETOR_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Diagnostico, Empresa, PlanoAcao } from '@/lib/types'

export const dynamic = 'force-dynamic'

type EmpresaOption = Pick<Empresa, 'id' | 'nome'>

function buildResumo(diagnosticos: Diagnostico[]) {
  if (!diagnosticos.length) return ''
  return diagnosticos.map((item) => `${SETOR_LABELS[item.setor]}: ${item.parecer}`).join('\n\n')
}

function buildEscopo(planos: PlanoAcao[]) {
  if (!planos.length) return ''
  return planos.map((item) => `${item.ordem}. ${item.titulo}\n${item.descricao}`).join('\n\n')
}

export default async function NovaPropostaPage() {
  const supabase = createClient()
  const [{ data: empresasData }, { data: diagnosticosData }, { data: planosData }] = await Promise.all([
    supabase.from('empresas').select('id,nome').order('nome'),
    supabase.from('diagnosticos').select('*').order('avaliado_em'),
    supabase.from('planos_acao').select('*').order('ordem'),
  ])

  const empresas = (empresasData ?? []) as EmpresaOption[]
  const diagnosticos = (diagnosticosData ?? []) as Diagnostico[]
  const planos = (planosData ?? []) as PlanoAcao[]
  const sources = Object.fromEntries(empresas.map((empresa) => {
    const diagnosticosEmpresa = diagnosticos.filter((item) => item.empresa_id === empresa.id)
    const planosEmpresa = planos.filter((item) => item.empresa_id === empresa.id)
    return [empresa.id, {
      titulo: `Proposta de Consultoria Empresarial - ${empresa.nome}`,
      resumoDiagnostico: buildResumo(diagnosticosEmpresa),
      escopoPlano: buildEscopo(planosEmpresa),
    }]
  }))

  return (
    <>
      <PageHeader title="Nova proposta" description="Selecione a empresa e clique no botao para puxar diagnostico e plano de acao automaticamente." />
      <ProposalAutofillForm empresas={empresas} sources={sources} cancelHref="/dashboard/propostas" redirectTo="/dashboard/propostas" />
    </>
  )
}
