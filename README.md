# CRM JG Represent

Projeto Next.js pronto para GitHub e Vercel para uma consultoria empresarial. O fluxo principal cobre cliente, diagnostico empresarial, plano de acao, proposta em PDF, projeto aceito e relatorios de acompanhamento com indicadores.

## Fluxo do sistema

1. Cadastro da empresa cliente.
2. Diagnostico por areas da empresa: comercial, financeiro, RH, lideranca, processos, marketing, operacional, comunicacao, imagem pessoal e qualidade.
3. Plano de acao com o que sera feito, justificativa, responsavel, prazo, prioridade e resultado esperado.
4. Proposta comercial com resumo do diagnostico, escopo, metodologia, cronograma, investimento e condicoes.
5. Exportacao da proposta em PDF pela pagina de impressao.
6. Projeto ativo apos aceite da proposta.
7. Relatorios de andamento com atividades, resultados, pontos de atencao, proximos passos e indicadores.

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
- `/dashboard/planos-acao`
- `/dashboard/propostas`
- `/dashboard/propostas/[id]/pdf`
- `/dashboard/projetos`
- `/dashboard/relatorios`
- `/dashboard/interacoes`
- `/dashboard/usuarios`
- `/dashboard/configuracoes`
- `/dashboard/ajuda`
- `/api/health`

## Observacoes

O primeiro usuario pode ser criado pela tela de login em "Criar acesso". Se a confirmacao de e-mail estiver ativa no Supabase, confirme o e-mail antes de entrar.
