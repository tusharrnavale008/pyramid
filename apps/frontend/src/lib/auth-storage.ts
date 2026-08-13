export interface StoredUser {
  id: string;
  email: string;
  fullName: string | null;
  username: string | null;
  isGuest: boolean;
}

export interface StoredWorkspace {
  id: string;
  name: string;
}

const TOKEN_KEY = "pyramid-token";
const USER_KEY = "pyramid-user";
const WORKSPACE_KEY = "pyramid-workspace";

export function saveSession(
  token: string,
  user: StoredUser,
  workspace: StoredWorkspace,
) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function getWorkspace(): StoredWorkspace | null {
  const raw = localStorage.getItem(WORKSPACE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(WORKSPACE_KEY);
}