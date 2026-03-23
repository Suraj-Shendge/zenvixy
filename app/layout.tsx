import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zenvixy - All Your Tools. One Clean Space.",
  description: "Fast, private, no clutter. Premium web tools for PDF, images, AI, and more.",
  keywords: "PDF tools, image tools, AI tools, compress PDF, resize image, background remover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black antialiased">
        {children}
      </body>
    </html>
  );
}
