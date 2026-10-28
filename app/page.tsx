"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress, resetProgress, type Progress } from "../lib/store";
import { computeReadiness, streakDays } from "../lib/readiness";
import { vocab } from "../lib/data";

export default function Home() {
  const [p, setP] = useState<Progress | null>(null);
  useEffect(() => setP(loadProgress()), []);
  if (!p) return <p>Đang tải tiến độ…</p>;

  const r = computeReadiness(p);
  const streak = streakDays(p.sessionDates);
  const totalAnswered = Object.values(p.answers).reduce((s, a) => s + a.total, 0);
  const totalCorrect = Object.values(p.answers).reduce((s, a) => s + a.correct, 0);
  const weakest = (Object.entries(p.answers) as [string, { correct: number; total: number }][]).reduce(
    (worst, [k, v]) => {
      const pct = v.total ? (v.correct / v.total) * 100 : 100;
      return pct < worst.pct ? { k, pct } : worst;
    },
    { k: "—", pct: 101 },
  );

  return (
    <div>
      <h1>Hôm nay học gì?</h1>
      <p className="muted">
        Mục tiêu: TOEIC 550 tổng (nghe khoảng 300 + đọc khoảng 250). Lịch đã chốt: 60 phút lái xe + 30 phút máy tính mỗi ngày.
      </p>

      <div className="grid">
        <div className="card">
          <div>🚗 Trên ô tô — 60 phút</div>
          <p>Playlist tự chạy, nghe câu hỏi rồi nghe đáp án, không cần bấm khi đang lái.</p>
          <Link className="btn primary" href="/car">Mở Chế độ ô tô</Link>
        </div>
        <div className="card">
          <div>💻 Trên máy tính — 30 phút</div>
          <p>Làm bài, xem transcript sau khi trả lời, nghe chép và ôn từ sai.</p>
          <div className="row">
            <Link className="btn" href="/part/2">Part 2</Link>
            <Link className="btn" href="/dictation">Nghe chép</Link>
            <Link className="btn" href="/vocab">Từ vựng</Link>
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="card"><div className="muted">Chuỗi ngày học</div><div className="big">{streak} ngày</div></div>
        <div className="card"><div className="muted">Câu luyện tập đã làm</div><div className="big">{totalCorrect}/{totalAnswered} đúng</div></div>
        <div className="card"><div className="muted">Part yếu nhất (theo bài luyện)</div><div className="big">{totalAnswered ? weakest.k.toUpperCase() : "Chưa có dữ liệu"}</div></div>
        <div className="card"><div className="muted">Từ đã thuộc</div><div className="big">{r.vocabMastered} / 600</div><p className="muted">Ngân hàng MVP có {vocab.length} từ; cổng 600 từ chỉ đạt khi ngân hàng mở rộng.</p></div>
      </div>

      <h2>Đã đủ điều kiện thi chưa?</h2>
      <div className="card">
        <span className={`pill ${r.status}`}>{r.statusLabel}</span>
        <p>
          {r.projected
            ? <>Tổng dự kiến khoảng <strong>{r.projected.low}–{r.projected.high}</strong> (giữa khoảng {r.projected.center}). Đây là khoảng ước lượng luyện tập, không phải điểm thi thật.</>
            : "Chưa tính được tổng dự kiến — cần mock nghe và điểm đọc (xem các cổng dưới)."}
        </p>
        <p className="muted">
          {r.latestMock
            ? <>Mock gần nhất: {r.latestMock.date} — {r.latestMock.p1 + r.latestMock.p2 + r.latestMock.p3 + r.latestMock.p4}/100 câu, tốc độ {r.latestMock.speed}x, {r.latestMock.paused ? "có dừng" : "không dừng"}.</>
            : "Chưa có mock nào. Nhập kết quả mock vào trang Nhập mock để bắt đầu tính."}
          {p.reading ? <> Điểm đọc đã nhập: {p.reading.score} ({p.reading.date}).</> : " Chưa nhập điểm đọc."}
        </p>
      </div>

      {r.gates.map((g) => (
        <div className="card" key={g.id}>
          <div className="row">
            <span className={g.pass ? "ok" : "bad"}>{g.pass ? "✓ Đạt" : "✗ Chưa đạt"}</span>
            <strong>Cổng {g.id}: {g.title}</strong>
          </div>
          <p>{g.detail}</p>
          {!g.pass && <p><strong>7 ngày tới:</strong> {g.action}</p>}
        </div>
      ))}

      <h2>Điểm theo Part (bài luyện trong app)</h2>
      <div className="grid">
        {(Object.entries(p.answers) as [string, { correct: number; total: number }][]).map(([k, v]) => (
          <div className="card" key={k}>
            <div>{k.toUpperCase()}</div>
            <div className="big">{v.total ? `${Math.round((v.correct / v.total) * 100)}%` : "—"}</div>
            <p className="muted">{v.correct}/{v.total} câu đúng</p>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="muted">Lưu ý quan trọng: app này chỉ lưu trên thiết bị này. Xóa dữ liệu trình duyệt sẽ mất tiến độ. Chưa có đồng bộ điện thoại — máy tính.</p>
        <button onClick={() => { const np = resetProgress(); setP(np); }} style={{ borderColor: "#b91c1c", color: "#b91c1c" }}>
          Xóa toàn bộ tiến độ (không khôi phục được)
        </button>
      </div>
    </div>
  );
}
