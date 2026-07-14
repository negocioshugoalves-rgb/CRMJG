create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'status_funil') then
    create type status_funil as enum ('prospeccao','diagnostico','proposta','fechado_ganho','fechado_perdido');
  end if;
  if not exists (select 1 from pg_type where typname = 'setor_diagnostico') then
    create type setor_diagnostico as enum ('comunicacao','financeiro','administrativo_rh','lideranca','processos','marketing','operacional','imagem_pessoal','comercial','qualidade');
  end if;
  if not exists (select 1 from pg_type where typname = 'prioridade') then
    create type prioridade as enum ('baixa','media','alta','critica');
  end if;
  if not exists (select 1 from pg_type where typname = 'status_acao') then
    create type status_acao as enum ('planejada','em_andamento','concluida','pausada');
  end if;
  if not exists (select 1 from pg_type where typname = 'status_proposta') then
    create type status_proposta as enum ('em_elaboracao','enviada','em_negociacao','aceita','recusada');
  end if;
  if not exists (select 1 from pg_type where typname = 'status_projeto') then
    create type status_projeto as enum ('ativo','pausado','concluido','cancelado');
  end if;
end $$;

create table if not exists public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nome_completo text,
  tipo text not null default 'user',
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create table if not exists public.configuracoes_empresa (
  id integer primary key default 1 check (id = 1),
  nome_fantasia text,
  razao_social text,
  cnpj text,
  endereco text,
  cidade_estado text,
  telefone text,
  email text,
  site text,
  responsavel text,
  cargo_responsavel text,
  logo_url text,
  descricao text,
  atualizado_por uuid references auth.users(id),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.empresas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text not null,
  segmento text not null,
  porte text,
  contato_nome text not null,
  contato_telefone text,
  contato_email text,
  origem_prospeccao text,
  status_funil status_funil not null default 'prospeccao',
  observacoes text,
  criado_por uuid references auth.users(id),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.diagnosticos (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  setor setor_diagnostico not null,
  situacao_atual text,
  problemas_identificados text,
  parecer text not null,
  pontos_fortes text,
  pontos_fracos text,
  recomendacoes text,
  prioridade prioridade not null default 'media',
  avaliado_em timestamptz not null default now(),
  avaliado_por uuid references auth.users(id),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.planos_acao (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  diagnostico_id uuid references public.diagnosticos(id) on delete set null,
  setor setor_diagnostico not null,
  titulo text not null,
  descricao text not null,
  justificativa text,
  responsavel text,
  prazo date,
  prioridade prioridade not null default 'media',
  status status_acao not null default 'planejada',
  resultado_esperado text,
  ordem integer not null default 1,
  criado_por uuid references auth.users(id),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.propostas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  titulo text not null,
  resumo_diagnostico text,
  descricao text,
  metodologia text,
  cronograma text,
  condicoes_comerciais text,
  valor numeric(12, 2),
  status status_proposta not null default 'em_elaboracao',
  data_envio date,
  data_validade date,
  criado_por uuid references auth.users(id),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.projetos (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  proposta_id uuid references public.propostas(id) on delete set null,
  nome text not null,
  objetivo text,
  status status_projeto not null default 'ativo',
  data_inicio date,
  data_fim_prevista date,
  criado_por uuid references auth.users(id),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.indicadores (
  id uuid primary key default gen_random_uuid(),
  projeto_id uuid not null references public.projetos(id) on delete cascade,
  nome text not null,
  area setor_diagnostico,
  valor_inicial numeric(12, 2),
  meta numeric(12, 2),
  valor_atual numeric(12, 2),
  unidade text,
  criado_por uuid references auth.users(id),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.relatorios (
  id uuid primary key default gen_random_uuid(),
  projeto_id uuid not null references public.projetos(id) on delete cascade,
  titulo text not null,
  periodo_inicio date,
  periodo_fim date,
  atividades_realizadas text not null,
  resultados_obtidos text,
  pontos_atencao text,
  proximos_passos text,
  criado_por uuid references auth.users(id),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.interacoes (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  tipo text not null default 'outro',
  descricao text not null,
  data timestamptz not null default now(),
  proximo_followup date,
  criado_por uuid references auth.users(id),
  criado_em timestamptz not null default now()
);


-- Compatibilidade para bancos criados com versões anteriores do CRM.
-- O "create table if not exists" não adiciona colunas novas em tabelas já existentes.
alter type status_funil add value if not exists 'prospeccao';
alter type status_funil add value if not exists 'diagnostico';
alter type status_funil add value if not exists 'proposta';
alter type status_funil add value if not exists 'fechado_ganho';
alter type status_funil add value if not exists 'fechado_perdido';
alter type setor_diagnostico add value if not exists 'comunicacao';
alter type setor_diagnostico add value if not exists 'financeiro';
alter type setor_diagnostico add value if not exists 'administrativo_rh';
alter type setor_diagnostico add value if not exists 'lideranca';
alter type setor_diagnostico add value if not exists 'processos';
alter type setor_diagnostico add value if not exists 'marketing';
alter type setor_diagnostico add value if not exists 'operacional';
alter type setor_diagnostico add value if not exists 'imagem_pessoal';
alter type setor_diagnostico add value if not exists 'comercial';
alter type setor_diagnostico add value if not exists 'qualidade';
alter type prioridade add value if not exists 'baixa';
alter type prioridade add value if not exists 'media';
alter type prioridade add value if not exists 'alta';
alter type prioridade add value if not exists 'critica';
alter type status_acao add value if not exists 'planejada';
alter type status_acao add value if not exists 'em_andamento';
alter type status_acao add value if not exists 'concluida';
alter type status_acao add value if not exists 'pausada';
alter type status_proposta add value if not exists 'em_elaboracao';
alter type status_proposta add value if not exists 'enviada';
alter type status_proposta add value if not exists 'em_negociacao';
alter type status_proposta add value if not exists 'aceita';
alter type status_proposta add value if not exists 'recusada';
alter type status_projeto add value if not exists 'ativo';
alter type status_projeto add value if not exists 'pausado';
alter type status_projeto add value if not exists 'concluido';
alter type status_projeto add value if not exists 'cancelado';

alter table public.configuracoes_empresa add column if not exists cor_primaria text not null default '#1f2933';
alter table public.configuracoes_empresa add column if not exists cor_secundaria text not null default '#9a6a2f';
alter table public.configuracoes_empresa add column if not exists cor_destaque text not null default '#d9b46c';

alter table public.usuarios add column if not exists email text;
alter table public.usuarios add column if not exists nome_completo text;
alter table public.usuarios add column if not exists tipo text not null default 'user';
alter table public.usuarios add column if not exists ativo boolean not null default true;
alter table public.usuarios add column if not exists criado_em timestamptz not null default now();
alter table public.usuarios add column if not exists atualizado_em timestamptz not null default now();

alter table public.empresas add column if not exists porte text;
alter table public.empresas add column if not exists contato_telefone text;
alter table public.empresas add column if not exists contato_email text;
alter table public.empresas add column if not exists origem_prospeccao text;
alter table public.empresas add column if not exists status_funil status_funil not null default 'prospeccao';
alter table public.empresas add column if not exists observacoes text;
alter table public.empresas add column if not exists criado_por uuid references auth.users(id);
alter table public.empresas add column if not exists atualizado_em timestamptz not null default now();

alter table public.diagnosticos add column if not exists situacao_atual text;
alter table public.diagnosticos add column if not exists problemas_identificados text;
alter table public.diagnosticos add column if not exists pontos_fortes text;
alter table public.diagnosticos add column if not exists pontos_fracos text;
alter table public.diagnosticos add column if not exists recomendacoes text;
alter table public.diagnosticos add column if not exists prioridade prioridade not null default 'media';
alter table public.diagnosticos add column if not exists avaliado_em timestamptz not null default now();
alter table public.diagnosticos add column if not exists avaliado_por uuid references auth.users(id);
alter table public.diagnosticos add column if not exists atualizado_em timestamptz not null default now();

alter table public.planos_acao add column if not exists diagnostico_id uuid references public.diagnosticos(id) on delete set null;
alter table public.planos_acao add column if not exists justificativa text;
alter table public.planos_acao add column if not exists responsavel text;
alter table public.planos_acao add column if not exists prazo date;
alter table public.planos_acao add column if not exists prioridade prioridade not null default 'media';
alter table public.planos_acao add column if not exists status status_acao not null default 'planejada';
alter table public.planos_acao add column if not exists resultado_esperado text;
alter table public.planos_acao add column if not exists ordem integer not null default 1;
alter table public.planos_acao add column if not exists criado_por uuid references auth.users(id);
alter table public.planos_acao add column if not exists atualizado_em timestamptz not null default now();

alter table public.propostas add column if not exists resumo_diagnostico text;
alter table public.propostas add column if not exists metodologia text;
alter table public.propostas add column if not exists cronograma text;
alter table public.propostas add column if not exists condicoes_comerciais text;
alter table public.propostas add column if not exists valor numeric(12, 2);
alter table public.propostas add column if not exists status status_proposta not null default 'em_elaboracao';
alter table public.propostas add column if not exists data_envio date;
alter table public.propostas add column if not exists data_validade date;
alter table public.propostas add column if not exists criado_por uuid references auth.users(id);
alter table public.propostas add column if not exists atualizado_em timestamptz not null default now();

alter table public.projetos add column if not exists proposta_id uuid references public.propostas(id) on delete set null;
alter table public.projetos add column if not exists objetivo text;
alter table public.projetos add column if not exists status status_projeto not null default 'ativo';
alter table public.projetos add column if not exists data_inicio date;
alter table public.projetos add column if not exists data_fim_prevista date;
alter table public.projetos add column if not exists criado_por uuid references auth.users(id);
alter table public.projetos add column if not exists atualizado_em timestamptz not null default now();

alter table public.indicadores add column if not exists area setor_diagnostico;
alter table public.indicadores add column if not exists valor_inicial numeric(12, 2);
alter table public.indicadores add column if not exists meta numeric(12, 2);
alter table public.indicadores add column if not exists valor_atual numeric(12, 2);
alter table public.indicadores add column if not exists unidade text;
alter table public.indicadores add column if not exists criado_por uuid references auth.users(id);
alter table public.indicadores add column if not exists atualizado_em timestamptz not null default now();

alter table public.relatorios add column if not exists periodo_inicio date;
alter table public.relatorios add column if not exists periodo_fim date;
alter table public.relatorios add column if not exists resultados_obtidos text;
alter table public.relatorios add column if not exists pontos_atencao text;
alter table public.relatorios add column if not exists proximos_passos text;
alter table public.relatorios add column if not exists criado_por uuid references auth.users(id);
alter table public.relatorios add column if not exists atualizado_em timestamptz not null default now();

alter table public.interacoes add column if not exists tipo text not null default 'outro';
alter table public.interacoes add column if not exists data timestamptz not null default now();
alter table public.interacoes add column if not exists proximo_followup date;
alter table public.interacoes add column if not exists criado_por uuid references auth.users(id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array['usuarios','configuracoes_empresa','empresas','diagnosticos','planos_acao','propostas','projetos','indicadores','relatorios'] loop
    execute format('drop trigger if exists %I on public.%I', table_name || '_set_updated_at', table_name);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', table_name || '_set_updated_at', table_name);
  end loop;
end $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_tipo text;
begin
  select case when exists (select 1 from public.usuarios) then 'user' else 'master' end into v_tipo;

  insert into public.usuarios (id, email, nome_completo, tipo)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data ->> 'nome_completo', split_part(coalesce(new.email, ''), '@', 1)), v_tipo)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
with primeiro_usuario as (
  select id from public.usuarios order by criado_em asc limit 1
)
update public.usuarios
set tipo = 'master'
where id in (select id from primeiro_usuario)
  and tipo <> 'master';

alter table public.usuarios enable row level security;
alter table public.configuracoes_empresa enable row level security;
alter table public.empresas enable row level security;
alter table public.diagnosticos enable row level security;
alter table public.planos_acao enable row level security;
alter table public.propostas enable row level security;
alter table public.projetos enable row level security;
alter table public.indicadores enable row level security;
alter table public.relatorios enable row level security;
alter table public.interacoes enable row level security;

do $$
declare t text;
begin
  foreach t in array array['empresas','diagnosticos','planos_acao','propostas','projetos','indicadores','relatorios','interacoes'] loop
    execute format('drop policy if exists "Usuarios autenticados leem %s" on public.%I', t, t);
    execute format('create policy "Usuarios autenticados leem %s" on public.%I for select to authenticated using (true)', t, t);
  end loop;
end $$;


drop policy if exists "Usuarios autenticados leem configuracoes_empresa" on public.configuracoes_empresa;
create policy "Usuarios autenticados leem configuracoes_empresa" on public.configuracoes_empresa for select to authenticated using (true);

drop policy if exists "Usuarios autenticados inserem configuracoes_empresa" on public.configuracoes_empresa;
create policy "Usuarios autenticados inserem configuracoes_empresa" on public.configuracoes_empresa for insert to authenticated with check (true);

drop policy if exists "Usuarios autenticados atualizam configuracoes_empresa" on public.configuracoes_empresa;
create policy "Usuarios autenticados atualizam configuracoes_empresa" on public.configuracoes_empresa for update to authenticated using (true) with check (true);
drop policy if exists "Usuarios autenticados leem usuarios" on public.usuarios;
create policy "Usuarios autenticados leem usuarios" on public.usuarios for select to authenticated using (true);

drop policy if exists "Usuario atual atualiza proprio perfil" on public.usuarios;
create policy "Usuario atual atualiza proprio perfil" on public.usuarios for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Usuarios autenticados criam empresas" on public.empresas;
create policy "Usuarios autenticados criam empresas" on public.empresas for insert to authenticated with check (auth.uid() = criado_por);

drop policy if exists "Usuarios autenticados atualizam empresas" on public.empresas;
create policy "Usuarios autenticados atualizam empresas" on public.empresas for update to authenticated using (true) with check (true);

drop policy if exists "Usuarios autenticados criam diagnosticos" on public.diagnosticos;
create policy "Usuarios autenticados criam diagnosticos" on public.diagnosticos for insert to authenticated with check (auth.uid() = avaliado_por);

drop policy if exists "Usuarios autenticados criam planos" on public.planos_acao;
create policy "Usuarios autenticados criam planos" on public.planos_acao for insert to authenticated with check (auth.uid() = criado_por);

drop policy if exists "Usuarios autenticados criam propostas" on public.propostas;
create policy "Usuarios autenticados criam propostas" on public.propostas for insert to authenticated with check (auth.uid() = criado_por);

drop policy if exists "Usuarios autenticados criam projetos" on public.projetos;
create policy "Usuarios autenticados criam projetos" on public.projetos for insert to authenticated with check (auth.uid() = criado_por);

drop policy if exists "Usuarios autenticados atualizam seus projetos" on public.projetos;
create policy "Usuarios autenticados atualizam seus projetos" on public.projetos for update to authenticated using (auth.uid() = criado_por) with check (auth.uid() = criado_por);

drop policy if exists "Usuarios autenticados criam indicadores" on public.indicadores;
create policy "Usuarios autenticados criam indicadores" on public.indicadores for insert to authenticated with check (auth.uid() = criado_por);

drop policy if exists "Usuarios autenticados atualizam indicadores" on public.indicadores;
create policy "Usuarios autenticados atualizam indicadores" on public.indicadores for update to authenticated using (true) with check (true);

drop policy if exists "Usuarios autenticados criam relatorios" on public.relatorios;
create policy "Usuarios autenticados criam relatorios" on public.relatorios for insert to authenticated with check (auth.uid() = criado_por);

drop policy if exists "Usuarios autenticados criam interacoes" on public.interacoes;
create policy "Usuarios autenticados criam interacoes" on public.interacoes for insert to authenticated with check (auth.uid() = criado_por);






