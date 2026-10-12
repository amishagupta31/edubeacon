"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

export const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type AccountType = "TEACHER" | "SCHOOL_ADMIN";

export interface RecruitmentProfile {
  accountType: AccountType;
  email: string;
  fullName?: string;
  phone?: string;
  institutionName?: string;
  contactPerson?: string;
  createdAt?: string;
}

export const DASHBOARD_PATH: Record<AccountType, string> = {
  TEACHER: "/recruitment/teacher",
  SCHOOL_ADMIN: "/recruitment/school",
};

type State =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "unregistered" }
  | { status: "ready"; profile: RecruitmentProfile }
  | { status: "error"; message: string };

/**
 * Single source of truth for recruitment auth state in the browser.
 *
 * This is a convenience for routing and rendering only. It is NOT a security
 * boundary — every protected endpoint re-checks identity and role server-side
 * via requireAuth + requireRole.
 */
export function useRecruitmentProfile() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [state, setState] = useState<State>({ status: "loading" });

  const authHeader = useCallback(async () => {
    const token = await getToken();
    return { Authorization: `Bearer ${token ?? ""}`, "Content-Type": "application/json" };
  }, [getToken]);

  const load = useCallback(async () => {
    if (!isLoaded) return;
    if (!isSignedIn) { setState({ status: "signed-out" }); return; }

    try {
      const res = await fetch(`${API}/api/recruitment/me`, { headers: await authHeader() });
      if (res.status === 401) { setState({ status: "signed-out" }); return; }
      if (!res.ok) { setState({ status: "error", message: "Could not load your account." }); return; }

      const data = (await res.json()) as RecruitmentProfile | null;
      setState(data ? { status: "ready", profile: data } : { status: "unregistered" });
    } catch {
      setState({ status: "error", message: `Cannot reach the server at ${API}.` });
    }
  }, [isLoaded, isSignedIn, authHeader]);

  useEffect(() => { load(); }, [load]);

  return { state, reload: load, authHeader };
}
