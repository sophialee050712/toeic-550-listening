"use client";

import { useEffect, useState } from "react";
import { loadProgress, saveProgress, withSession, type Progress } from "../../lib/store";
import { mockTotal } from "../../lib/readiness";

export default function MockPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [p1, setP1] = useState(0);
  const [p2, setP2] = useState(0);
  const [p3, setP3] = useState(0);
  const [p4, setP4] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [reading, setReading] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
    if (p.reading) setReading(String(p.reading.score));
  }, []);

  if (!progress) return <p>Đang tải…</p>;

  const submitMock = () => {
    if (p1 < 0 || p1 > 6 || p2 < 0 || p2 > 25 || p3 < 0 || p3 > 39 || p4 < 0 || p4 > 30) {
      setMsg("Số câu đúng vượt giới hạn của Part. Kiểm tra lại: Part 1 tối đa 6, Part 2 tối đa 25, Part 3 tối đa 39, Part 4 tối đa 30.");
      return;
    }
    const np = withSession(progress);
    np.mocks = [...np.mocks, { id: `${Date.now()}`, date, p1, p2, p3, p4, speed, paused }];
    saveProgress(np);
    setProgress(np);
    setMsg(`Đã lưu mock ngày ${date}: tổng ${p1 + p2 + p3 + p4}/100 câu. Về Trang chủ để xem cổng sẵn sàng thi cập nhật.`);
  };

  const submitReading = () => {
    const score = Number(reading);
    if (!Number.isFinite(score) || score < 5 || score > 495) {
      setMsg("Điểm đọc phải từ 5 đến 495.");
      return;
    }
    const np = withSession(progress);
    np.reading = { score, date };
    saveProgress(np);
    setProgress(np);
    setMsg(`Đã lưu điểm đọc ${score} (ngày ${date}). Cổng tổng dự kiến sẽ tính lại ở Trang chủ.`);
  };

  const removeMock = (id: string) => {
    const np = { ...progress, mocks: progress.mocks.filter((m) => m.id !== id) };
    saveProgress(np);
    setProgress(np);
  };

  return (
    <div>
      <h1>Nhập kết quả mock</h1>
      <p className="muted">
        Nhập đúng số câu đúng của 1 bài mock nghe full 100 câu bạn đã làm (ở ngoài app hoặc làm đủ 4 Part).
        Cổng sẵn sàng thi chỉ tính mock ở tốc độ 1x và không dừng. Điểm đọc nhập ở dưới dùng để tính tổng dự kiến 550.
      </p>
      {msg && <div className="card"><p>{msg}</p></div>}
      <div className="card">
        <label>Ngày làm mock</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <label>Part 1 — số câu đúng (tối đa 6)</label>
        <input type="number" min={0} max={6} value={p1} onChange={(e) => setP1(Number(e.target.value))} />
        <label>Part 2 — số câu đúng (tối đa 25)</label>
        <input type="number" min={0} max={25} value={p2} onChange={(e) => setP2(Number(e.target.value))} />
        <label>Part 3 — số câu đúng (tối đa 39)</label>
        <input type="number" min={0} max={39} value={p3} onChange={(e) => setP3(Number(e.target.value))} />
        <label>Part 4 — số câu đúng (tối đa 30)</label>
        <input type="number" min={0} max={30} value={p4} onChange={(e) => setP4(Number(e.target.value))} />
        <p><strong>Tổng: {p1 + p2 + p3 + p4}/100 câu</strong></p>
        <label>Tốc độ làm bài</label>
        <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
          <option value={0.75}>0.75x</option>
          <option value={0.9}>0.9x</option>
          <option value={1}>1x (tốc độ thi)</option>
        </select>
        <label>
          <input type="checkbox" checked={paused} onChange={(e) => setPaused(e.target.checked)} style={{ width: "auto" }} />{" "}
          Có dừng / xem transcript giữa chừng
        </label>
        <div style={{ marginTop: 12 }}>
          <button className="primary" onClick={submitMock}>Lưu kết quả mock</button>
        </div>
      </div>

      <div className="card">
        <h2>Điểm đọc (nhập tay)</h2>
        <p className="muted">Nhập điểm đọc ước lượng từ mock đọc gần nhất (thang 5–495). Không có điểm đọc thì cổng tổng dự kiến không thể đạt.</p>
        <label>Điểm đọc ước lượng</label>
        <input type="number" min={5} max={495} value={reading} onChange={(e) => setReading(e.target.value)} placeholder="Ví dụ: 250" />
        <div style={{ marginTop: 12 }}>
          <button className="primary" onClick={submitReading}>Lưu điểm đọc</button>
        </div>
        {progress.reading && <p>Điểm đọc hiện tại: {progress.reading.score} ({progress.reading.date}).</p>}
      </div>

      <h2>Lịch sử mock đã nhập</h2>
      {progress.mocks.length === 0 && <p className="muted">Chưa có mock nào.</p>}
      {[...progress.mocks].sort((a, b) => (a.date < b.date ? 1 : -1)).map((m) => (
        <div className="card" key={m.id}>
          <p>
            <strong>{m.date}</strong> — Tổng {mockTotal(m)}/100 (P1 {m.p1}/6 · P2 {m.p2}/25 · P3 {m.p3}/39 · P4 {m.p4}/30) ·
            Tốc độ {m.speed}x · {m.paused ? "có dừng" : "không dừng"}
          </p>
          <button onClick={() => removeMock(m.id)}>Xóa kết quả này</button>
        </div>
      ))}
    </div>
  );
}
