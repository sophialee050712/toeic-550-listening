import type { MockResult, Progress } from "./store";
import { todayStr } from "./store";

export type Gate = {
  id: number;
  title: string;
  pass: boolean;
  detail: string;
  action: string;
};

export type Readiness = {
  status: "red" | "yellow" | "green";
  statusLabel: string;
  gates: Gate[];
  failedCount: number;
  latestMock: MockResult | null;
  listeningEstimate: { center: number; low: number; high: number } | null;
  projected: { center: number; low: number; high: number } | null;
  vocabMastered: number;
  dictationPct: number | null;
  studyDays28: number;
};

function daysAgo(dateStr: string, ref: Date): number {
  const d = new Date(dateStr + "T00:00:00");
  const r = new Date(ref.toISOString().slice(0, 10) + "T00:00:00");
  return Math.floor((r.getTime() - d.getTime()) / 86400000);
}

export function mockTotal(m: MockResult): number {
  return m.p1 + m.p2 + m.p3 + m.p4;
}

// Transparent, rough estimate only — NOT an ETS conversion table.
// Reference anchor from the plan: ~62/100 correct ≈ ~320 listening points.
// A simple linear map (correct × 5, ±25) lands 62 → 310, close enough for a
// practice estimate, and the range is always shown alongside it.
export function listeningEstimate(totalCorrect: number) {
  const center = totalCorrect * 5;
  return { center, low: Math.max(5, center - 25), high: Math.min(495, center + 25) };
}

