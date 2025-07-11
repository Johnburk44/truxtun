create table document_prompts (
  id uuid default gen_random_uuid() primary key,
  template_id text not null,
  template_name text not null,
  original_document_name text not null,
  original_document_type text not null,
  analysis text not null,
  generated_prompt text not null,
  custom_prompt text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index idx_document_prompts_template on document_prompts(template_id);

-- Enable Row Level Security
alter table document_prompts enable row level security;

-- Create policies
create policy "Users can view their own document prompts"
  on document_prompts for select
  using (auth.uid() = auth.uid());

create policy "Users can insert their own document prompts"
  on document_prompts for insert
  with check (auth.uid() = auth.uid());

create policy "Users can update their own document prompts"
  on document_prompts for update
  using (auth.uid() = auth.uid())
  with check (auth.uid() = auth.uid());
