import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() || ''
  const supabase = createClient()

  if (!query) {
    return NextResponse.json({ data: [] })
  }

  const { data, error } = await supabase
    .from('empresas')
    .select('id,nome,cnpj,segmento,status_funil')
    .or(`nome.ilike.%${query}%,cnpj.ilike.%${query}%,segmento.ilike.%${query}%`)
    .limit(20)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data })
}
