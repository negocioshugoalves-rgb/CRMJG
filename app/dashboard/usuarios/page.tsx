import { redirect } from 'next/navigation'
import { UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { createClient } from '@/lib/supabase/server'
import { createUsuario } from './actions'

export const dynamic = 'force-dynamic'

interface Usuario {
  id: string
  email: string
  nome_completo: string | null
  tipo: string | null
  ativo: boolean | null
  criado_em: string
}

export default async function UsuariosPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data } = await supabase.from('usuarios').select('*').order('criado_em')
  const usuarios = (data ?? []) as Usuario[]
  const usuarioAtual = usuarios.find((usuario) => usuario.id === user.id)
  const primeiroUsuario = usuarios[0]
  const isMaster = primeiroUsuario?.id === user.id || usuarioAtual?.tipo === 'master'

  return (
    <>
      <PageHeader
        title="Usuarios"
        description="O primeiro usuario cadastrado e o master. Ele pode cadastrar novos acessos para a equipe."
      />

      {isMaster ? (
        <form action={createUsuario} className="document-page mb-8 space-y-6">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-brand-bronze" />
            <h3 className="font-semibold text-brand-ink">Novo usuario</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><label className="label" htmlFor="nome_completo">Nome completo</label><input className="document-field" id="nome_completo" name="nome_completo" required /></div>
            <div className="space-y-1.5"><label className="label" htmlFor="email">E-mail</label><input className="document-field" id="email" name="email" type="email" required /></div>
            <div className="space-y-1.5"><label className="label" htmlFor="password">Senha temporaria</label><input className="document-field" id="password" name="password" type="password" minLength={6} required /></div>
            <div className="space-y-1.5"><label className="label" htmlFor="tipo">Tipo</label><select className="document-field" id="tipo" name="tipo"><option value="user">Usuario</option><option value="master">Master</option></select></div>
          </div>
          <button className="btn-primary" type="submit">Cadastrar usuario</button>
        </form>
      ) : null}

      <section className="panel overflow-hidden">
        <div className="grid border-b border-stone-200 bg-stone-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 md:grid-cols-[1.4fr_1fr_1fr]">
          <span>Usuario</span>
          <span>Tipo</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-stone-100">
          {usuarios.length ? (
            usuarios.map((usuario) => (
              <div className="grid gap-2 px-5 py-4 text-sm md:grid-cols-[1.4fr_1fr_1fr]" key={usuario.id}>
                <div>
                  <p className="font-semibold text-brand-ink">{usuario.nome_completo || 'Sem nome'}</p>
                  <p className="text-stone-500">{usuario.email}</p>
                </div>
                <p className="text-stone-700">{usuario.tipo || 'user'}</p>
                <p className="text-stone-700">{usuario.ativo === false ? 'Inativo' : 'Ativo'}</p>
              </div>
            ))
          ) : (
            <p className="px-5 py-8 text-sm text-stone-500">
              Nenhum perfil encontrado. O primeiro acesso pode ser sincronizado no Supabase.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
