-- TOEIC 550 listening app — progress sync table.
-- Run this once in the Supabase SQL Editor of the app's own project.
-- One row per user; the whole progress object lives in `data` (same shape
-- as the localStorage key toeic550-v1, plus updatedAt). Row-level security
-- guarantees a logged-in user can only read/write their own row, even
-- though the app uses the publishable anon key in the browser.

create table if not exists public.toeic_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.toeic_progress enable row level security;

drop policy if exists "toeic_progress_select_own" on public.toeic_progress;
create policy "toeic_progress_select_own"
  on public.toeic_progress for select
  using (auth.uid() = user_id);

drop policy if exists "toeic_progress_insert_own" on public.toeic_progress;
create policy "toeic_progress_insert_own"
  on public.toeic_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "toeic_progress_update_own" on public.toeic_progress;
create policy "toeic_progress_update_own"
  on public.toeic_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "toeic_progress_delete_own" on public.toeic_progress;
create policy "toeic_progress_delete_own"
  on public.toeic_progress for delete
  using (auth.uid() = user_id);
