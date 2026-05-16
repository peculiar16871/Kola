export interface GroupMemberPayload {
  full_name: string;
  phone: string;
  email?: string;
  middle_name?: string;
  bvn?: string;
  dob?: string;
  gender?: string;
  address?: string;
}

export interface CreateGroupPayload {
  name: string;
  description?: string;
  contribution_amount?: string;
  contribution_frequency: string;
  beneficiary_account?: string;
  members: GroupMemberPayload[];
}

export interface GroupMemberRead {
  id: string;
  group_id: string;
  full_name: string;
  phone: string;
  email: string | null;
  squad_customer_id: string | null;
  squad_va_id: string | null;
  squad_va_number: string | null;
  squad_va_bank: string | null;
  created_at: string;
}

export interface GroupRead {
  id: string;
  name: string;
  description: string | null;
  contribution_amount: string | null;
  contribution_frequency: string;
  created_at: string;
  members: GroupMemberRead[];
}

export interface ScoreRead {
  member_id: string;
  kola_score: number;
  explanation: Record<string, unknown>;
  verified_events_count: number;
  streak_weeks: number;
  last_updated: string;
  events: Array<{
    id: string;
    event_type: string;
    amount: string | null;
    currency: string;
    occurred_at: string;
    verified: boolean;
  }>;
}

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    const detail = data?.detail;
    const message = typeof detail === "string"
      ? detail
      : detail?.squad_response?.message || detail?.message || "Request failed";
    throw new Error(message);
  }
  return data as T;
}

export async function createGroup(payload: CreateGroupPayload): Promise<GroupRead> {
  const response = await fetch("/api/groups", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  return readJson<GroupRead>(response);
}

export async function getTraderScore(phoneOrId: string): Promise<ScoreRead> {
  const response = await fetch(`/api/scores/trader/${encodeURIComponent(phoneOrId)}`);
  return readJson<ScoreRead>(response);
}
