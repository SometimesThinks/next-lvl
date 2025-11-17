'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import SearchModal from '@/components/posts/SearchModal';
import { Kbd } from '@/components/ui/kbd';
import ThemeToggle from '@/components/ui/theme-toggle';
import { PostMetadata } from '@/lib/posts';

interface HeaderProps {
  searchPosts: PostMetadata[];
}

const Header = ({ searchPosts }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMac, setIsMac] = useState<boolean>(false);
  // 전역 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ctrl + k 또는 cmd + k (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  // 운영체제 확인
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsMac(/mac|iphone|ipad|ipod/.test(userAgent));
  }, []);

  return (
    <>
      <header className="itmes-center border-b-2 bg-background px-8 py-4 text-foreground dark:bg-background dark:text-foreground">
        <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4">
          {/* 홈 타이틀 박스 */}
          <div className="ml-4 flex items-center gap-4">
            <Link href="/" className="text-xl font-bold">
              Next Lvl
            </Link>
            <span className="text-sm text-muted-foreground">on to the next level</span>
          </div>
          <div />
          {/* 오른쪽 액션 버튼 박스 */}
          <div className="flex cursor-pointer items-center justify-end gap-2">
            <div
              className="hover flex items-center justify-between gap-2 rounded-md bg-muted p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <p className="mr-6 text-sm">search...</p>
              <Kbd className="">{isMac ? 'cmd + k' : 'ctrl + k'}</Kbd>
            </div>
            {/* 테마 토글 */}
            <ThemeToggle />
          </div>
        </div>
      </header>
      {/* 검색 버튼 */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={searchPosts}
      />
    </>
  );
};

export default Header;
