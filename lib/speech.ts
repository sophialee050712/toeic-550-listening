// Browser SpeechSynthesis wrapper. All audio in this MVP is generated on-device
// by the browser; there are no MP3 files and no server-side audio.
export type SpeakOptions = {
  rate?: number;
  lang?: string;
  onEnd?: () => void;
  onError?: () => void;
};

function pickVoice(lang: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase()) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(lang.split("-")[0].toLowerCase())) ||
    null
  );
}

export function speak(text: string, opts: SpeakOptions = {}): () => void {
  if (typeof window === "undefined" || !window.speechSynthesis) return () => {};
  const synth = window.speechSynthesis;
  // Cancel any queued utterance so Play always starts cleanly.
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = opts.lang || "en-US";
  u.rate = opts.rate || 1;
  const voice = pickVoice(u.lang);
  if (voice) u.voice = voice;
  if (opts.onEnd) u.onend = opts.onEnd;
  if (opts.onError) u.onerror = opts.onError;
  synth.speak(u);
  return () => synth.cancel();
}

export function stopSpeech() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
