# KOLA

KOLA is a credit-scoring platform for Nigeria's Ajo groups. It uses Squad virtual accounts and verified payment events to turn informal contribution history into a lender-readable credit profile.

## Services

| Service | Stack | Purpose |
| --- | --- | --- |
| `kola_frontend` | Next.js, Tailwind, TypeScript | Group onboarding and lender dashboard |
| `kola_backend` | FastAPI, SQLAlchemy, Postgres | Squad integration, group/member APIs, score APIs |
| `kola_ai` | FastAPI, XGBoost | AI scoring and explainability |

## Backend Local Development

```bash
cd kola_backend
cp .env.example .env
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

Interactive docs: `http://localhost:8001/docs`

## Frontend Local Development

```bash
cd kola_frontend
cp .env.example .env.local
npm install
npm run dev
```

Set these server-side frontend variables:

```env
KOLA_BACKEND_URL=http://localhost:8001
KOLA_BACKEND_API_KEY=replace_with_a_strong_internal_api_key
```

## Backend Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `SUPABASE_DATABASE_URL` | Yes | Postgres connection string |
| `SQUAD_SECRET_KEY` | Yes | Squad secret key |
| `SQUAD_PUBLIC_KEY` | Yes | Squad public key |
| `SQUAD_BASE_URL` | Yes | `https://sandbox-api-d.squadco.com` for sandbox |
| `SQUAD_BENEFICIARY_ACCOUNT` | Required for real Squad VA creation | Settlement beneficiary account number |
| `SQUAD_MOCK_MODE` | No | Set `true` to generate mock virtual accounts locally |
| `API_KEY` | Yes | Internal API key expected in `x-api-key` |
| `BACKEND_CORS_ORIGINS` | Yes | Comma-separated allowed frontend origins |
| `KOLA_AI_URL` | No | AI service URL. Backend falls back to deterministic scoring if unset |
| `KOLA_AI_KEY` | No | API key for the AI service |

## Squad Integration

The backend currently wires:

- `POST /api/groups/` to create groups and Squad virtual accounts.
- `POST /api/webhooks/squad` to verify signed Squad webhooks and store economic events.
- `GET /api/scores/{member_id}` and `GET /api/scores/trader/{phone_or_id}` to return lender-facing scores.
- `GET /api/squad/config` to inspect safe Squad configuration status.

For sandbox virtual account creation, Squad requires a beneficiary account. Provide it as `SQUAD_BENEFICIARY_ACCOUNT` in Render, or send `beneficiary_account` in the group creation payload.

## Docker / Render Deployment

The repo includes Docker support at the root and inside `kola_backend`.

For Render, deploy the backend from the repository using Docker. The backend service configuration lives at:

```text
kola_backend/render.yaml
```

If Render is looking for `Dockerfile` at the repository root, use the root `Dockerfile`. If the Render service root directory is `kola_backend`, use `kola_backend/Dockerfile`.

## API Examples

Create a group:

```bash
curl -X POST "$KOLA_BACKEND_URL/api/groups/" \
  -H "x-api-key: $KOLA_BACKEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Balogun Market Ajo",
    "description": "Weekly trader contribution group",
    "contribution_amount": "5000.00",
    "contribution_frequency": "weekly",
    "beneficiary_account": "0123456789",
    "members": [
      {
        "full_name": "Amina Bello",
        "phone": "08012345674",
        "email": "amina@example.com",
        "middle_name": "Ngozi",
        "bvn": "22343211653",
        "dob": "07/19/1990",
        "gender": "2",
        "address": "22 Broad Street, Lagos"
      }
    ]
  }'
```

Query a trader score:

```bash
curl "$KOLA_BACKEND_URL/api/scores/trader/08012345674" \
  -H "x-api-key: $KOLA_BACKEND_API_KEY"
```

## Team

- Product / Pitch: Peculiar
- Backend / Squad Integration: Yasir
- AI / ML: David
- Frontend / Demo: Progress
