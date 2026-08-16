import { apiFetch } from "./api-client";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  username: string | null;
  title: string | null;
  avatarUrl: string | null;
  isGuest: boolean;
}

export function getMe() {
  return apiFetch<UserProfile>("/users/me");
}

export interface UpdateProfileInput {
  fullName?: string;
  username?: string;
  title?: string;
}

export function updateMe(input: UpdateProfileInput) {
  return apiFetch<UserProfile>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}