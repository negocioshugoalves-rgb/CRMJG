'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, LogIn, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'signup'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const [mode, setMode] = useState<Mode>('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') || '')
    const password = String(formData.get('password') || '')
    const supabase = createClient()

    const result =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    setLoading(false)

    if (result.error) {
      setMessage(result.error.message)
      return
    }

    if (mode === 'signup' && !result.data.session) {
      setMessage('Cadastro criado. Confirme o e-mail antes de entrar.')
      return
    }

    router.replace(next)
    router.refresh()
  }

  return (
    <div className="panel p-6">
      <div className="mb-5 grid grid-cols-2 rounded-md bg-stone-100 p-1">
        <button
          className={`rounded px-3 py-2 text-sm font-semibold ${
            mode === 'login' ? 'bg-white text-brand-ink shadow-sm' : 'text-stone-600'
          }`}
          type="button"
          onClick={() => setMode('login')}
        >
          Entrar
        </button>
        <button
          className={`rounded px-3 py-2 text-sm font-semibold ${
            mode === 'signup' ? 'bg-white text-brand-ink shadow-sm' : 'text-stone-600'
          }`}
          type="button"
          onClick={() => setMode('signup')}
        >
          Criar acesso
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="label" htmlFor="email">
            E-mail
          </label>
          <input className="field" id="email" name="email" type="email" required />
        </div>
        <div className="space-y-1.5">
          <label className="label" htmlFor="password">
            Senha
          </label>
          <input
            className="field"
            id="password"
            minLength={6}
            name="password"
            type="password"
            required
          />
        </div>

        {message ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {message}
          </p>
        ) : null}

        <button className="btn-primary w-full" disabled={loading} type="submit">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : mode === 'login' ? (
            <LogIn className="h-4 w-4" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          {mode === 'login' ? 'Entrar no CRM' : 'Criar acesso'}
        </button>
      </form>
    </div>
  )
}
