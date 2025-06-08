
-- Enable RLS
alter database postgres set "app.jwt_secret" to 'your-jwt-secret';

-- Create questions table
create table public.questions (
  id bigint primary key generated always as identity,
  question_text text not null,
  choice_a text not null,
  choice_b text not null,
  choice_c text not null,
  choice_d text not null,
  correct_answer text not null check (correct_answer in ('A', 'B', 'C', 'D')),
  explanation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create exam_results table
create table public.exam_results (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) on delete cascade not null,
  score integer not null,
  total_questions integer not null,
  answers_data jsonb not null,
  question_count integer not null, -- 20 or 50
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create profiles table for additional user info
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.questions enable row level security;
alter table public.exam_results enable row level security;
alter table public.profiles enable row level security;

-- RLS Policies for questions
create policy "Anyone can view questions" on public.questions
  for select using (true);

create policy "Only admins can insert questions" on public.questions
  for insert with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

create policy "Only admins can update questions" on public.questions
  for update using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

create policy "Only admins can delete questions" on public.questions
  for delete using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- RLS Policies for exam_results
create policy "Users can view their own results" on public.exam_results
  for select using (auth.uid() = user_id);

create policy "Users can insert their own results" on public.exam_results
  for insert with check (auth.uid() = user_id);

-- RLS Policies for profiles
create policy "Users can view all profiles" on public.profiles
  for select using (true);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert some sample questions
insert into public.questions (question_text, choice_a, choice_b, choice_c, choice_d, correct_answer, explanation) values
('What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', 'C', 'Paris is the capital and most populous city of France. It has been the country''s capital since 508 AD.'),
('Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'B', 'Mars is called the Red Planet because of its reddish appearance, which comes from iron oxide (rust) on its surface.'),
('What is 2 + 2?', '3', '4', '5', '6', 'B', 'Basic arithmetic: 2 + 2 = 4. This is fundamental addition.');
