import { api } from "@/lib/api";
import { clearTokens, saveTokens } from "@/lib/session";

export type Role = "admin" | "teacher" | "family";

export interface Me {
  id: number;
  username: string;
  email: string;
  display_name: string;
  role: Role;
}

export async function login(input: { username: string; password: string; rememberMe: boolean }) {
  const data = await api<{ access: string; refresh: string }>("/token/", {
    method: "POST",
    auth: false,
    body: { username: input.username, password: input.password },
  });
  saveTokens(data.access, data.refresh, input.rememberMe);
}

export const fetchMe = () => api<Me>("/me/");

export function logout() {
  clearTokens();
}
