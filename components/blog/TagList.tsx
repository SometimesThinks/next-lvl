import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { getTagsByCategory } from '@/lib/tags';

interface TagListProps {
  activeTag?: string;
}

const TagList = async ({ activeTag }: TagListProps) => {
  const tagCategories = await getTagsByCategory();

  if (tagCategories.length === 0) {
    return null;
  }

  return (
    <section className="pl-4">
      <h3 className="mb-3 text-lg font-semibold">Tags</h3>
      <div className="space-y-4">
        {tagCategories.map((category) => (
          <section key={category.name}>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">{category.name}</h4>
            <div className="space-y-2">
              {category.tags.map((tag) => {
                const isActive = activeTag === tag.slug;
                return (
                  <section key={tag.slug}>
                    <Link href={isActive ? '/' : `/?tag=${tag.slug}`} className="group">
                      <Badge
                        variant={isActive ? 'default' : 'outline'}
                        className="text-xs transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                      >
                        {tag.name}
                        <span className="ml-1 opacity-70">({tag.count})</span>
                      </Badge>
                    </Link>
                  </section>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};

export default TagList;
