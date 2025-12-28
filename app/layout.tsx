import { ThemeProvider } from 'next-themes';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { getAllPostListItems } from '@/lib/posts';

import type { Metadata } from 'next';

import './globals.css';
// todo: 아이콘 추가, 메타데이터 최적화
export const metadata: Metadata = {
  title: 'Next Lvl | Developer Blog',
  description:
    '호기심 많은 프론트엔드 개발자의 블로그. TypeScript, React.js, Next.js 등 개발 관련 이야기를 나눠요.',
  icons: {
    icon: [{ url: '/favicon.ico' }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchPosts = await getAllPostListItems();

  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class">
          <div className="flex flex-col">
            <Header searchPosts={searchPosts} />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
