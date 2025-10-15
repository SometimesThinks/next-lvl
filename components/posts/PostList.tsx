import { PostMetadata } from '@/lib/posts';

import PostListItem from './PostListItem';

interface PostListProps {
  posts?: PostMetadata[];
}

const PostList = async ({ posts }: PostListProps) => {
  const postList = posts;

  if (postList && postList.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">아직 작성된 포스트가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {postList && postList.map((post) => <PostListItem key={post.slug} post={post} />)}
    </div>
  );
};

export default PostList;
