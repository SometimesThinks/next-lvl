import TableOfContents from '@/components/posts/TableOfContents';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Post } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

interface PostDetailProps {
  post: Post;
}

const PostDetail = async ({ post }: PostDetailProps) => {
  return (
    <div className="grid min-h-screen grid-cols-6">
      <div className="col-span-4 col-start-2 max-w-4xl justify-self-center">
        <Card className="border-b bg-background text-foreground dark:bg-background dark:text-foreground">
          <CardContent>
            <div
              className="prose-foreground markdown-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
          <CardFooter className="flex-wrap items-center gap-2 text-sm">
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
      </div>
      {/* 목차 */}
      <div className="col-span-1 col-start-6 hidden lg:block">
        <div className="sticky top-72">
          <TableOfContents toc={post.toc} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
