'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) || '').trim()
  return value || null
}

function color(formData: FormData, key: string, fallback: string) {
  const value = String(formData.get(key) || '').trim()
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback
}

export async function salvarConfiguracaoEmpresa(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  await supabase.from('configuracoes_empresa').upsert({
    id: 1,
    nome_fantasia: text(formData, 'nome_fantasia'),
    razao_social: text(formData, 'razao_social'),
    cnpj: text(formData, 'cnpj'),
    endereco: text(formData, 'endereco'),
    cidade_estado: text(formData, 'cidade_estado'),
    telefone: text(formData, 'telefone'),
    email: text(formData, 'email'),
    site: text(formData, 'site'),
    responsavel: text(formData, 'responsavel'),
    cargo_responsavel: text(formData, 'cargo_responsavel'),
    logo_url: text(formData, 'logo_url'),
    descricao: text(formData, 'descricao'),
    cor_primaria: color(formData, 'cor_primaria', '#1f2933'),
    cor_secundaria: color(formData, 'cor_secundaria', '#9a6a2f'),
    cor_destaque: color(formData, 'cor_destaque', '#d9b46c'),
    atualizado_por: user.id,
  })

  revalidatePath('/dashboard/configuracoes')
  revalidatePath('/dashboard/propostas')
  redirect('/dashboard/configuracoes')
}