-- Supabase 대시보드 > SQL Editor 에서 실행하세요.
create table if not exists public.schedules (
    id          bigint generated always as identity primary key,
    content     varchar(255) not null,
    created_at  timestamptz  not null default now()
);

-- 최신 등록순 조회용 인덱스
create index if not exists idx_schedules_created_at on public.schedules (created_at desc);

-- RLS 활성화: Supabase Data API(anon key)를 통한 외부 직접 접근을 차단합니다.
-- Spring Boot 는 postgres 역할로 접속하므로 RLS 의 영향을 받지 않습니다.
alter table public.schedules enable row level security;
