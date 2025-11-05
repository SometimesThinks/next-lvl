import { getAllPostListItems } from './posts';

export interface TagWithCount {
  name: string;
  count: number;
  slug: string;
}

export interface TagCategory {
  name: string;
  tags: TagWithCount[];
}

// 태그 카테고리별 분류
export const TAG_CATEGORIES = {
  Frontend: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'CSS', 'Tailwind CSS'],
  Backend: ['Node.js', 'Express', 'Database', 'API'],
  DevOps: ['Docker', 'AWS', 'CI/CD', 'Deployment'],
  General: ['Web Development', 'Tutorial', 'Tips', 'Career', 'Learning'],
} as const;

// 모든 태그를 평면화
export const AVAILABLE_TAGS = Object.values(TAG_CATEGORIES).flat();

// 태그별 포스트 수 계산 (동적)
export const getTagsWithCount = async (): Promise<TagWithCount[]> => {
  const posts = await getAllPostListItems();

  // 모든 포스트의 태그를 수집
  const allTags = posts.flatMap((post) => post.tags);

  // 태그별 개수 계산
  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // 사용 가능한 태그만 필터링하고 정렬
  return AVAILABLE_TAGS.filter((tag) => tagCounts[tag] && tagCounts[tag] > 0)
    .map((tag) => ({
      name: tag,
      count: tagCounts[tag],
      slug: tag.toLowerCase().replace(/\s+/g, '-'),
    }))
    .sort((a, b) => (b.count || 0) - (a.count || 0)) as TagWithCount[]; // 개수 순으로 정렬
};

// 카테고리별로 태그 그룹화
export const getTagsByCategory = async (): Promise<TagCategory[]> => {
  const allTags = await getTagsWithCount();

  return Object.entries(TAG_CATEGORIES)
    .map(([categoryName, categoryTags]) => ({
      name: categoryName,
      tags: allTags.filter((tag) => (categoryTags as readonly string[]).includes(tag.name)),
    }))
    .filter((category) => category.tags.length > 0); // 태그가 있는 카테고리만 반환
};
