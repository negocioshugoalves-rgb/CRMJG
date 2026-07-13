export type StatusFunil =
  | 'prospeccao'
  | 'diagnostico'
  | 'proposta'
  | 'fechado_ganho'
  | 'fechado_perdido'

export type SetorDiagnostico =
  | 'comunicacao'
  | 'administrativo_rh'
  | 'lideranca'
  | 'imagem_pessoal'
  | 'comercial'
  | 'qualidade'

export type StatusProposta =
  | 'em_elaboracao'
  | 'enviada'
  | 'em_negociacao'
  | 'aceita'
  | 'recusada'

export interface Empresa {
  id: string
  nome: string
  cnpj: string
  segmento: string
  porte: string | null
  contato_nome: string
  contato_telefone: string | null
  contato_email: string | null
  origem_prospeccao: string | null
  status_funil: StatusFunil
  observacoes: string | null
  criado_em: string
  atualizado_em: string
  criado_por: string | null
}

export interface Diagnostico {
  id: string
  empresa_id: string
  setor: SetorDiagnostico
  parecer: string
  pontos_fortes: string | null
  pontos_fracos: string | null
  recomendacoes: string | null
  avaliado_em: string
}

export interface Proposta {
  id: string
  empresa_id: string
  titulo: string
  descricao: string | null
  valor: number | null
  status: StatusProposta
  data_envio: string | null
  data_validade: string | null
  criado_em: string
}

export interface Interacao {
  id: string
  empresa_id: string
  tipo: string
  descricao: string
  data: string
  proximo_followup: string | null
}
