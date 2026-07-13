create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'status_funil') then
    create type status_funil as enum (
      'prospeccao',
      'diagnostico',
      'proposta',
      'fechado_ganho',
      'fechado_perdido'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'setor_diagnostico') then
    create type setor_diagnostico as enum (
      'comunicacao',
      'administrativo_rh',
      'lideranca',
      'imagem_pessoal',
      'comercial',
      'qualidade'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'status_proposta') then
    create type status_proposta as enum (
      'em_elaboracao',
      'enviada',
      'em_negociacao',
      'aceita',
      'recusada'
    );
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
  parecer text not null,
  pontos_fortes text,
  pontos_fracos text,
  recomendacoes text,
  avaliado_em timestamptz not null default now(),
  avaliado_por uuid references auth.users(id),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.propostas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  titulo text not null,
  descricao text,
  valor numeric(12, 2),
  status status_proposta not null default 'em_elaboracao',
  data_envio date,
  data_validade date,
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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists empresas_set_updated_at on public.empresas;
create trigger empresas_set_updated_at
before update on public.empresas
for each row execute function public.set_updated_at();

drop trigger if exists diagnosticos_set_updated_at on public.diagnosticos;
create trigger diagnosticos_set_updated_at
before update on public.diagnosticos
for each row execute function public.set_updated_at();

drop trigger if exists propostas_set_updated_at on public.propostas;
create trigger propostas_set_updated_at
before update on public.propostas
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.usuarios (id, email, nome_completo)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'nome_completo', split_part(coalesce(new.email, ''), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.usuarios enable row level security;
alter table public.empresas enable row level security;
alter table public.diagnosticos enable row level security;
alter table public.propostas enable row level security;
alter table public.interacoes enable row level security;

drop policy if exists "Usuarios autenticados leem usuarios" on public.usuarios;
create policy "Usuarios autenticados leem usuarios"
on public.usuarios for select
to authenticated
using (true);

drop policy if exists "Usuario atual atualiza proprio perfil" on public.usuarios;
create policy "Usuario atual atualiza proprio perfil"
on public.usuarios for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Usuarios autenticados leem empresas" on public.empresas;
create policy "Usuarios autenticados leem empresas"
on public.empresas for select
to authenticated
using (true);

drop policy if exists "Usuarios autenticados criam empresas" on public.empresas;
create policy "Usuarios autenticados criam empresas"
on public.empresas for insert
to authenticated
with check (auth.uid() = criado_por);

drop policy if exists "Usuarios autenticados atualizam empresas" on public.empresas;
create policy "Usuarios autenticados atualizam empresas"
on public.empresas for update
to authenticated
using (true)
with check (true);

drop policy if exists "Usuarios autenticados leem diagnosticos" on public.diagnosticos;
create policy "Usuarios autenticados leem diagnosticos"
on public.diagnosticos for select
to authenticated
using (true);

drop policy if exists "Usuarios autenticados criam diagnosticos" on public.diagnosticos;
create policy "Usuarios autenticados criam diagnosticos"
on public.diagnosticos for insert
to authenticated
with check (auth.uid() = avaliado_por);

drop policy if exists "Usuarios autenticados leem propostas" on public.propostas;
create policy "Usuarios autenticados leem propostas"
on public.propostas for select
to authenticated
using (true);

drop policy if exists "Usuarios autenticados criam propostas" on public.propostas;
create policy "Usuarios autenticados criam propostas"
on public.propostas for insert
to authenticated
with check (auth.uid() = criado_por);

drop policy if exists "Usuarios autenticados leem interacoes" on public.interacoes;
create policy "Usuarios autenticados leem interacoes"
on public.interacoes for select
to authenticated
using (true);

drop policy if exists "Usuarios autenticados criam interacoes" on public.interacoes;
create policy "Usuarios autenticados criam interacoes"
on public.interacoes for insert
to authenticated
with check (auth.uid() = criado_por);
