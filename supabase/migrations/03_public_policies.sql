-- Drop existing policies
drop policy if exists "Allow public to read knowledge_base" on "public"."knowledge_base";
drop policy if exists "Allow public to insert knowledge_base" on "public"."knowledge_base";
drop policy if exists "Allow public to read transcripts" on "public"."transcripts";
drop policy if exists "Allow public to insert transcripts" on "public"."transcripts";

-- Create new public policies
create policy "Allow public to read knowledge_base"
on "public"."knowledge_base"
for select
using ( true );

create policy "Allow public to insert knowledge_base"
on "public"."knowledge_base"
for insert
with check ( true );

create policy "Allow public to read transcripts"
on "public"."transcripts"
for select
using ( true );

create policy "Allow public to insert transcripts"
on "public"."transcripts"
for insert
with check ( true );

-- Allow public updates for both tables
create policy "Allow public to update knowledge_base"
on "public"."knowledge_base"
for update
using ( true )
with check ( true );

create policy "Allow public to update transcripts"
on "public"."transcripts"
for update
using ( true )
with check ( true );
