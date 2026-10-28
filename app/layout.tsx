import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import SyncBar from "./components/SyncBar";

export const metadata: Metadata = {
  title: "Luyện nghe TOEIC 550",
  description: "App luyện nghe TOEIC mục tiêu 550 — đồng bộ tiến độ iPhone và máy tính qua Supabase khi đã đăng nhập.",
};

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/part/1", label: "Part 1" },
  { href: "/part/2", label: "Part 2" },
  { href: "/part/3", label: "Part 3" },
  { href: "/part/4", label: "Part 4" },
  { href: "/dictation", label: "Nghe chép" },
  { href: "/vocab", label: "Từ vựng" },
  { href: "/car", label: "Chế độ ô tô" },
  { href: "/mock", label: "Nhập mock" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <header className="topbar">
          <Link href="/" className="brand">🎧 TOEIC 550 — Luyện nghe</Link>
          <nav className="nav">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </nav>
        </header>
        <SyncBar />
        <main className="wrap">{children}</main>
        <footer className="foot">
          <p>
            Nội dung luyện tập trong app là nội dung tự viết, mô phỏng format TOEIC — không phải đề thi thật của ETS.
            Điểm trong app chỉ là ước lượng luyện tập, không phải điểm thi thật. Khi chưa đăng nhập đồng bộ, tiến độ chỉ lưu trên thiết bị này (localStorage); khi đã đăng nhập, tiến độ đồng bộ lên Supabase của bạn.
          </p>
        </footer>
      </body>
    </html>
  );
}
