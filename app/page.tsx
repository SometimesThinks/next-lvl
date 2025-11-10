import Profile from '@/components/blog/Profile';
import TagList from '@/components/blog/TagList';
import PaginationBar from '@/components/posts/Pagination';
import PostList from '@/components/posts/PostList';
import { getAllPostListItems } from '@/lib/posts';

interface HomeProps {
  searchParams: Promise<{ tag?: string; page?: string }>;
}

const PAGINATION_SIZE = 5;

const Home = async ({ searchParams }: HomeProps) => {
  const { tag, page = '1' } = await searchParams;
  const allPosts = await getAllPostListItems();

  // 태그 필터링
  const filteredPosts = tag
    ? allPosts.filter((post) =>
        post.tags.some((postTag) => postTag.toLowerCase().replace(/\s+/g, '-') === tag),
      )
    : allPosts;
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / PAGINATION_SIZE);
  const currentPage = Math.min(Number(page), totalPages);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * PAGINATION_SIZE,
    currentPage * PAGINATION_SIZE,
  );

  return (
    <div className="my-16 mb-[50vh] grid grid-cols-1 justify-center lg:grid-cols-6">
      <main className="lg:col-span-3 lg:col-start-2">
        <PostList posts={paginatedPosts} />
        <PaginationBar
          totalPages={totalPages}
          currentPage={currentPage}
          basePath="/"
          tag={tag || ''}
        />
      </main>
      <aside className="hidden space-y-6 lg:col-span-1 lg:col-start-5 lg:block">
        <Profile />
        <TagList activeTag={tag || ''} />
      </aside>
    </div>
  );
};

export default Home;
