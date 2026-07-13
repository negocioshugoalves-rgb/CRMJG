'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { StatusProposta } from '@/lib/types'

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) || '').trim()
  return value || null
}

export async function createProposta(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const empresaId = text(formData, 'empresa_id')
  const titulo = text(formData, 'titulo')

  if (!empresaId || !titulo) {
    throw new Error('Selecione a empresa e informe o titulo.')
  }

  const valorTexto = text(formData, 'valor')
  const valor = valorTexto ? Number(valorTexto.replace(',', '.')) : null

  await supabase.from('propostas').insert({
    empresa_id: empresaId,
    titulo,
    resumo_diagnostico: text(formData, 'resumo_diagnostico'),
    descricao: text(formData, 'descricao'),
    metodologia: text(formData, 'metodologia'),
    cronograma: text(formData, 'cronograma'),
    condicoes_comerciais: text(formData, 'condicoes_comerciais'),
    valor,
    status: String(formData.get('status') || 'em_elaboracao') as StatusProposta,
    data_envio: text(formData, 'data_envio'),
    data_validade: text(formData, 'data_validade'),
    criado_por: user.id,
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/propostas')
  revalidatePath(`/dashboard/empresas/${empresaId}`)
  revalidatePath(`/dashboard/empresas/${empresaId}/propostas`)
}
