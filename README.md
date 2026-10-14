# Todo List (React + Spring Boot + Supabase)

```
.
├── supabase/schema.sql          # 테이블 생성 SQL
├── backend/                     # Spring Boot 3.4 · Java 17 · Gradle · JPA  → Render
│   ├── Dockerfile
│   └── src/main/java/com/example/todo/
│       ├── entity/Schedule.java
│       ├── repository/ScheduleRepository.java
│       ├── service/ScheduleService.java
│       ├── controller/ScheduleController.java   # GET/POST /api/schedules
│       ├── controller/HealthController.java     # GET /health
│       ├── config/WebConfig.java                # CORS
│       └── exception/GlobalExceptionHandler.java
└── frontend/                    # React 18 · Vite 5 · Axios  → Vercel
    └── src/
        ├── api/scheduleApi.js
        ├── components/ScheduleForm.jsx          # 입력창 + 등록/취소
        ├── components/ScheduleList.jsx          # 목록 렌더링
        └── App.jsx
```

## API

| Method | Path | Body | 응답 |
|---|---|---|---|
| GET | `/api/schedules` | – | `200` `[{ id, content, createdAt }]` (최신순) |
| POST | `/api/schedules` | `{ "content": "..." }` | `201` `{ id, content, createdAt }` / `400` `{ message }` |

---

## 1. Supabase 준비

1. [supabase.com](https://supabase.com)에서 프로젝트를 생성합니다. **Database Password는 따로 저장**해 두세요.
2. 대시보드 **SQL Editor**에서 `supabase/schema.sql` 내용을 붙여 넣고 실행합니다.
3. 상단 **Connect** 버튼 → **Session pooler** 항목에서 접속 정보를 확인합니다.
   - Host: `aws-0-<region>.pooler.supabase.com`, Port: `5432`
   - User: `postgres.<project-ref>`
   - 이를 JDBC 형식으로 바꿉니다:
     `jdbc:postgresql://aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require`

> **왜 Session pooler인가?** Direct connection(`db.<ref>.supabase.co`)은 IPv6 전용이라 Render 같은 IPv4 환경에서 접속이 안 됩니다.
> Transaction pooler(포트 `6543`)를 쓸 경우 PreparedStatement 충돌을 막기 위해 URL 끝에 `&prepareThreshold=0`을 붙여야 합니다.

## 2. 로컬 실행

### 백엔드 (JDK 17 필요)

```powershell
cd backend
$env:DB_URL="jdbc:postgresql://aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require"
$env:DB_USERNAME="postgres.your-project-ref"
$env:DB_PASSWORD="your-database-password"
.\gradlew.bat bootRun
```

macOS/Linux는 `export DB_URL=...` 후 `./gradlew bootRun`.
IntelliJ에서는 Run Configuration → Environment variables에 같은 값을 넣으면 됩니다.

확인: `http://localhost:8080/health` → `{"status":"UP"}`, `http://localhost:8080/api/schedules` → `[]`

### 프론트엔드 (Node 18+)

```powershell
cd frontend
copy .env.example .env.local     # VITE_API_BASE_URL=http://localhost:8080
npm install
npm run dev
```

`http://localhost:5173` 접속 → 일정 입력 후 **등록** → 목록 갱신, **취소** → 입력창 초기화.

---

## 3. 백엔드 배포 (Render)

1. 프로젝트를 GitHub에 push 합니다. (`.env`, `.env.local`은 `.gitignore`에 포함되어 있음)
2. Render → **New → Web Service** → 저장소 연결
3. 설정
   - **Root Directory**: `backend`
   - **Runtime / Language**: `Docker` (Render는 Java 네이티브 런타임이 없으므로 `backend/Dockerfile` 사용)
   - **Health Check Path**: `/health`
4. **Environment Variables**

   | Key | Value |
   |---|---|
   | `DB_URL` | `jdbc:postgresql://aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require` |
   | `DB_USERNAME` | `postgres.<project-ref>` |
   | `DB_PASSWORD` | Supabase DB 비밀번호 |
   | `CORS_ALLOWED_ORIGINS` | `https://<your-app>.vercel.app` (Vercel 배포 후 입력) |

5. 배포 완료 후 `https://<service>.onrender.com/health` 응답을 확인합니다.

**유의사항**
- `PORT`는 Render가 자동 주입하며, `application.yml`의 `server.port: ${PORT:8080}`이 이를 사용합니다.
- **무료 플랜은 15분간 요청이 없으면 슬립**합니다. 다음 첫 요청은 30~60초 걸릴 수 있습니다(프론트 Axios timeout을 60초로 설정해 둔 이유).
- 무료 인스턴스 메모리는 512MB입니다. Dockerfile에서 `-XX:MaxRAMPercentage=75`로 힙을 제한했습니다.
- `ddl-auto: validate`이므로 **테이블을 먼저 만들지 않으면 기동에 실패**합니다. 로그에 `Schema-validation: missing table [schedules]`가 보이면 1단계 SQL을 확인하세요.
- Supabase 무료 프로젝트는 일정 기간 비활성 시 **일시 정지**될 수 있습니다. 접속 오류 시 대시보드에서 Restore 하세요.

## 4. 프론트엔드 배포 (Vercel)

1. Vercel → **Add New → Project** → 같은 GitHub 저장소 import
2. 설정
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite` (Build: `npm run build`, Output: `dist` 자동 인식)
3. **Environment Variables**
   - `VITE_API_BASE_URL` = `https://<service>.onrender.com` (끝에 `/` 붙이지 않기)
4. Deploy → 발급된 도메인(`https://<your-app>.vercel.app`)을 Render의 `CORS_ALLOWED_ORIGINS`에 넣고 Render를 재배포합니다.

**유의사항**
- `VITE_` 환경변수는 **빌드 시점에 번들에 박힙니다**. 값을 바꾸면 Vercel에서 **Redeploy** 해야 반영됩니다. (같은 이유로 비밀값을 `VITE_` 변수에 넣으면 안 됩니다.)
- Vercel Preview 배포(PR마다 생성되는 도메인)도 허용하려면 패턴을 추가하세요:
  `CORS_ALLOWED_ORIGINS=https://my-todo.vercel.app,https://my-todo-*.vercel.app`
- Origin은 **스킴 포함, 끝 슬래시 없이** 정확히 입력해야 합니다. (`https://my-todo.vercel.app` ✅ / `my-todo.vercel.app/` ❌)
- 브라우저 콘솔에 `CORS policy` 에러가 보이면 대부분 Render의 `CORS_ALLOWED_ORIGINS` 값 불일치이거나, Render가 슬립에서 깨어나는 중 오류가 난 경우입니다.

## 배포 순서 요약

1. Supabase 테이블 생성 → 2. Render 배포 (CORS는 임시로 `http://localhost:5173`) → 3. Vercel 배포 (`VITE_API_BASE_URL`에 Render URL) → 4. Render의 `CORS_ALLOWED_ORIGINS`를 Vercel 도메인으로 수정 후 재배포
