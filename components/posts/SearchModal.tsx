'use client';

import { Search, SearchX, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { PostMetadata } from '@/lib/posts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: PostMetadata[];
}

const SearchModal = ({ isOpen, onClose, posts }: SearchModalProps) => {
  const [query, setQuery] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState<PostMetadata[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  // 검색어에 따른 포스트 필터링
  useEffect(() => {
    if (query.trim()) {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts.slice(0, 5)); // 최근 포스트 5개 표시
    }
    setSelectedIndex(-1); // 검색어 변경 시 선택 초기화
  }, [query, posts]);
  // 모달이 열릴 때 입력창에 포커스
  useEffect(() => {
    if (isOpen) {
      console.log(navigator.userAgent);
      inputRef.current?.focus();
    } else {
      setQuery('');
    }
  }, [isOpen]);
  // 선택된 항목 스크롤
  useEffect(() => {
    if (selectedIndex >= 0 && resultRefs.current[selectedIndex]) {
      resultRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);
  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prev) => (prev < filteredPosts.length - 1 ? prev + 1 : 0));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredPosts.length - 1));
      } else if (event.key === 'Enter' && selectedIndex >= 0) {
        event.preventDefault();
        const selectedPost = filteredPosts[selectedIndex];
        if (selectedPost) {
          window.location.href = `/posts/${selectedPost.slug}`;
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // 스크롤 방지
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, filteredPosts, selectedIndex]);

  const handlePostClick = () => {
    onClose();
  };
  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-16"
      onClick={onClose}
    >
      <div className="mx-4 w-full max-w-2xl">
        <div className="rounded-lg border bg-background shadow-lg">
          {/* 검색 입력창 */}
          <div className="flex items-center border-b px-4 py-3">
            <Search className="mr-3 h-5 w-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <Button onClick={onClose} variant="outline" size="sm" className="text-muted-foreground">
              esc
            </Button>
          </div>
          {/* 검색 결과 */}
          <div className="max-h-96 overflow-y-auto">
            {filteredPosts.length > 0 ? (
              <div className="divide-y">
                {filteredPosts.map((post, index) => (
                  <Link
                    key={post.slug}
                    ref={(el) => {
                      resultRefs.current[index] = el;
                    }}
                    href={`/posts/${post.slug}`}
                    onClick={handlePostClick}
                    className={`block px-4 py-4 transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ${
                      selectedIndex === index ? 'bg-accent text-accent-foreground' : ''
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="line-clamp-1 font-medium text-foreground">{post.title}</h3>
                        <span className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {new Date(post.date).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                          >
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-muted-foreground">
                <SearchX className="mx-auto mb-6 h-8 w-8 opacity-50" />
                <p>No results found for &quot;{query}&quot;</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
