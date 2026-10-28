"use client";

import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "../../lib/supabase";
import { loadProgress, saveProgress } from "../../lib/store";
import { pushProgress, syncOnStart, type SyncStatus } from "../../lib/sync";

// Header sync bar, present on every page. One account (email + password)
// is shared between iPhone and computer. First sync is last-write-wins:
// the device whose progress was saved most recently wins, the older copy
// is overwritten — after that, every save pushes, so both sides converge.
export default function SyncBar() {
  const [configured] = useState(isSupabaseConfigured());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setStatus("not-configured");
      return;
    }
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (cancelled) return;
      if (!user?.email) {
        setStatus("logged-out");
        return;
      }
      setUserEmail(user.email);
      setStatus("syncing");
      const result = await syncOnStart(loadProgress());
      if (cancelled) return;
      if (result.action === "cloud-newer") {
        // Adopt the cloud copy, then reload once so the current page
        // renders cloud progress instead of stale local progress.
        saveProgress(result.cloud, { push: false });
        window.location.reload();
        return;
      }
      setStatus(result.action === "error" ? "error" : "synced");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function auth(mode: "login" | "signup") {
    const sb = getSupabase();
    if (!sb) return;
    setStatus("syncing");
    setMsg("");
    const fn =
      mode === "login"
        ? sb.auth.signInWithPassword({ email, password })
        : sb.auth.signUp({ email, password });
    const { data, error } = await fn;
    if (error) {
      setStatus("error");
      setMsg(error.message);
      return;
    }
    if (!data.user) {
      setStatus("error");
      setMsg("Chưa tạo được tài khoản. Kiểm tra lại email và mật khẩu.");
      return;
    }
    if (!data.session) {
      // Supabase project still requires email confirmation.
      setStatus("error");
      setMsg(
        "Tài khoản đã tạo nhưng cần xác nhận email trước khi đăng nhập. Mở email xác nhận rồi quay lại đăng nhập, hoặc tắt Confirm email trong Supabase (Authentication → Sign-in) vì đây là app cá nhân.",
      );
      return;
    }
    setUserEmail(data.user.email ?? email);
    // Upload whatever progress exists on this device, then reload so the
    // page shows the merged (newest) state.
    await pushProgress(loadProgress());
    setStatus("synced");
    window.location.reload();
  }

  async function syncNow() {
    setStatus("syncing");
    setMsg("");
    const result = await syncOnStart(loadProgress());
    if (result.action === "cloud-newer") {
      saveProgress(result.cloud, { push: false });
      window.location.reload();
      return;
    }
    setStatus(result.action === "error" ? "error" : "synced");
    if (result.action === "error") setMsg("Đồng bộ thất bại — kiểm tra mạng rồi bấm Đồng bộ lại.");
  }

  async function signOut() {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    setUserEmail(null);
    setStatus("logged-out");
  }

  if (!configured) {
    return (
      <div className="syncbar">
        <span className="muted">Đồng bộ: chưa cấu hình Supabase — tiến độ hiện chỉ lưu trên thiết bị này.</span>
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="syncbar">
        <div className="row">
          <input
            type="email"
            placeholder="Email dùng cho cả iPhone và máy tính"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ maxWidth: 280 }}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ maxWidth: 200 }}
          />
          <button onClick={() => void auth("login")} disabled={status === "syncing" || !email || !password}>
            Đăng nhập
          </button>
          <button onClick={() => void auth("signup")} disabled={status === "syncing" || !email || !password}>
            Tạo tài khoản
          </button>
        </div>
        <p className="muted" style={{ margin: "6px 0 0" }}>
          Dùng cùng 1 tài khoản trên iPhone và máy tính để đồng bộ. Lần đồng bộ đầu tiên: bản tiến độ mới nhất sẽ thắng, bản cũ hơn trên thiết bị còn lại sẽ bị ghi đè.
        </p>
        {msg && <p className="bad" style={{ margin: "6px 0 0" }}>{msg}</p>}
      </div>
    );
  }

  return (
    <div className="syncbar">
      <div className="row">
        <span>
          ☁️ Đã đăng nhập: <strong>{userEmail}</strong> ·{" "}
          {status === "syncing"
            ? "Đang đồng bộ…"
            : status === "synced"
              ? "Đã đồng bộ"
              : status === "error"
                ? "Đồng bộ lỗi"
                : "Chưa đồng bộ"}
        </span>
        <button onClick={() => void syncNow()} disabled={status === "syncing"}>
          Đồng bộ ngay
        </button>
        <button onClick={() => void signOut()}>Đăng xuất</button>
      </div>
      {msg && <p className="bad" style={{ margin: "6px 0 0" }}>{msg}</p>}
    </div>
  );
}
