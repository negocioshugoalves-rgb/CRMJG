'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { StatusFunil } from '@/lib/types'

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) || '').trim()
  return value || null
}

export async function createEmpresa(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const nome = text(formData, 'nome')
  const cnpj = text(formData, 'cnpj')
  const segmento = text(formData, 'segmento')
  const contatoNome = text(formData, 'contato_nome')

  if (!nome || !cnpj || !segmento || !contatoNome) {
    throw new Error('Preencha nome, CNPJ, segmento e contato.')
  }

  await supabase.from('empresas').insert({
    nome,
    cnpj,
    segmento,
    contato_nome: contatoNome,
    porte: text(formData, 'porte'),
    contato_telefone: text(formData, 'contato_telefone'),
    contato_email: text(formData, 'contato_email'),
    origem_prospeccao: text(formData, 'origem_prospeccao'),
    observacoes: text(formData, 'observacoes'),
    status_funil: String(formData.get('status_funil') || 'prospeccao') as StatusFunil,
    criado_por: user.id,
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/empresas')
  redirect('/dashboard/empresas')
}
