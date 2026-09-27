import "./globals.css";

export const metadata = {
  title: "AI Chat Pro",
  description: "Universal AI chat app built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
