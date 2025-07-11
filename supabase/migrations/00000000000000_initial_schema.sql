-- Organizations
create table organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Users
create table users (
  id uuid primary key references auth.users on delete cascade,
  organization_id uuid references organizations(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(id, organization_id)
);

-- Knowledge Base
create table knowledge_base (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references organizations(id),
  title text not null,
  content text not null,
  type text not null, -- company_info, product_docs, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Transcripts
create table transcripts (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references organizations(id),
  deal_id text,
  rep_id text,
  stage text,
  content text not null,
  embedding vector(1536), -- Pinecone vector dimension
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Prompt Templates
create table prompt_templates (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references organizations(id),
  name text not null,
  template text not null,
  type text not null, -- map, qbr, discovery, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Custom GPT Configurations
create table custom_gpts (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references organizations(id),
  name text not null,
  model text not null,
  actions jsonb,
  prompt_logic text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table users enable row level security;
alter table knowledge_base enable row level security;
alter table transcripts enable row level security;
alter table prompt_templates enable row level security;
alter table custom_gpts enable row level security;

-- Users policy
create policy "Users can view their own data"
  on users for select
  using (auth.uid() = id);

-- Organization access policy
create policy "Users can access their organization's data"
  on organizations for select
  using (
    exists (
      select 1 from users
      where users.id = auth.uid()
      and users.organization_id = organizations.id
    )
  );

-- Knowledge Base policy
create policy "Users can access their org's knowledge base"
  on knowledge_base for all
  using (
    exists (
      select 1 from users
      where users.id = auth.uid()
      and users.organization_id = knowledge_base.organization_id
    )
  );

-- Transcripts policy
create policy "Users can access their org's transcripts"
  on transcripts for all
  using (
    exists (
      select 1 from users
      where users.id = auth.uid()
      and users.organization_id = transcripts.organization_id
    )
  );

-- Prompt Templates policy
create policy "Users can access their org's templates"
  on prompt_templates for all
  using (
    exists (
      select 1 from users
      where users.id = auth.uid()
      and users.organization_id = prompt_templates.organization_id
    )
  );

-- Custom GPTs policy
create policy "Users can access their org's custom GPTs"
  on custom_gpts for all
  using (
    exists (
      select 1 from users
      where users.id = auth.uid()
      and users.organization_id = custom_gpts.organization_id
    )
  );
