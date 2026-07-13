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
  financeiro: 'Financeiro',
  administrativo_rh: 'Administrativo / RH',
  lideranca: 'Lideranca',
  processos: 'Processos',
  marketing: 'Marketing',
  operacional: 'Operacional',
  imagem_pessoal: 'Imagem pessoal',
  comercial: 'Comercial',
  qualidade: 'Qualidade',
}

export const SETORES = Object.keys(SETOR_LABELS) as SetorDiagnostico[]
export const STATUS_FUNIL = Object.keys(STATUS_FUNIL_LABELS) as StatusFunil[]

export const PRIORIDADE_LABELS = {
  baixa: 'Baixa',
  media: 'Media',
  alta: 'Alta',
  critica: 'Critica',
} as const

export const STATUS_ACAO_LABELS = {
  planejada: 'Planejada',
  em_andamento: 'Em andamento',
  concluida: 'Concluida',
  pausada: 'Pausada',
} as const

export const STATUS_PROJETO_LABELS = {
  ativo: 'Ativo',
  pausado: 'Pausado',
  concluido: 'Concluido',
  cancelado: 'Cancelado',
} as const
