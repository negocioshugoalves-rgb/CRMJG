'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Prioridade, SetorDiagnostico, StatusAcao } from '@/lib/types'

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) || '').trim()
  return value || null
}

export async function createPlanoAcao(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const empresaId = text(formData, 'empresa_id')
  const titulo = text(formData, 'titulo')
  const descricao = text(formData, 'descricao')
  if (!empresaId || !titulo || !descricao) throw new Error('Preencha empresa, titulo e descricao.')

  await supabase.from('planos_acao').insert({
    empresa_id: empresaId,
    setor: String(formData.get('setor') || 'comercial') as SetorDiagnostico,
    titulo,
    descricao,
    justificativa: text(formData, 'justificativa'),
    responsavel: text(formData, 'responsavel'),
    prazo: text(formData, 'prazo'),
    prioridade: String(formData.get('prioridade') || 'media') as Prioridade,
    status: String(formData.get('status') || 'planejada') as StatusAcao,
    resultado_esperado: text(formData, 'resultado_esperado'),
    ordem: Number(formData.get('ordem') || 1),
    criado_por: user.id,
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/planos-acao')
}
