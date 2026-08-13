import { getToken } from "./auth-storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, body.message ?? "Request failed");
  }

  const text = await res.text();    
  return text ? JSON.parse(text) : (undefined as T);
}

export interface GuestLoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    username: string | null;
    isGuest: boolean;
  };
  workspace: { id: string; name: string };
}

export function guestLogin() {
  return apiFetch<GuestLoginResponse>("/auth/guest", { method: "POST" });
}