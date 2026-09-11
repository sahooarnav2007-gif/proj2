import { apiFetch } from '@/lib/apiClient';
import * as mock from '@/lib/mockApi';

// Dual-mode data layer:
//   1. Try the real backend (/api/* route handlers) — live on `next dev` / Vercel.
//   2. If the server is unreachable (static host, offline LAN, airplane mode),
//      transparently fall back to the in-browser simulation (src/lib/mockApi).
// The UI calls these wrappers, so the same screen works with or without a backend.

const API_TIMEOUT_MS = 1500;

async function callApi<T>(url: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    return await apiFetch<T>(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export type {
  AnalyticsParams,
  AnalyticsResponse,
  ConsentInput,
  ConsentResponse,
  TelemetryInput,
  TelemetryResponse,
  VerificationInput,
  VerificationResponse,
  AttritionApiResponse,
} from '@/lib/mockApi';

// GET /api/analytics — live, with offline fallback
export async function fetchAnalytics(params: mock.AnalyticsParams = {}): Promise<mock.AnalyticsResponse> {
  try {
    const qs = new URLSearchParams();
    if (params.district) qs.set('district', params.district);
    if (params.region) qs.set('region', params.region);
    if (params.tier) qs.set('tier', params.tier);
    if (params.sector) qs.set('sector', params.sector);
    const query = qs.toString();
    return await callApi<mock.AnalyticsResponse>(`/api/analytics${query ? `?${query}` : ''}`);
  } catch {
    return mock.fetchAnalytics(params);
  }
}

// POST /api/consent — live, with offline fallback
export async function submitConsent(input: mock.ConsentInput): Promise<mock.ConsentResponse> {
  try {
    return await callApi<mock.ConsentResponse>('/api/consent', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  } catch {
    return mock.submitConsent(input);
  }
}

// POST /api/telemetry — live, with offline fallback
export async function ingestTelemetry(input: mock.TelemetryInput): Promise<mock.TelemetryResponse> {
  try {
    return await callApi<mock.TelemetryResponse>('/api/telemetry', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  } catch {
    return mock.ingestTelemetry(input);
  }
}

// POST /api/verify — live, with offline fallback
export async function resolveVerification(input: mock.VerificationInput): Promise<mock.VerificationResponse> {
  try {
    return await callApi<mock.VerificationResponse>('/api/verify', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  } catch {
    return mock.resolveVerification(input);
  }
}

// GET /api/verify — live, with offline fallback
export async function fetchVerificationQueue(): Promise<Awaited<ReturnType<typeof mock.fetchVerificationQueue>>> {
  try {
    return await callApi('/api/verify');
  } catch {
    return mock.fetchVerificationQueue();
  }
}

// POST /api/ai/predict-attrition — live, with offline fallback
export async function predictAttrition(input: Parameters<typeof mock.predictAttrition>[0]): Promise<mock.AttritionApiResponse> {
  try {
    return await callApi<mock.AttritionApiResponse>('/api/ai/predict-attrition', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  } catch {
    return mock.predictAttrition(input);
  }
}