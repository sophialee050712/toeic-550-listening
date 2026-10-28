# TOEIC 550 — Listening Practice MVP (local)

Local-only Next.js App Router app. Vietnamese UI, English listening content.
No login, no backend, no sync — all progress in the browser's localStorage
under the key `toeic550-v1`.

## Run locally

```bash
cd ~/workspace/goals/toeic-550-listening-practice-app/app
npm install
npm run dev
# open http://localhost:3000
```

Production build check:

```bash
npm run build
npm run start
```

## What is in here

- Dashboard (`/`): today's plan (car 60 min + desk 30 min), streak, Part
  accuracy, and a Red/Yellow/Green readiness panel computed from 5 gates.
  Projected totals are always shown as a range, never as a single exact ETS score.
- Study pages (`/part/1` … `/part/4`): browser SpeechSynthesis audio
  (en-US, 0.75x and 1x), replay, answer choices, transcript + Vietnamese
  explanation only after answering.
- Dictation (`/dictation`): type what you hear, per-word (per-position) scoring.
- Vocabulary (`/vocab`): flashcards; a word counts as mastered after 2 correct reviews.
- Car Mode (`/car`): one big Start button, sequential playlist (question →
  4-second pause → spoken answer), resume position saved in localStorage,
  with an on-screen driving-safety note.
- Mock entry (`/mock`): enter a full mock (correct counts per Part, date,
  speed, paused or not) plus a manually entered reading score, so the
  readiness gates are computed from real data.

## Content counts (all self-written, TOEIC-format, NOT real ETS tests)

- Part 1: 8 items (photo-description, 4 statements each)
- Part 2: 24 question–response items
- Part 3: 4 conversations × 3 questions = 12 questions
- Part 4: 3 talks × 3 questions = 9 questions
- Dictation: 10 sentences
- Vocabulary: 80 workplace words
- Car playlist: 28 items (12 Part 2 + 6 Part 1 + 10 vocabulary)

## Known limitations (do NOT claim otherwise)

- NOT deployed to Vercel and NOT pushed to GitHub in this local build.
- No CarPlay app icon: a web app cannot appear as a CarPlay app. Audio
  routes to car speakers via CarPlay/Bluetooth from the phone browser.
- No locked-iPhone background MP3 playback: this MVP uses browser
  SpeechSynthesis, which iOS Safari can interrupt when the phone locks or
  the app goes to background. Pre-generated MP3 files are required for
  reliable locked-phone car playback (future work, needs a TTS budget).
- Vocabulary bank is 80 words, so readiness gate 3 (600 mastered words)
  honestly cannot pass yet; it shows progress toward 600.
- Listening-score estimates use a transparent rough map (correct × 5,
  ±25), not an ETS conversion table. Projected totals are ranges.
- Progress lives only in one browser's localStorage; clearing browser data
  erases it, and phone ↔ computer are not synced.
