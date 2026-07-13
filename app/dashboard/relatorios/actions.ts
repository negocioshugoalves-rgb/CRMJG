'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { SetorDiagnostico } from '@/lib/types'

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) || '').trim()
  return value || null
}

function numberValue(formData: FormData, key: string) {
  const value = text(formData, key)
  return value ? Number(value.replace(',', '.')) : null
}

export async function createIndicador(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const projetoId = text(formData, 'projeto_id')
  const nome = text(formData, 'nome')

  if (!projetoId || !nome) {
    throw new Error('Selecione o projeto e informe o indicador.')
  }

  await supabase.from('indicadores').insert({
    projeto_id: projetoId,
    nome,
    area: text(formData, 'area') as SetorDiagnostico | null,
    valor_inicial: numberValue(formData, 'valor_inicial'),
    meta: numberValue(formData, 'meta'),
    valor_atual: numberValue(formData, 'valor_atual'),
    unidade: text(formData, 'unidade'),
    criado_por: user.id,
  })

  revalidatePath('/dashboard/relatorios')
  revalidatePath(`/dashboard/projetos/${projetoId}/relatorios`)
}

export async function createRelatorio(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const projetoId = text(formData, 'projeto_id')
  const titulo = text(formData, 'titulo')
  const atividades = text(formData, 'atividades_realizadas')

  if (!projetoId || !titulo || !atividades) {
    throw new Error('Preencha projeto, titulo e atividades.')
  }

  await supabase.from('relatorios').insert({
    projeto_id: projetoId,
    titulo,
    periodo_inicio: text(formData, 'periodo_inicio'),
    periodo_fim: text(formData, 'periodo_fim'),
    atividades_realizadas: atividades,
    resultados_obtidos: text(formData, 'resultados_obtidos'),
    pontos_atencao: text(formData, 'pontos_atencao'),
    proximos_passos: text(formData, 'proximos_passos'),
    criado_por: user.id,
  })

  revalidatePath('/dashboard/relatorios')
  revalidatePath(`/dashboard/projetos/${projetoId}/relatorios`)
}
