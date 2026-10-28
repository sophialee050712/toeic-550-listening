import { getSupabase } from "./supabase";
import type { Progress } from "./store";

// One row per user in the `toeic_progress` table: { user_id, data, updated_at }.
// Merge rule is deliberately simple and honest: last write wins, compared by
// the updatedAt timestamp stamped on every save. The first sync after login
// can therefore overwrite progress made on another device before login —
// the SyncBar warns about this, and after the first sync both devices
// converge because every save pushes to the cloud.

export type SyncStatus = "idle" | "syncing" | "synced" | "error" | "not-configured" | "logged-out";

export async function pushProgress(p: Progress): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return false;
    const { error } = await sb.from("toeic_progress").upsert({
      user_id: user.id,
      data: p,
      updated_at: p.updatedAt || new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function pullProgress(): Promise<Progress | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return null;
    const { data, error } = await sb
      .from("toeic_progress")
      .select("data, updated_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error || !data) return null;
    const cloud = data.data as Partial<Progress>;
    if (!cloud || typeof cloud !== "object") return null;
    return { ...cloud, updatedAt: cloud.updatedAt || (data.updated_at as string) || "" } as Progress;
  } catch {
    return null;
  }
}

// Runs once when a logged-in user opens the app. The caller passes the local
// progress and, on "cloud-newer", saves the returned cloud copy locally
// (with push disabled) and reloads once, so every page shows cloud progress
// instead of stale local data.
export async function syncOnStart(
  local: Progress,
): Promise<{ action: "cloud-newer"; cloud: Progress } | { action: "pushed" | "none" | "error" }> {
  const sb = getSupabase();
  if (!sb) return { action: "none" };
  try {
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return { action: "none" };
    const cloud = await pullProgress();
    if (!cloud) {
      // First login from this account: upload whatever is local, if any.
      if (local.updatedAt) await pushProgress(local);
      return { action: "pushed" };
    }
    const localTime = local.updatedAt || "";
    const cloudTime = cloud.updatedAt || "";
    if (cloudTime > localTime) return { action: "cloud-newer", cloud };
    if (localTime > cloudTime) {
      await pushProgress(local);
      return { action: "pushed" };
    }
    return { action: "none" };
  } catch {
    return { action: "error" };
  }
}
