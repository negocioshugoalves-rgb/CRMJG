# CRM JG Represent

Projeto Next.js pronto para GitHub e Vercel, com Supabase Auth, dashboard protegido e telas iniciais para empresas, diagnosticos, propostas, interacoes, usuarios, configuracoes e ajuda.

## Requisitos

- Node.js 20 ou superior
- Conta/projeto no Supabase
- Conta na Vercel

## Configuracao local

1. Instale as dependencias:

```bash
npm install
```

2. Copie o arquivo de ambiente:

```bash
cp .env.example .env.local
```

3. Preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

4. No Supabase, abra o SQL Editor e execute:

```text
supabase/schema.sql
```

5. Rode o projeto:

```bash
npm run dev
```

## Deploy na Vercel

1. Suba esta pasta para um repositorio no GitHub.
2. Importe o repositorio na Vercel.
3. Configure as variaveis de ambiente:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

4. Use as configuracoes padrao da Vercel:

- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

## Rotas principais

- `/login`
- `/dashboard`
- `/dashboard/empresas`
- `/dashboard/diagnosticos`
- `/dashboard/propostas`
- `/dashboard/interacoes`
- `/dashboard/usuarios`
- `/dashboard/configuracoes`
- `/dashboard/ajuda`
- `/api/health`

## Observacoes

O primeiro usuario pode ser criado pela tela de login em "Criar acesso". Se a confirmacao de e-mail estiver ativa no Supabase, confirme o e-mail antes de entrar.
