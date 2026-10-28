"use client";

import { useEffect, useState } from "react";
import { dictation } from "../../lib/data";
import { loadProgress, saveProgress, withSession, type Progress } from "../../lib/store";
import { speak, stopSpeech } from "../../lib/speech";

function norm(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9\s']/g, " ").split(/\s+/).filter(Boolean);
}

export default function DictationPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [idx, setIdx] = useState(0);
  const [rate, setRate] = useState(0.75);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<{ expected: string[]; got: string[]; correct: number } | null>(null);

  useEffect(() => setProgress(loadProgress()), []);
  useEffect(() => () => stopSpeech(), []);

  if (!progress) return <p>Đang tải…</p>;
  const item = dictation[idx];
  const pct = progress.dictation.totalWords
    ? Math.round((progress.dictation.correctWords / progress.dictation.totalWords) * 100)
    : null;

  const check = () => {
    const expected = norm(item.text);
    const got = norm(typed);
    let correct = 0;
    expected.forEach((w, i) => { if (got[i] === w) correct += 1; });
    setResult({ expected, got, correct });
    const np = withSession(progress);
    np.dictation = {
      correctWords: np.dictation.correctWords + correct,
      totalWords: np.dictation.totalWords + expected.length,
      checked: np.dictation.checked + 1,
    };
    saveProgress(np);
    setProgress(np);
  };

  return (
    <div>
      <h1>Nghe chép (Dictation)</h1>
      <p className="muted">
        Nghe 1 câu ngắn, gõ lại đúng từng từ. App chấm theo từng vị trí từ. Điểm nghe chép hiện tại:{" "}
        {pct === null ? "chưa có dữ liệu" : `${pct}% (${progress.dictation.correctWords}/${progress.dictation.totalWords} từ, ${progress.dictation.checked} câu đã chấm)`}
        . Cổng sẵn sàng thi cần từ 70% trở lên.
      </p>
      <div className="row">
        <span>Tốc độ:</span>
        <button className={rate === 0.75 ? "primary" : ""} onClick={() => setRate(0.75)}>0.75x</button>
        <button className={rate === 1 ? "primary" : ""} onClick={() => setRate(1)}>1x</button>
        <button onClick={stopSpeech}>Dừng audio</button>
      </div>
      <div className="card">
        <p>Câu {idx + 1}/{dictation.length}</p>
        <button className="primary" onClick={() => speak(item.text, { rate, lang: "en-US" })}>▶ Nghe câu</button>
        <label htmlFor="typed">Bạn nghe được gì? (gõ tiếng Anh)</label>
        <textarea id="typed" rows={3} value={typed} onChange={(e) => { setTyped(e.target.value); setResult(null); }} placeholder="Type what you hear…" />
        <div className="row" style={{ marginTop: 10 }}>
          <button className="primary" onClick={check} disabled={!typed.trim()}>Chấm bài</button>
          <button disabled={idx === 0} onClick={() => { setIdx(idx - 1); setTyped(""); setResult(null); }}>← Câu trước</button>
          <button disabled={idx === dictation.length - 1} onClick={() => { setIdx(idx + 1); setTyped(""); setResult(null); }}>Câu tiếp →</button>
        </div>
        {result && (
          <div style={{ marginTop: 14 }}>
            <p><strong>Kết quả: {result.correct}/{result.expected.length} từ đúng vị trí.</strong></p>
            <p>
              {result.expected.map((w, i) => (
                <span key={i} className={result.got[i] === w ? "ok" : "bad"} style={{ marginRight: 6 }}>{w}</span>
              ))}
            </p>
            <p className="muted">Từ màu đỏ là từ bạn gõ sai hoặc thiếu ở vị trí đó. Nghe lại câu, chú ý đúng những từ đó.</p>
            <p><strong>Đáp án:</strong> {item.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
