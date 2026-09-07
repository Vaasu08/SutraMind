const API_BASE_URL = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export type ApiEnvelope<T> = { data: T; meta?: Record<string, unknown> };

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function request<T>(path: string, token?: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(response.status, body.detail ?? "The request could not be completed.");
  return body.data as T;
}

export const api = {
  login: (email: string, password: string) => request<LoginResponse>("/auth/login", undefined, { method: "POST", body: JSON.stringify({ email, password }) }),
  me: (token: string) => request<CurrentUser>("/auth/me", token),
  studies: (token: string) => request<Study[]>("/studies", token),
  study: (token: string, id: string) => request<Study>(`/studies/${id}`, token),
  createStudy: (token: string, payload: unknown) => request<Study>("/studies", token, { method: "POST", body: JSON.stringify(payload) }),
  updateStudy: (token: string, id: string, payload: unknown) => request<Study>(`/studies/${id}`, token, { method: "PATCH", body: JSON.stringify(payload) }),
  terms: (token: string) => request<MasterTerm[]>("/master-terms", token),
  createTerm: (token: string, payload: unknown) => request<MasterTerm>("/master-terms", token, { method: "POST", body: JSON.stringify(payload) }),
  updateTerm: (token: string, id: string, payload: unknown) => request<MasterTerm>(`/master-terms/${id}`, token, { method: "PATCH", body: JSON.stringify(payload) }),
  medicines: (token: string) => request<Medicine[]>("/medicines", token),
  participants: (token: string, studyId?: string) => request<Participant[]>(`/participants${studyId ? `?study_id=${studyId}` : ""}`, token),
  participant: (token: string, id: string) => request<Participant>(`/participants/${id}`, token),
  createParticipant: (token: string, payload: unknown) => request<Participant>("/participants", token, { method: "POST", body: JSON.stringify(payload) }),
  updateParticipant: (token: string, id: string, payload: unknown) => request<Participant>(`/participants/${id}`, token, { method: "PATCH", body: JSON.stringify(payload) }),
  createVisit: (token: string, payload: unknown) => request<Visit>("/visits", token, { method: "POST", body: JSON.stringify(payload) }),
  updateVisit: (token: string, id: string, payload: unknown) => request<Visit>(`/visits/${id}`, token, { method: "PATCH", body: JSON.stringify(payload) }),
  crf: (token: string, visitId: string) => request<CRF>(`/crfs/by-visit/${visitId}`, token),
  createCrf: (token: string, payload: unknown) => request<CRF>("/crfs", token, { method: "POST", body: JSON.stringify(payload) }),
  updateCrf: (token: string, id: string, payload: unknown) => request<CRF>(`/crfs/${id}`, token, { method: "PATCH", body: JSON.stringify(payload) }),
  queries: (token: string, studyId?: string) => request<DataQuery[]>(`/queries${studyId ? `?study_id=${studyId}` : ""}`, token),
  createQuery: (token: string, payload: unknown) => request<DataQuery>("/queries", token, { method: "POST", body: JSON.stringify(payload) }),
  updateQuery: (token: string, id: string, payload: unknown) => request<DataQuery>(`/queries/${id}`, token, { method: "PATCH", body: JSON.stringify(payload) }),
  dashboard: (token: string, studyId?: string) => request<Dashboard>(`/dashboard/overview${studyId ? `?study_id=${studyId}` : ""}`, token),
  updateEthics: (token: string, studyId: string, payload: unknown) => request<Ethics>(`/ethics/${studyId}`, token, { method: "PATCH", body: JSON.stringify(payload) }),
  createUser: (token: string, payload: unknown) => request<User>("/users", token, { method: "POST", body: JSON.stringify(payload) })
};

export type Role = "ADMIN" | "PI" | "COORDINATOR" | "MONITOR" | "ETHICS" | "PV";
export type User = { id: string; name: string; email: string; role: Role; is_active: boolean };
export type CurrentUser = User & { study_ids: string[]; memberships: { study_id: string; site_id: string | null; role_in_study: Role }[] };
export type LoginResponse = { access_token: string; token_type: string; user: User };
export type MasterTerm = { id: string; category: string; code: string; label_en: string; label_hi: string; modern_mapping_en?: string | null; active: boolean; sort_order: number };
export type Medicine = { id: string; medicine_code: string; ayurveda_name: string; dosage_form_code: string; is_active: boolean };
export type Site = { id: string; study_id: string; site_code: string; name: string; address?: string | null; is_active: boolean };
export type Protocol = { id: string; version: string; modern_diagnosis: string; vyadhi_code: string; intervention_name: string; medicine_id?: string | null; dosage_form_code: string; anupana_code: string; treatment_duration_days: number; summary?: string | null };
export type Ethics = { id: string; study_id: string; iec_number: string; status: string; approval_date?: string | null; expiry_date?: string | null; remarks?: string | null };
export type Study = { id: string; study_code: string; title: string; short_title?: string | null; pi_id: string; institution: string; trial_phase?: string | null; sample_size: number; start_date: string; end_date: string; status: string; ctri_number?: string | null; participant_count: number; protocol?: Protocol | null; ethics?: Ethics | null; sites?: Site[] };
export type Baseline = { id: string; prakriti_code: string; vikriti_notes?: string | null; agni_code: string; bala_code: string; satva_code: string };
export type Visit = { id: string; participant_id: string; visit_number: number; visit_date?: string | null; scheduled_date?: string | null; next_visit_date?: string | null; status: string; investigator_id?: string | null; crf_id?: string | null; crf_completion_status?: string | null };
export type Participant = { id: string; participant_code: string; study_id: string; site_id: string; site_name?: string | null; name: string; age: number; gender: string; modern_diagnosis: string; vyadhi_code: string; disease_duration_months?: number | null; randomization_id?: string | null; enrollment_date: string; status: string; current_visit?: number | null; baseline?: Baseline | null; visits?: Visit[]; open_query_count?: number };
export type CRF = { id: string; visit_id: string; systolic_bp?: number | null; diastolic_bp?: number | null; pulse_bpm?: number | null; weight_kg?: number | null; temperature_c?: number | null; agni_code?: string | null; bala_code?: string | null; symptoms?: string | null; medicine_id?: string | null; dose?: string | null; frequency?: string | null; compliance?: string | null; remarks?: string | null; completion_status: string };
export type DataQuery = { id: string; study_id: string; target_type: string; target_id: string; field_name?: string | null; message: string; status: string; raised_by_name: string; raised_at: string; answer?: string | null; answered_by_name?: string | null; answered_at?: string | null; participant_code?: string | null };
export type Dashboard = { active_studies: number; study_count: number; total_participants: number; recruitment_target: number; completed_visits: number; visit_completion_rate: number; open_queries: number; ethics_approved: number; ethics_status: string; medicine_adherence: number; prakriti_distribution: Record<string, number>; vyadhi_distribution: Record<string, number>; query_status: Record<string, number> };

