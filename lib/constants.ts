import type { SetorDiagnostico, StatusFunil, StatusProposta } from '@/lib/types'

export const STATUS_FUNIL_LABELS: Record<StatusFunil, string> = {
  prospeccao: 'Prospeccao',
  diagnostico: 'Diagnostico',
  proposta: 'Proposta',
  fechado_ganho: 'Fechado ganho',
  fechado_perdido: 'Fechado perdido',
}

export const STATUS_PROPOSTA_LABELS: Record<StatusProposta, string> = {
  em_elaboracao: 'Em elaboracao',
  enviada: 'Enviada',
  em_negociacao: 'Em negociacao',
  aceita: 'Aceita',
  recusada: 'Recusada',
}

export const SETOR_LABELS: Record<SetorDiagnostico, string> = {
  comunicacao: 'Comunicacao',
  administrativo_rh: 'Administrativo / RH',
  lideranca: 'Lideranca',
  imagem_pessoal: 'Imagem pessoal',
  comercial: 'Comercial',
  qualidade: 'Qualidade',
}

export const SETORES = Object.keys(SETOR_LABELS) as SetorDiagnostico[]

export const STATUS_FUNIL = Object.keys(STATUS_FUNIL_LABELS) as StatusFunil[]
