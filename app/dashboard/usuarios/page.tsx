import { PageHeader } from '@/components/page-header'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface Usuario {
  id: string
  email: string
  nome_completo: string | null
  tipo: string | null
  ativo: boolean | null
}

export default async function UsuariosPage() {
  const supabase = createClient()
  const { data } = await supabase.from('usuarios').select('*').order('criado_em')
  const usuarios = (data ?? []) as Usuario[]

  return (
    <>
      <PageHeader
        title="Usuarios"
        description="Visualize usuarios cadastrados no CRM. As permissoes podem ser evoluidas pelo perfil master."
      />

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
