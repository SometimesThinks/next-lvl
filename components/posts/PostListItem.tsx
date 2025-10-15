import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PostMetadata } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

const PostListItem = ({ post }: { post: PostMetadata }) => {
  return (
    <Link href={`/posts/${post.slug}`}>
      <Card className="min-w-lg hover: max-w-3xl border-b bg-background text-foreground dark:bg-background dark:text-foreground">
        <CardHeader className="hover:underline">
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{post.excerpt}</p>
        </CardContent>
        <CardFooter className="ㅅㄷ flex-wrap items-center gap-2 text-sm">
          {post.tags.length > 0 && (
            <>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-2 py-1">
                  {tag}
                </Badge>
              ))}
              <span>•</span>
            </>
          )}
          <span>{formatDate(post.date)}</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PostListItem;
