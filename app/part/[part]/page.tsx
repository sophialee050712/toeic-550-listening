"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { part1, part2, part3, part4, type Passage } from "../../../lib/data";
import { loadProgress, recordAnswer, saveProgress, type PartKey, type Progress } from "../../../lib/store";
import { speak, stopSpeech } from "../../../lib/speech";

const titles: Record<string, string> = {
  "1": "Part 1 — Tả tranh (6 câu trong đề thật)",
  "2": "Part 2 — Hỏi đáp ngắn (25 câu trong đề thật)",
  "3": "Part 3 — Hội thoại (13 đoạn × 3 câu trong đề thật)",
  "4": "Part 4 — Bài nói ngắn (10 bài × 3 câu trong đề thật)",
};

export default function PartPage() {
  const params = useParams();
  const part = String(params.part);
  const [rate, setRate] = useState(0.75);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [answered, setAnswered] = useState<Record<string, number>>({});
  const [passageIdx, setPassageIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);

  useEffect(() => setProgress(loadProgress()), []);
  useEffect(() => () => stopSpeech(), []);

  const passages: Passage[] = part === "3" ? part3 : part === "4" ? part4 : [];
  const passage = passages[passageIdx];

  const answer = (partKey: PartKey, qid: string, idx: number, correctIdx: number) => {
    if (answered[qid] !== undefined || !progress) return;
    const np = recordAnswer(progress, partKey, idx === correctIdx);
    saveProgress(np);
    setProgress(np);
    setAnswered((a) => ({ ...a, [qid]: idx }));
  };

  const play = (text: string) => speak(text, { rate, lang: "en-US" });

  const rateBar = (
    <div className="row" style={{ margin: "12px 0" }}>
      <span>Tốc độ nghe:</span>
      <button className={rate === 0.75 ? "primary" : ""} onClick={() => setRate(0.75)}>0.75x (chậm)</button>
      <button className={rate === 1 ? "primary" : ""} onClick={() => setRate(1)}>1x (tốc độ thi)</button>
      <button onClick={stopSpeech}>Dừng audio</button>
    </div>
  );

  if (!progress) return <p>Đang tải…</p>;

  // ---- Part 1 ----
  if (part === "1") {
    const item = part1[itemIdx];
    const picked = answered[item.id];
    return (
      <div>
        <h1>{titles[part]}</h1>
        <p className="muted">Nghe 4 câu mô tả, chọn câu đúng với tranh. Transcript chỉ hiện sau khi bạn trả lời.</p>
        {rateBar}
        <div className="card">
          <div className="scene">🖼️ {item.scene}<br /><span className="muted">{item.sceneVi}</span></div>
          <p>Bài {itemIdx + 1}/{part1.length}</p>
          <button className="primary" onClick={() => play(item.statements.join(" "))}>▶ Nghe 4 câu mô tả</button>
          {item.statements.map((s, i) => (
            <button
              key={i}
              className={`opt ${picked === i ? (i === item.answer ? "correct" : "wrong") : ""}`}
              disabled={picked !== undefined}
              onClick={() => answer("p1", item.id, i, item.answer)}
            >
              {String.fromCharCode(65 + i)}. {picked !== undefined ? s : "Nghe rồi chọn (nội dung hiện sau khi trả lời)"}
            </button>
          ))}
          {picked !== undefined && (
            <div>
              <p className={picked === item.answer ? "ok" : "bad"}>
                {picked === item.answer ? "✓ Đúng rồi!" : `✗ Chưa đúng. Đáp án đúng là ${String.fromCharCode(65 + item.answer)}.`}
              </p>
              <p><strong>Transcript:</strong></p>
              <ol>{item.statements.map((s, i) => <li key={i}>{s}</li>)}</ol>
              <p><strong>Giải thích:</strong> {item.explanation}</p>
            </div>
          )}
          <div className="row" style={{ marginTop: 12 }}>
            <button disabled={itemIdx === 0} onClick={() => setItemIdx(itemIdx - 1)}>← Bài trước</button>
            <button disabled={itemIdx === part1.length - 1} onClick={() => setItemIdx(itemIdx + 1)}>Bài tiếp →</button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Part 2 ----
  if (part === "2") {
    const item = part2[itemIdx];
    const picked = answered[item.id];
    return (
      <div>
        <h1>{titles[part]}</h1>
        <p className="muted">Nghe câu hỏi, chọn câu trả lời phù hợp nhất. Transcript và giải thích chỉ hiện sau khi trả lời.</p>
        {rateBar}
        <div className="card">
          <p>Câu {itemIdx + 1}/{part2.length}</p>
          <button className="primary" onClick={() => play(item.question)}>▶ Nghe câu hỏi</button>
          <button onClick={() => play(item.options.join(" "))}>▶ Nghe 3 câu trả lời</button>
          {item.options.map((o, i) => (
            <button
              key={i}
              className={`opt ${picked === i ? (i === item.answer ? "correct" : "wrong") : ""}`}
              disabled={picked !== undefined}
              onClick={() => answer("p2", item.id, i, item.answer)}
            >
              {String.fromCharCode(65 + i)}. {o}
            </button>
          ))}
          {picked !== undefined && (
            <div>
              <p className={picked === item.answer ? "ok" : "bad"}>
                {picked === item.answer ? "✓ Đúng rồi!" : `✗ Chưa đúng. Đáp án đúng là ${String.fromCharCode(65 + item.answer)}.`}
              </p>
              <p><strong>Câu hỏi:</strong> {item.question}</p>
              <p><strong>Giải thích:</strong> {item.explanation}</p>
            </div>
          )}
          <div className="row" style={{ marginTop: 12 }}>
            <button disabled={itemIdx === 0} onClick={() => setItemIdx(itemIdx - 1)}>← Câu trước</button>
            <button disabled={itemIdx === part2.length - 1} onClick={() => setItemIdx(itemIdx + 1)}>Câu tiếp →</button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Part 3 / 4 ----
  if (!passage) return <p>Không tìm thấy Part này.</p>;
  const partKey: PartKey = part === "3" ? "p3" : "p4";
  const allAnswered = passage.questions.every((q) => answered[q.id] !== undefined);
  return (
    <div>
      <h1>{titles[part]}</h1>
      <p className="muted">Nghe đoạn {part === "3" ? "hội thoại" : "bài nói"} trước, rồi trả lời từng câu hỏi. Transcript đoạn hội thoại chỉ hiện sau khi trả lời đủ 3 câu.</p>
      {rateBar}
      <div className="card">
        <p><strong>{passage.title}</strong> — Đoạn {passageIdx + 1}/{passages.length}</p>
        <button className="primary" onClick={() => play(passage.script.replace(/^(Woman|Man):\s*/gm, ""))}>
          ▶ Nghe đoạn {part === "3" ? "hội thoại" : "bài nói"}
        </button>
        <div className="row" style={{ marginTop: 12 }}>
          <button disabled={passageIdx === 0} onClick={() => setPassageIdx(passageIdx - 1)}>← Đoạn trước</button>
          <button disabled={passageIdx === passages.length - 1} onClick={() => setPassageIdx(passageIdx + 1)}>Đoạn tiếp →</button>
        </div>
      </div>
      {passage.questions.map((q) => {
        const picked = answered[q.id];
        return (
          <div className="card" key={q.id}>
            <p><strong>{q.question}</strong></p>
            <button onClick={() => play(q.question)}>▶ Nghe câu hỏi</button>
            {q.options.map((o, i) => (
              <button
                key={i}
                className={`opt ${picked === i ? (i === q.answer ? "correct" : "wrong") : ""}`}
                disabled={picked !== undefined}
                onClick={() => answer(partKey, q.id, i, q.answer)}
              >
                {String.fromCharCode(65 + i)}. {o}
              </button>
            ))}
            {picked !== undefined && (
              <p><strong>Giải thích:</strong> {q.explanation}</p>
            )}
          </div>
        );
      })}
      {allAnswered && (
        <div className="card">
          <p><strong>Transcript đoạn {part === "3" ? "hội thoại" : "bài nói"}:</strong></p>
          <p>{passage.script}</p>
        </div>
      )}
    </div>
  );
}
