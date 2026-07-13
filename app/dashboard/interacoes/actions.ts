'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) || '').trim()
  return value || null
}

export async function createInteracao(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const empresaId = text(formData, 'empresa_id')
  const descricao = text(formData, 'descricao')

  if (!empresaId || !descricao) {
    throw new Error('Selecione a empresa e descreva a interacao.')
  }

  await supabase.from('interacoes').insert({
    empresa_id: empresaId,
    tipo: text(formData, 'tipo') || 'outro',
    descricao,
    data: text(formData, 'data') || new Date().toISOString(),
    proximo_followup: text(formData, 'proximo_followup'),
    criado_por: user.id,
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/interacoes')
  revalidatePath(`/dashboard/empresas/${empresaId}`)
  revalidatePath(`/dashboard/empresas/${empresaId}/interacoes`)
}
