# CRM JG Represent

Projeto Next.js pronto para GitHub e Vercel para uma consultoria empresarial. O fluxo principal cobre cliente, diagnóstico empresarial, plano de ação, proposta em PDF, projeto aceito e relatórios de acompanhamento com indicadores.

## Fluxo do sistema

1. Cadastro da empresa cliente.
2. Diagnóstico por áreas da empresa: comercial, financeiro, RH, liderança, processos, marketing, operacional, comunicação, imagem pessoal e qualidade.
3. Plano de ação com o que será feito, justificativa, responsável, prazo, prioridade e resultado esperado.
4. Proposta comercial com resumo do diagnóstico, escopo, metodologia, cronograma, investimento e condições.
5. Exportação da proposta em PDF pela página de impressão.
6. Projeto ativo após aceite da proposta.
7. Relatórios de andamento com atividades, resultados, pontos de atenção, próximos passos e indicadores.

## Requisitos

- Node.js 20 ou superior
- Conta/projeto no Supabase
- Conta na Vercel

## Configuração local

1. Instale as dependências:

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
SUPABASE_SERVICE_ROLE_KEY=
```

A variável `SUPABASE_SERVICE_ROLE_KEY` é usada apenas no servidor para permitir que o usuário master cadastre novos usuários.

4. No Supabase, abra o SQL Editor e execute:

```text
supabase/schema.sql
```

5. Rode o projeto:

```bash
npm run dev
```

## Deploy na Vercel

1. Suba esta pasta para um repositório no GitHub.
2. Importe o repositório na Vercel.
3. Configure as variáveis de ambiente:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

4. Use as configurações padrão da Vercel:

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

## Observações

O primeiro usuário pode ser criado pela tela de login em "Criar acesso". Se a confirmação de e-mail estiver ativa no Supabase, confirme o e-mail antes de entrar.
