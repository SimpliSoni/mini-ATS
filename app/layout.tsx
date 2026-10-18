import type { Metadata } from 'next';
import { Lora, Open_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  display: 'swap',
});

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TalentFlow | Applicant Tracking System',
  description:
    'Production-grade Applicant Tracking System featuring interactive Kanban pipeline workflow, candidate scoring, multi-filter search, and real-time hiring metrics.',
  keywords: ['ATS', 'Applicant Tracking System', 'Recruiting', 'Kanban', 'Hiring Pipeline', 'TalentFlow'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F5] text-[#373837] font-sans selection:bg-[#ea694e] selection:text-white">
        {children}
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}

