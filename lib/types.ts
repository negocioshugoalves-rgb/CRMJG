export type StatusFunil =
  | 'prospeccao'
  | 'diagnostico'
  | 'proposta'
  | 'fechado_ganho'
  | 'fechado_perdido'

export type SetorDiagnostico =
  | 'comunicacao'
  | 'financeiro'
  | 'administrativo_rh'
  | 'lideranca'
  | 'processos'
  | 'marketing'
  | 'operacional'
  | 'imagem_pessoal'
  | 'comercial'
  | 'qualidade'

export type StatusProposta =
  | 'em_elaboracao'
  | 'enviada'
  | 'em_negociacao'
  | 'aceita'
  | 'recusada'

export type Prioridade = 'baixa' | 'media' | 'alta' | 'critica'
export type StatusAcao = 'planejada' | 'em_andamento' | 'concluida' | 'pausada'
export type StatusProjeto = 'ativo' | 'pausado' | 'concluido' | 'cancelado'

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
  situacao_atual: string | null
  problemas_identificados: string | null
  parecer: string
  pontos_fortes: string | null
  pontos_fracos: string | null
  recomendacoes: string | null
  prioridade: Prioridade
  avaliado_em: string
}

export interface PlanoAcao {
  id: string
  empresa_id: string
  diagnostico_id: string | null
  setor: SetorDiagnostico
  titulo: string
  descricao: string
  justificativa: string | null
  responsavel: string | null
  prazo: string | null
  prioridade: Prioridade
  status: StatusAcao
  resultado_esperado: string | null
  ordem: number
  criado_em: string
}

export interface Proposta {
  id: string
  empresa_id: string
  titulo: string
  resumo_diagnostico: string | null
  descricao: string | null
  metodologia: string | null
  cronograma: string | null
  condicoes_comerciais: string | null
  valor: number | null
  status: StatusProposta
  data_envio: string | null
  data_validade: string | null
  criado_em: string
}

export interface Projeto {
  id: string
  empresa_id: string
  proposta_id: string | null
  nome: string
  objetivo: string | null
  status: StatusProjeto
  data_inicio: string | null
  data_fim_prevista: string | null
  criado_em: string
}

export interface Indicador {
  id: string
  projeto_id: string
  nome: string
  area: SetorDiagnostico | null
  valor_inicial: number | null
  meta: number | null
  valor_atual: number | null
  unidade: string | null
  atualizado_em: string
}

export interface Relatorio {
  id: string
  projeto_id: string
  titulo: string
  periodo_inicio: string | null
  periodo_fim: string | null
  atividades_realizadas: string
  resultados_obtidos: string | null
  pontos_atencao: string | null
  proximos_passos: string | null
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
export interface ConfiguracaoEmpresa {
  id: number
  nome_fantasia: string | null
  razao_social: string | null
  cnpj: string | null
  endereco: string | null
  cidade_estado: string | null
  telefone: string | null
  email: string | null
  site: string | null
  responsavel: string | null
  cargo_responsavel: string | null
  logo_url: string | null
  descricao: string | null
}

