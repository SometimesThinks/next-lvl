import Link from 'next/link';

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

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={hasPrev ? buildHref(basePath, currentPage - 1, tag) : undefined}
            aria-disabled={!hasPrev}
            tabIndex={hasPrev ? 0 : -1}
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink asChild isActive={page === currentPage} size="default">
              <Link href={buildHref(basePath, page, tag)}>{page}</Link>
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={hasNext ? buildHref(basePath, currentPage + 1, tag) : undefined}
            aria-disabled={!hasNext}
            tabIndex={hasNext ? 0 : -1}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationBar;
