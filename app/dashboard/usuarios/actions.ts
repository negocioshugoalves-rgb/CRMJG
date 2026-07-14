'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) || '').trim()
  return value || null
}

export async function createUsuario(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: usuarios } = await supabase
    .from('usuarios')
    .select('id,tipo')
    .order('criado_em')

  const usuarioAtual = usuarios?.find((item) => item.id === user.id)
  const primeiroUsuario = usuarios?.[0]
  const isMaster = primeiroUsuario?.id === user.id || usuarioAtual?.tipo === 'master'

  if (!isMaster) {
    throw new Error('Apenas o usuário master pode cadastrar novos usuários.')
  }

  const email = text(formData, 'email')
  const password = text(formData, 'password')
  const nomeCompleto = text(formData, 'nome_completo')
  const tipo = text(formData, 'tipo') || 'user'

  if (!email || !password || !nomeCompleto) {
    throw new Error('Preencha nome, e-mail e senha temporária.')
  }

  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      nome_completo: nomeCompleto,
    },
  })

  if (error) throw new Error(error.message)

  if (data.user) {
    await admin.from('usuarios').upsert({
      id: data.user.id,
      email,
      nome_completo: nomeCompleto,
      tipo,
      ativo: true,
    })
  }

  revalidatePath('/dashboard/usuarios')
  redirect('/dashboard/usuarios')
}