export function computeReadiness(p: Progress, ref = new Date()): Readiness {
  const today = todayStr(ref);
  void today;
  const mocks = [...p.mocks].sort((a, b) => (a.date < b.date ? 1 : -1));
  const latestMock = mocks[0] || null;

  // Gate 1: >=2 qualifying full mocks in last 21 days.
  const qualifying = mocks.filter(
    (m) => daysAgo(m.date, ref) <= 21 && daysAgo(m.date, ref) >= 0 && m.speed === 1 && !m.paused && mockTotal(m) >= 55,
  );
  const gate1: Gate = {
    id: 1,
    title: "Nghe ổn định qua mock full",
    pass: qualifying.length >= 2,
    detail:
      qualifying.length === 0
        ? "Chưa có mock full nào đạt chuẩn (tốc độ 1x, không dừng, từ 55/100 câu trở lên) trong 21 ngày qua."
        : `Có ${qualifying.length}/2 mock đạt chuẩn trong 21 ngày qua.`,
    action: "Làm 1 mock nghe full 100 câu ở tốc độ 1x, không dừng, trong 7 ngày tới.",
  };

  // Gate 2: Part floors on latest mock.
  let gate2: Gate;
  if (!latestMock) {
    gate2 = {
      id: 2,
      title: "Không Part nào quá yếu",
      pass: false,
      detail: "Chưa có mock nào để kiểm tra từng Part.",
      action: "Nhập 1 kết quả mock full (đủ 4 Part) vào trang Nhập mock.",
    };
  } else {
    const checks = [
      { label: "Part 1", pct: (latestMock.p1 / 6) * 100, need: 75 },
      { label: "Part 2", pct: (latestMock.p2 / 25) * 100, need: 60 },
      { label: "Part 3", pct: (latestMock.p3 / 39) * 100, need: 55 },
      { label: "Part 4", pct: (latestMock.p4 / 30) * 100, need: 50 },
    ];
    const failing = checks.filter((c) => c.pct < c.need);
    gate2 = {
      id: 2,
      title: "Không Part nào quá yếu",
      pass: failing.length === 0,
      detail: checks.map((c) => `${c.label} ${Math.round(c.pct)}% (cần ≥${c.need}%)`).join(" · "),
      action:
        failing.length === 0
          ? "Giữ phong độ: ôn lại Part yếu nhất trong tuần tới."
          : `Tập trung 7 ngày tới vào ${failing.map((c) => c.label).join(", ")} trước khi làm mock mới.`,
    };
  }

  // Gate 3: vocab + dictation. MVP bank is 80 words, so this gate honestly
  // cannot pass yet — it shows progress toward 600, it never fakes it.
  const vocabMastered = Object.values(p.vocab).filter((v) => v.mastered).length;
  const dictationPct =
    p.dictation.totalWords > 0 ? Math.round((p.dictation.correctWords / p.dictation.totalWords) * 100) : null;
  const gate3: Gate = {
    id: 3,
    title: "Từ vựng + nghe chép chi tiết",
    pass: vocabMastered >= 600 && (dictationPct ?? 0) >= 70,
    detail: `Đã thuộc ${vocabMastered}/600 từ (ngân hàng MVP hiện có 80 từ) · Nghe chép ${
      dictationPct === null ? "chưa có dữ liệu" : `${dictationPct}% (cần ≥70%)`
    }.`,
    action:
      vocabMastered < 600
        ? "Ôn từ vựng mỗi ngày trên máy tính; khi ngân hàng từ mở rộng lên 600 từ, cổng này mới có thể đạt."
        : "Luyện nghe chép Part 2 mỗi ngày cho tới khi đạt 70% trở lên.",
  };

  // Gate 4: consistency — >=20 study days in last 28 days (≈5/week)
  // plus latest mock within 14 days.
  const studyDays28 = p.sessionDates.filter((d) => daysAgo(d, ref) <= 28 && daysAgo(d, ref) >= 0).length;
  const mockRecent = latestMock ? daysAgo(latestMock.date, ref) <= 14 && daysAgo(latestMock.date, ref) >= 0 : false;
  const gate4: Gate = {
    id: 4,
    title: "Học đều + mock còn mới",
    pass: studyDays28 >= 20 && mockRecent,
    detail: `${studyDays28}/20 ngày học trong 28 ngày qua · Mock gần nhất ${
      latestMock ? (mockRecent ? "trong 14 ngày" : `đã ${daysAgo(latestMock.date, ref)} ngày trước`) : "chưa có"
    }.`,
    action: mockRecent
      ? "Giữ nhịp học 5–6 ngày/tuần, đừng để trống quá 2 ngày liên tiếp."
      : "Làm hoặc nhập 1 mock mới trong 7 ngày tới để dữ liệu còn mới.",
  };

  // Gate 5: projected total (range, never a single exact score).
  const listeningEst = latestMock ? listeningEstimate(mockTotal(latestMock)) : null;
  const projected =
    listeningEst && p.reading
      ? {
          center: listeningEst.center + p.reading.score,
          low: listeningEst.low + p.reading.score - 25,
          high: listeningEst.high + p.reading.score + 25,
        }
      : null;
  const gate5: Gate = {
    id: 5,
    title: "Tổng dự kiến có đệm an toàn (≥580)",
    pass: (projected?.center ?? 0) >= 580,
    detail: !listeningEst
      ? "Chưa có mock nghe để ước lượng điểm nghe."
      : !p.reading
        ? `Điểm nghe ước lượng khoảng ${listeningEst.low}–${listeningEst.high}, nhưng chưa nhập điểm đọc nên chưa tính được tổng.`
        : `Tổng dự kiến khoảng ${projected!.low}–${projected!.high} (giữa khoảng ${projected!.center}); cần giữa khoảng ≥580.`,
    action: !p.reading
      ? "Nhập điểm mock đọc gần nhất vào trang Nhập mock để tính tổng dự kiến."
      : "Nâng Part yếu nhất trong 7 ngày tới, rồi làm mock mới để cập nhật dự kiến.",
  };

  const gates = [gate1, gate2, gate3, gate4, gate5];
  const failedCount = gates.filter((g) => !g.pass).length;
  const status: Readiness["status"] =
    latestMock === null || failedCount >= 2 ? "red" : failedCount === 1 ? "yellow" : "green";
  const statusLabel =
    status === "green"
      ? "Xanh — Sẵn sàng đăng ký thi"
      : status === "yellow"
        ? "Vàng — Gần sẵn sàng (còn 1 cổng)"
        : "Đỏ — Chưa sẵn sàng";

  return {
    status,
    statusLabel,
    gates,
    failedCount,
    latestMock,
    listeningEstimate: listeningEst,
    projected,
    vocabMastered,
    dictationPct,
    studyDays28,
  };
}

export function streakDays(sessionDates: string[], ref = new Date()): number {
  const set = new Set(sessionDates);
  let streak = 0;
  // Allow "today not studied yet": start from today, else yesterday.
  const cursor = new Date(ref.toISOString().slice(0, 10) + "T00:00:00");
  if (!set.has(todayStr(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (set.has(todayStr(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
