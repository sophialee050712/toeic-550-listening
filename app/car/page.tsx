"use client";

import { useEffect, useRef, useState } from "react";
import { buildCarItems } from "../../lib/data";
import { loadProgress, saveProgress, withSession } from "../../lib/store";
import { speak, stopSpeech } from "../../lib/speech";

const items = buildCarItems();

export default function CarPage() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const playingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const p = loadProgress();
    setIndex(Math.min(p.carIndex || 0, items.length - 1));
    indexRef.current = Math.min(p.carIndex || 0, items.length - 1);
    return () => { playingRef.current = false; stopSpeech(); if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const saveIndex = (i: number) => {
    const p = withSession(loadProgress());
    p.carIndex = i;
    saveProgress(p);
  };

  const playItem = (i: number) => {
    if (!playingRef.current) return;
    const item = items[i];
    if (!item) { setPlaying(false); playingRef.current = false; return; }
    setIndex(i);
    indexRef.current = i;
    saveIndex(i);
    // Step 1: speak the question / script.
    speak(item.speak, {
      rate,
      lang: "en-US",
      onEnd: () => {
        if (!playingRef.current) return;
        // Step 2: pause so the learner can think of the answer.
        timerRef.current = setTimeout(() => {
          if (!playingRef.current) return;
          // Step 3: speak the answer, then advance.
          speak(item.answerSpeak, {
            rate,
            lang: "en-US",
            onEnd: () => {
              if (!playingRef.current) return;
              const p = withSession(loadProgress());
              p.carCompleted = (p.carCompleted || 0) + 1;
              saveProgress(p);
              const next = i + 1;
              if (next >= items.length) {
                setPlaying(false);
                playingRef.current = false;
                saveIndex(0);
              } else {
                playItem(next);
              }
            },
          });
        }, 4000);
      },
    });
  };

  const start = () => {
    playingRef.current = true;
    setPlaying(true);
    playItem(indexRef.current);
  };
  const pause = () => {
    playingRef.current = false;
    setPlaying(false);
    stopSpeech();
    if (timerRef.current) clearTimeout(timerRef.current);
  };
  const restart = () => {
    pause();
    indexRef.current = 0;
    setIndex(0);
    saveIndex(0);
  };

  const item = items[index];
  return (
    <div>
      <h1>Chế độ ô tô</h1>
      <div className="warn">
        <strong>⚠️ An toàn khi lái xe:</strong> Chỉ bấm Bắt đầu trước khi xe chạy hoặc khi đã dừng hẳn.
        Trong khi lái, <strong>không chạm vào điện thoại</strong> — dùng nút phát/dừng/chuyển bài trên vô lăng hoặc ra lệnh Siri.
        App này là web app, không phải app CarPlay riêng; tiếng sẽ phát qua loa xe bằng CarPlay hoặc Bluetooth.
      </div>
      <p className="muted">
        Playlist có {items.length} mục (câu hỏi Part 2, câu mô tả Part 1 và từ vựng). Mỗi mục: nghe câu hỏi → dừng 4 giây để bạn
        nghĩ đáp án trong đầu → nghe đáp án. Hết playlist, bấm Bắt đầu lại để nghe vòng tiếp theo cho đủ 60 phút.
        Vị trí đang nghe được lưu tự động để lần sau nghe tiếp.
      </p>
      <div className="row">
        <span>Tốc độ:</span>
        <button className={rate === 0.75 ? "primary" : ""} onClick={() => setRate(0.75)}>0.75x</button>
        <button className={rate === 1 ? "primary" : ""} onClick={() => setRate(1)}>1x</button>
      </div>
      <div className="card" style={{ textAlign: "center", padding: 24 }}>
        <p className="muted">Đang ở mục {index + 1}/{items.length}</p>
        <div className="big" style={{ fontSize: 20 }}>{item.title}</div>
        <p>{playing ? "▶ Đang phát… (nghe câu hỏi, nghĩ đáp án, rồi nghe đáp án)" : "⏸ Đang dừng"}</p>
        {!playing ? (
          <button className="primary" style={{ fontSize: 22, padding: "16px 32px" }} onClick={start}>▶ BẮT ĐẦU</button>
        ) : (
          <button style={{ fontSize: 22, padding: "16px 32px" }} onClick={pause}>⏸ TẠM DỪNG</button>
        )}
        <div className="row" style={{ justifyContent: "center", marginTop: 14 }}>
          <button onClick={() => { pause(); const ni = Math.max(0, index - 1); indexRef.current = ni; setIndex(ni); saveIndex(ni); }}>← Mục trước</button>
          <button onClick={() => { pause(); const ni = Math.min(items.length - 1, index + 1); indexRef.current = ni; setIndex(ni); saveIndex(ni); }}>Mục tiếp →</button>
          <button onClick={restart}>Nghe lại từ đầu</button>
        </div>
      </div>
      <p className="muted">
        Giới hạn đã biết của bản MVP này: audio dùng giọng đọc của trình duyệt (SpeechSynthesis), không phải file MP3 tạo sẵn.
        Trên iPhone, nếu khóa màn hình hoặc chuyển app khác, giọng đọc có thể bị ngắt — đó là lý do bản sau cần file MP3 tạo sẵn
        để phát nền ổn định qua CarPlay/Bluetooth. Xem báo cáo bàn giao để biết đầy đủ các giới hạn.
      </p>
      <h2>Danh sách playlist</h2>
      {items.map((it, i) => (
        <div className="card" key={it.id} style={{ padding: "10px 14px", background: i === index ? "#eef2ff" : "#fff" }}>
          {i + 1}. {it.title} {i === index ? "← đang ở đây" : ""}
        </div>
      ))}
    </div>
  );
}
