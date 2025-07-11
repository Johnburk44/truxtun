-- Enable the necessary extensions
create extension if not exists "vector" with schema "public";

-- Create knowledge_base table
create table if not exists "public"."knowledge_base" (
    "id" uuid default gen_random_uuid() primary key,
    "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "updated_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "title" text not null,
    "type" text not null check ("type" in ('company_info', 'product_docs', 'customer_profiles')),
    "content" text,
    "fileName" text not null,
    "fileType" text not null,
    "fileSize" bigint not null,
    "uploadedBy" text not null,
    "processingStatus" text not null,
    "error" text,
    "embedding" vector(1536)
);

-- Add check constraint separately
alter table "public"."knowledge_base"
    add constraint "valid_processing_status"
    check ("processingStatus" in ('pending', 'processing', 'completed', 'failed'));

-- Create transcripts table
create table if not exists "public"."transcripts" (
    "id" uuid default gen_random_uuid() primary key,
    "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "updated_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "dealId" text not null,
    "repId" text not null,
    "stage" text not null,
    "fileName" text not null,
    "fileType" text not null,
    "fileSize" bigint not null,
    "uploadedBy" text not null,
    "processingStatus" text not null,
    "error" text,
    "embedding" vector(1536)
);

-- Add check constraint separately
alter table "public"."transcripts"
    add constraint "valid_transcript_processing_status"
    check ("processingStatus" in ('pending', 'processing', 'completed', 'failed'));

-- Create storage buckets
insert into storage.buckets (id, name)
values ('knowledge-base', 'knowledge-base')
on conflict do nothing;

insert into storage.buckets (id, name)
values ('transcripts', 'transcripts')
on conflict do nothing;

-- Set up storage policies
create policy "Allow public read of knowledge-base"
on storage.objects for select
using ( bucket_id = 'knowledge-base' );

create policy "Allow authenticated users to upload knowledge-base"
on storage.objects for insert
with check ( bucket_id = 'knowledge-base' );

create policy "Allow public read of transcripts"
on storage.objects for select
using ( bucket_id = 'transcripts' );

create policy "Allow authenticated users to upload transcripts"
on storage.objects for insert
with check ( bucket_id = 'transcripts' );

-- Create RLS policies
alter table "public"."knowledge_base" enable row level security;
alter table "public"."transcripts" enable row level security;

create policy "Allow public to read knowledge_base"
on "public"."knowledge_base"
for select
to authenticated
using ( true );

create policy "Allow public to insert knowledge_base"
on "public"."knowledge_base"
for insert
to authenticated
with check ( true );

create policy "Allow public to read transcripts"
on "public"."transcripts"
for select
to authenticated
using ( true );

create policy "Allow public to insert transcripts"
on "public"."transcripts"
for insert
to authenticated
with check ( true );

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security definer;

-- Create triggers for updated_at
create trigger handle_knowledge_base_updated_at
    before update on public.knowledge_base
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_transcripts_updated_at
    before update on public.transcripts
    for each row
    execute procedure public.handle_updated_at();
