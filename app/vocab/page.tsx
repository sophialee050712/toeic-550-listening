"use client";

import { useEffect, useState } from "react";
import { vocab } from "../../lib/data";
import { loadProgress, saveProgress, withSession, type Progress } from "../../lib/store";
import { speak, stopSpeech } from "../../lib/speech";

export default function VocabPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "mastered">("all");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => setProgress(loadProgress()), []);
  useEffect(() => () => stopSpeech(), []);

  if (!progress) return <p>Đang tải…</p>;
  const masteredCount = Object.values(progress.vocab).filter((v) => v.mastered).length;
  const list = vocab.filter((w) => {
    const s = progress.vocab[w.word];
    if (filter === "mastered") return !!s?.mastered;
    if (filter === "new") return !s?.mastered;
    return true;
  });
  const word = list[Math.min(idx, Math.max(0, list.length - 1))];

  const mark = (correct: boolean) => {
    if (!word) return;
    const cur = progress.vocab[word.word] || { reviews: 0, mastered: false };
    const reviews = correct ? cur.reviews + 1 : 0;
    const np = withSession(progress);
    np.vocab = { ...np.vocab, [word.word]: { reviews, mastered: reviews >= 2 } };
    saveProgress(np);
    setProgress(np);
    setFlipped(false);
    setIdx((i) => Math.min(i + 1, list.length - 1));
  };

  return (
    <div>
      <h1>Từ vựng công sở</h1>
      <p className="muted">
        Đã thuộc {masteredCount}/600 từ mục tiêu (ngân hàng MVP có {vocab.length} từ). Một từ được tính là “đã thuộc”
        khi bạn bấm “Nhớ rồi” 2 lần (2 lần ôn đúng). Bấm “Chưa nhớ” sẽ reset số lần ôn của từ đó về 0.
      </p>
      <div className="bar"><div style={{ width: `${Math.min(100, (masteredCount / 600) * 100)}%` }} /></div>
      <div className="row" style={{ marginTop: 12 }}>
        <button className={filter === "all" ? "primary" : ""} onClick={() => { setFilter("all"); setIdx(0); }}>Tất cả</button>
        <button className={filter === "new" ? "primary" : ""} onClick={() => { setFilter("new"); setIdx(0); }}>Chưa thuộc</button>
        <button className={filter === "mastered" ? "primary" : ""} onClick={() => { setFilter("mastered"); setIdx(0); }}>Đã thuộc</button>
      </div>
      {!word ? (
        <div className="card"><p>Không có từ nào trong nhóm này.</p></div>
      ) : (
        <div className="card">
          <p className="muted">Thẻ {Math.min(idx + 1, list.length)}/{list.length} · Chủ đề: {word.topic}</p>
          <div className="big">{word.word}</div>
          <button onClick={() => speak(word.word, { rate: 1, lang: "en-US" })}>▶ Nghe từ</button>{" "}
          <button onClick={() => speak(word.example, { rate: 0.9, lang: "en-US" })}>▶ Nghe ví dụ</button>
          {!flipped ? (
            <div style={{ marginTop: 14 }}><button className="primary" onClick={() => setFlipped(true)}>Lật thẻ xem nghĩa</button></div>
          ) : (
            <div style={{ marginTop: 14 }}>
              <p><strong>Nghĩa:</strong> {word.vi}</p>
              <p><strong>Ví dụ:</strong> {word.example}</p>
              <div className="row">
                <button className="primary" onClick={() => mark(true)}>✓ Nhớ rồi</button>
                <button onClick={() => mark(false)}>✗ Chưa nhớ</button>
              </div>
              <p className="muted">Số lần ôn đúng hiện tại của từ này: {(progress.vocab[word.word]?.reviews || 0)} (cần 2 để tính là thuộc).</p>
            </div>
          )}
          <div className="row" style={{ marginTop: 14 }}>
            <button disabled={idx === 0} onClick={() => { setIdx(idx - 1); setFlipped(false); }}>← Thẻ trước</button>
            <button disabled={idx >= list.length - 1} onClick={() => { setIdx(idx + 1); setFlipped(false); }}>Thẻ tiếp →</button>
          </div>
        </div>
      )}
      <h2>Danh sách từ</h2>
      {vocab.map((w) => {
        const s = progress.vocab[w.word];
        return (
          <div className="card" key={w.word} style={{ padding: "10px 14px" }}>
            <strong>{w.word}</strong> — {w.vi} <span className="muted">· {w.topic} · {s?.mastered ? "✓ Đã thuộc" : s ? `${s.reviews}/2 lần ôn đúng` : "Chưa ôn"}</span>
            <br /><span className="muted">{w.example}</span>
          </div>
        );
      })}
    </div>
  );
}
