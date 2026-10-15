# Production Deployment Guide

## Target Architecture
- **Frontend & API**: Vercel (or any Node.js container / AWS ECS / Railway)
- **Database**: PostgreSQL (Supabase, Neon, AWS RDS, or Managed PostgreSQL)
- **Image Storage**: Cloudinary or AWS S3
- **AI Engine**: OpenAI API (`gpt-4o-mini` / `gpt-4o`)

---

## 1. Production Environment Variables
Set the following environment variables in your deployment dashboard:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/[DB_NAME]?sslmode=require&supa=base-pooler.x"

# NextAuth / JWT secret (minimum 32 random characters)
NEXTAUTH_SECRET="produce-a-secure-random-32-byte-hex-string-for-production"
NEXTAUTH_URL="https://your-dealership-domain.com"
NEXT_PUBLIC_APP_URL="https://your-dealership-domain.com"

# AI Configuration
OPENAI_API_KEY="sk-proj-your-production-openai-api-key"
OPENAI_MODEL="gpt-4o-mini"

# Dealership Configuration
NEXT_PUBLIC_DEFAULT_DEALERSHIP_SLUG="northstar-motors"
NODE_ENV="production"
```

---

## 2. Database Migration on Deploy
When deploying to Vercel or Railway:
1. Ensure the build command runs:
   ```bash
   prisma generate && next build
   ```
2. Execute production database push / migration:
   ```bash
   npx prisma db push
   ```
3. Populate initial dealership and staff data:
   ```bash
   node prisma/seed.js
   ```

---

## 3. Production Health Check
Verify live deployment health:
```bash
curl -I https://your-dealership-domain.com/api/health
```
Returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-10-16T00:00:00.000Z",
  "services": {
    "api": "healthy",
    "database": "healthy",
    "ai": "operational"
  },
  "responseTimeMs": 14
}
```

---

## 4. Rollback Strategy
If a rollback is required:
1. In Vercel, navigate to **Deployments** -> select the previous successful deployment -> click **Promote to Production**.
2. Prisma migrations are backwards-compatible: columns are not dropped in non-breaking releases.
