import fs from 'fs';
import path from 'path';

import { transformerCopyButton } from '@rehype-pretty/transformers';
import matter from 'gray-matter';
import rehypeExternalLinks from 'rehype-external-links';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import type { Root, Heading, Text } from 'mdast';

// 목차 아이템 타입
export type TocItem = { depth: number; value: string; id: string };

// 목차 수집 함수
function remarkCollectToc(toc: TocItem[]) {
  return () => (tree: Root) => {
    visit(tree, 'heading', (node: Heading) => {
      const text = node.children
        .filter((el): el is Text => el.type === 'text')
        .map((el) => el.value)
        .join(' ');
      const id = text.toLowerCase().replace(/\s+/g, '-');
      // 내부 링크 id 추가 (HTML 속성)
      node.data = { hProperties: { id } };
      toc.push({ depth: node.depth, value: text, id });
    });
  };
}

// 포스트 데이터 타입 정의
export interface Post {
  slug: string;
  title: string;
  tags: string[];
  content: string;
  excerpt: string;
  date: string;
  toc: TocItem[];
}

// 리스트용 경량 포스트 데이터 타입
export interface PostMetadata {
  slug: string;
  title: string;
  tags: string[];
  excerpt: string;
  date: string;
}

// posts 디렉토리 경로
const postsDirectory = path.join(process.cwd(), 'contents', 'posts');

// 모든 포스트 파일명 가져오기
export const getPostSlugs = (): string[] => {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((name) => name.endsWith('.md'))
      .map((name) => name.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
};

// 마크다운을 HTML로 변환하는 함수
const markdownToHtml = async (markdown: string): Promise<{ html: string; toc: TocItem[] }> => {
  const toc: TocItem[] = [];

  const result = await unified()
    .use(remarkParse)
    .use(remarkCollectToc(toc))
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      transformers: [
        transformerCopyButton({
          visibility: 'always',
          feedbackDuration: 3_000,
        }),
      ],
    })
    .use(rehypeExternalLinks, {
      target: '_blank',
      rel: ['noopener', 'noreferrer'],
    })
    .use(rehypeStringify)
    .process(markdown);

  return { html: result.toString(), toc };
};

const getFirstHeading = (markdown: string): string | null => {
  const match = markdown.match(/^#{1,6}\s+(.+)$/m);
  const heading = match?.[1];
  return heading ? heading.trim() : null;
};

const createExcerpt = (markdown: string, titleFromFrontmatter?: string): string => {
  const cleaned = markdown
    .replace(/^#+\s+/gm, '') // 헤더 제거
    .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
    .replace(/\n+/g, ' ') // 줄바꿈을 공백으로
    .trim();

  const titleCandidates = [titleFromFrontmatter?.trim(), getFirstHeading(markdown)].filter(
    (candidate): candidate is string => Boolean(candidate),
  );

  let excerptSource = cleaned;

  for (const candidate of titleCandidates) {
    const normalizedCandidate = candidate.toLowerCase();
    if (excerptSource.toLowerCase().startsWith(normalizedCandidate)) {
      excerptSource = excerptSource.slice(candidate.length).trimStart();
      break;
    }
  }

  const baseText = excerptSource.length > 0 ? excerptSource : cleaned;
  return baseText.substring(0, 150) + '...';
};

// 특정 슬러그로 포스트 데이터 가져오기
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // excerpt 생성 (첫 150자)
    const excerpt = createExcerpt(content, data.title);

    // 마크다운을 HTML로 변환
    const { html: htmlContent, toc } = await markdownToHtml(content);

    // 파일 생성일 가져오기 (frontmatter date가 없으면 파일 생성일 사용)
    const stats = fs.statSync(fullPath);
    const fileDate = stats.ctime.toISOString();
    const frontmatterDate = data.date;
    const fallbackDate =
      typeof frontmatterDate === 'string' && !Number.isNaN(Date.parse(frontmatterDate))
        ? frontmatterDate
        : fileDate;

    return {
      slug,
      title: data.title || 'Untitled',
      tags: data.tags || [],
      content: htmlContent,
      excerpt,
      date: fallbackDate,
      toc,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
};

// 리스트용 경량 포스트 데이터 가져오기
export const getAllPostListItems = async (): Promise<PostMetadata[]> => {
  const slugs = getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const fullPath = path.join(postsDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // excerpt 생성 (첫 150자)
        const excerpt = createExcerpt(content, data.title);

        // 파일 생성일 가져오기 (frontmatter date가 없으면 파일 생성일 사용)
        const stats = fs.statSync(fullPath);
        const fileDate = stats.ctime.toISOString();
        const frontmatterDate = data.date;
        const fallbackDate =
          typeof frontmatterDate === 'string' && !Number.isNaN(Date.parse(frontmatterDate))
            ? frontmatterDate
            : fileDate;

        return {
          slug,
          title: data.title || 'Untitled',
          tags: data.tags || [],
          excerpt,
          date: fallbackDate,
        };
      } catch (error) {
        console.error(`Error reading post ${slug}:`, error);
        return null;
      }
    }),
  );

  // null 값 제거하고 날짜순으로 정렬
  return posts
    .filter((post): post is PostMetadata => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
