// Auth-specific API calls (login, logout, fetch current user). Kept separate
// from the generic api client so the login form can bypass the bearer
// middleware cleanly.

import { api } from "./client";
import { clearTokens, setTokens } from "../auth/storage";
import type { components } from "./schema";

export type User = components["schemas"]["User"];

export async function login(username: string, password: string): Promise<User> {
  const { data, error, response } = await api.POST("/api/token/", {
    body: { username, password },
  });
  if (error || !data?.access || !data.refresh) {
    throw new LoginError(response.status === 401 ? "Usuário ou senha inválidos." : "Falha ao entrar. Tente novamente.");
  }
  setTokens(data.access, data.refresh);
  return fetchCurrentUser();
}

export async function fetchCurrentUser(): Promise<User> {
  const { data, error } = await api.GET("/user/me/");
  if (error || !data) {
    throw new Error("Não foi possível carregar seu perfil.");
  }
  return data;
}

export async function updateCurrentUser(patch: Partial<User>): Promise<User> {
  const { data, error } = await api.PATCH("/user/me/", { body: patch });
  if (error || !data) {
    throw new Error("Não foi possível atualizar seu perfil.");
  }
  return data;
}

export function logout(): void {
  clearTokens();
}

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoginError";
  }
}
