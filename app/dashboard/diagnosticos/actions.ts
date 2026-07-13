'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Prioridade, SetorDiagnostico } from '@/lib/types'

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) || '').trim()
  return value || null
}

export async function createDiagnostico(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const empresaId = text(formData, 'empresa_id')
  const parecer = text(formData, 'parecer')

  if (!empresaId || !parecer) {
    throw new Error('Selecione a empresa e informe o parecer consultivo.')
  }

  await supabase.from('diagnosticos').insert({
    empresa_id: empresaId,
    setor: String(formData.get('setor') || 'comercial') as SetorDiagnostico,
    situacao_atual: text(formData, 'situacao_atual'),
    problemas_identificados: text(formData, 'problemas_identificados'),
    parecer,
    pontos_fortes: text(formData, 'pontos_fortes'),
    pontos_fracos: text(formData, 'pontos_fracos'),
    recomendacoes: text(formData, 'recomendacoes'),
    prioridade: String(formData.get('prioridade') || 'media') as Prioridade,
    avaliado_por: user.id,
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/diagnosticos')
  revalidatePath(`/dashboard/empresas/${empresaId}`)
  revalidatePath(`/dashboard/empresas/${empresaId}/diagnostico`)
  redirect(text(formData, 'redirect_to') || `/dashboard/empresas/${empresaId}/diagnostico`)
}
