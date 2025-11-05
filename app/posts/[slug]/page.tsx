import { notFound } from 'next/navigation';

import PostDetail from '@/components/posts/PostDetail';
import { getPostBySlug, getPostSlugs } from '@/lib/posts';

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// 메타데이터 생성
export async function generateMetadata({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags.join(', '),
  };
}

const PostDetailPage = async ({ params }: PostDetailPageProps) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  return (
    <div className="my-16 mb-[50vh]">
      <main>
        <PostDetail post={post} />
      </main>
    </div>
  );
};

export default PostDetailPage;
