import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationBarProps {
  totalPages: number;
  currentPage: number;
  basePath: string;
  tag?: string;
}

const WINDOW_SIZE = 5;

const buildHref = (basePath: string, page: number, tag?: string) => {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set('page', page.toString());
  }
  if (tag && tag.trim().length > 0) {
    params.set('tag', tag);
  }
  const query = params.toString();
  return query.length > 0 ? `${basePath}?${query}` : basePath;
};

const PaginationBar = ({ totalPages, currentPage, basePath, tag }: PaginationBarProps) => {
  if (totalPages <= 1) {
    return null;
  }
  const groupStart = Math.floor((currentPage - 1) / WINDOW_SIZE) * WINDOW_SIZE + 1;
  const groupEnd = Math.min(groupStart + WINDOW_SIZE - 1, totalPages);
  const nextGroupPage = groupEnd + 1;
  const prevGroupPage = groupStart - WINDOW_SIZE;

  const visiblePages = Array.from(
    { length: groupEnd - groupStart + 1 },
    (_, index) => groupStart + index,
  );

  const hasPrevGroup = groupStart > 1;
  const hasNextGroup = groupEnd < totalPages;

  return (
    <Pagination>
      <PaginationContent>
        {/* 이전 페이지 버튼 */}
        <PaginationItem>
          <PaginationPrevious
            href={groupStart > 1 ? buildHref(basePath, prevGroupPage, tag) : '#'}
            aria-disabled={!hasPrevGroup}
            tabIndex={hasPrevGroup ? 0 : -1}
            className={!hasPrevGroup ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>
        {/* 페이지 버튼 */}
        {visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={buildHref(basePath, page, tag)}
              isActive={page === currentPage}
              size="default"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {/* 다음 페이지 버튼 */}
        <PaginationItem>
          <PaginationNext
            href={groupEnd < totalPages ? buildHref(basePath, nextGroupPage, tag) : '#'}
            aria-disabled={!hasNextGroup}
            tabIndex={hasNextGroup ? 0 : -1}
            className={!hasNextGroup ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationBar;
