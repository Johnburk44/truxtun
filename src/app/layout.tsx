import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="bg-white border-b px-6 py-4 flex gap-6 shadow-sm">
          <Link href="/">Home</Link>
          <Link href="/upload">Upload</Link>
          <Link href="/foundations">Foundations</Link>
          <Link href="/prompts">Prompts</Link>
          <Link href="/settings">Settings</Link>
          <Link href="/crm">CRM</Link>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
