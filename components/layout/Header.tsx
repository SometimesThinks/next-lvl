'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import SearchModal from '@/components/posts/SearchModal';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/theme-toggle';
import { PostMetadata } from '@/lib/posts';

interface HeaderProps {
  searchPosts: PostMetadata[];
}

const Header = ({ searchPosts }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  // 전역 키보드 이벤트 처리pp
  // todo: 검색 모달 바깥 클릭 시 닫히도록 수정
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K 또는 Cmd+K (Mac)
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

  return (
    <>
      <header className="mx-2 border-b-2 bg-background p-4 text-foreground dark:bg-background dark:text-foreground">
        <div className="flex items-center justify-between">
          {/* 홈 타이틀 박스 */}
          <div className="ml-4 flex items-center gap-4">
            <Link href="/" className="text-xl font-bold">
              Next Lvl
            </Link>
            <span className="text-sm text-muted-foreground">on to the next level</span>
          </div>
          {/* 오른쪽 액션 버튼 박스 */}
          <div className="mr-4 space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-6 w-6" />
            </Button>
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
