'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { StatusProjeto } from '@/lib/types'

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) || '').trim()
  return value || null
}

export async function createProjetoEmpresa(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const empresaId = text(formData, 'empresa_id')
  const nome = text(formData, 'nome')

  if (!empresaId || !nome) {
    throw new Error('Preencha empresa e nome do projeto.')
  }

  await supabase.from('projetos').insert({
    empresa_id: empresaId,
    proposta_id: text(formData, 'proposta_id'),
    nome,
    objetivo: text(formData, 'objetivo'),
    status: String(formData.get('status') || 'ativo') as StatusProjeto,
    data_inicio: text(formData, 'data_inicio'),
    data_fim_prevista: text(formData, 'data_fim_prevista'),
    criado_por: user.id,
  })

  await supabase.from('empresas').update({ status_funil: 'fechado_ganho' }).eq('id', empresaId)

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/empresas/${empresaId}`)
  revalidatePath(`/dashboard/empresas/${empresaId}/projetos`)
  redirect(`/dashboard/empresas/${empresaId}/projetos`)
}

export async function updateProjetoStatus(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const projetoId = text(formData, 'projeto_id')
  const empresaId = text(formData, 'empresa_id')
  const status = text(formData, 'status') as StatusProjeto | null

  if (!projetoId || !empresaId || !status) {
    throw new Error('Dados do projeto incompletos.')
  }

  await supabase.from('projetos').update({ status }).eq('id', projetoId)

  revalidatePath(`/dashboard/empresas/${empresaId}/projetos`)
  revalidatePath(`/dashboard/empresas/${empresaId}/projetos/${projetoId}`)
  revalidatePath(`/dashboard/projetos/${projetoId}/relatorios`)
}
