// React Query helpers built on top of the typed openapi-fetch client. Each
// resource exports a `queryOptions`-style factory so callers can pass it
// straight into `useQuery({...newsList()})` and TS infers everything.

import { queryOptions } from "@tanstack/react-query";
import { api } from "./client";
import type { components } from "./schema";

export type News = components["schemas"]["SunnyValeNews"];
export type BBQReservation = components["schemas"]["BBQReservation"];
export type HallReservation = components["schemas"]["HallReservation"];
export type VisitorAccess = components["schemas"]["VisitorAccess"];
export type CondoPayment = components["schemas"]["CondoPayment"];
export type User = components["schemas"]["User"];

// Drop the pagination envelope — the prototype doesn't paginate UI-side yet,
// it just shows the first page (10 items by default).
async function unwrap<T>(promise: Promise<{ data?: { results?: T[] } | undefined; error?: unknown }>): Promise<T[]> {
  const { data, error } = await promise;
  if (error) throw error;
  return data?.results ?? [];
}

async function unwrapOne<T>(promise: Promise<{ data?: T; error?: unknown }>): Promise<T> {
  const { data, error } = await promise;
  if (error || !data) throw error ?? new Error("Resposta vazia.");
  return data;
}

// ─── news ──────────────────────────────────────────────────────────────────
export const newsKeys = {
  all: ["news"] as const,
  detail: (id: number) => ["news", id] as const,
};

export const newsList = () =>
  queryOptions({
    queryKey: newsKeys.all,
    queryFn: () => unwrap<News>(api.GET("/sunny_vale_news/", {})),
  });

export const newsOne = (id: number) =>
  queryOptions({
    queryKey: newsKeys.detail(id),
    queryFn: () => unwrapOne<News>(api.GET("/sunny_vale_news/{id}/", { params: { path: { id } } })),
  });

// ─── bbq reservations ──────────────────────────────────────────────────────
export const bbqKeys = {
  all: ["bbq"] as const,
};

export const bbqList = () =>
  queryOptions({
    queryKey: bbqKeys.all,
    queryFn: () => unwrap<BBQReservation>(api.GET("/bbq/", {})),
  });

export async function createBbqReservation(input: { reservation_date: string; guest_count: number }) {
  return unwrapOne<BBQReservation>(api.POST("/bbq/", { body: input }));
}

// ─── hall reservations ─────────────────────────────────────────────────────
export const hallKeys = {
  all: ["hall"] as const,
};

export const hallList = () =>
  queryOptions({
    queryKey: hallKeys.all,
    queryFn: () => unwrap<HallReservation>(api.GET("/hall/", {})),
  });

export async function createHallReservation(input: { reservation_date: string; guest_count: number }) {
  return unwrapOne<HallReservation>(api.POST("/hall/", { body: input }));
}

// ─── visitors ──────────────────────────────────────────────────────────────
export const visitorsKeys = {
  all: ["visitors"] as const,
  detail: (id: string) => ["visitors", id] as const,
};

export const visitorsList = () =>
  queryOptions({
    queryKey: visitorsKeys.all,
    queryFn: () => unwrap<VisitorAccess>(api.GET("/visitor_access/", {})),
  });

export const visitorOne = (id: string) =>
  queryOptions({
    queryKey: visitorsKeys.detail(id),
    queryFn: () => unwrapOne<VisitorAccess>(api.GET("/visitor_access/{id}/", { params: { path: { id } } })),
  });

export async function createVisitor(input: {
  visitor_name: string;
  scheduled_date: string;
  email?: string;
  description?: string;
}) {
  return unwrapOne<VisitorAccess>(api.POST("/visitor_access/", { body: input }));
}

export async function deleteVisitor(id: string) {
  const { error } = await api.DELETE("/visitor_access/{id}/", { params: { path: { id } } });
  if (error) throw error;
}

// ─── condo payments ────────────────────────────────────────────────────────
export const paymentsKeys = {
  all: ["payments"] as const,
  detail: (id: string) => ["payments", id] as const,
};

export const paymentsList = () =>
  queryOptions({
    queryKey: paymentsKeys.all,
    queryFn: () => unwrap<CondoPayment>(api.GET("/condo_payments/", {})),
  });

export const paymentOne = (id: string) =>
  queryOptions({
    queryKey: paymentsKeys.detail(id),
    queryFn: () => unwrapOne<CondoPayment>(api.GET("/condo_payments/{id}/", { params: { path: { id } } })),
  });

// ─── service requests ──────────────────────────────────────────────────────
// drf-spectacular doesn't model these FBVs with bodies, so we hit them with
// the typed client using loosened types and parse the JSON ourselves.

export interface ServiceRequest {
  id: number;
  requester_user: number;
  title: string;
  request_description: string | null;
  service_type: string;
  location: string | null;
  priority: "low" | "medium" | "high";
  status: "requested" | "accepted" | "declined";
  request_scheduled_date: string;
  created_at: string;
  updated_at: string;
}

export const requestsKeys = {
  all: ["service-requests"] as const,
  detail: (id: number) => ["service-requests", id] as const,
};

const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function authedFetch(path: string, init?: RequestInit): Promise<Response> {
  const { getAccessToken } = await import("../auth/storage");
  const token = getAccessToken();
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${baseUrl}${path}`, { ...init, headers });
}

export const requestsList = () =>
  queryOptions({
    queryKey: requestsKeys.all,
    queryFn: async (): Promise<ServiceRequest[]> => {
      const r = await authedFetch("/service_requests/");
      if (!r.ok) throw Object.assign(new Error("Falha ao carregar"), { status: r.status });
      return r.json();
    },
  });

export const requestOne = (id: number) =>
  queryOptions({
    queryKey: requestsKeys.detail(id),
    queryFn: async (): Promise<ServiceRequest> => {
      const r = await authedFetch(`/service_requests/${id}/`);
      if (!r.ok) throw Object.assign(new Error("Falha ao carregar"), { status: r.status });
      return r.json();
    },
  });

export async function createServiceRequest(input: {
  title: string;
  request_description: string;
  service_type: string;
  priority: "low" | "medium" | "high";
  request_scheduled_date: string;
}) {
  const r = await authedFetch("/service_requests/", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!r.ok) throw Object.assign(new Error("Falha ao criar"), { status: r.status });
  return r.json() as Promise<ServiceRequest>;
}

export async function deleteServiceRequest(id: number) {
  const r = await authedFetch(`/service_requests/${id}/`, { method: "DELETE" });
  if (!r.ok && r.status !== 204) throw Object.assign(new Error("Falha ao excluir"), { status: r.status });
}
