# generateStaticParams 최적화 가이드

## 문제 상황

Next.js 15 App Router에서 동적 라우트(`[slug]`)를 사용할 때, `generateStaticParams` 함수를 비효율적으로 구현하여 빌드 시간이 길어지는 문제가 발생했습니다.

## generateStaticParams란?

`generateStaticParams`는 Next.js가 **빌드 타임에 자동으로 호출**하는 특수 함수입니다.

### 역할

- 동적 라우트에서 어떤 경로들을 미리 생성할지 Next.js에 알려줌
- Static Site Generation (SSG) 활성화
- 빌드 시 HTML 파일을 미리 생성하여 초고속 로딩 제공

### 동작 방식

```bash
# generateStaticParams 있을 때 (✅ 권장)
next build 실행 →
├─ /posts/dummy1  (미리 생성)
├─ /posts/dummy2  (미리 생성)
└─ /posts/dummy3  (미리 생성)
→ 사용자 접속 시 즉시 HTML 제공 ⚡

# generateStaticParams 없을 때 (❌ 비권장)
next build 실행 →
└─ /posts/[slug]  (on-demand)
→ 사용자 접속 시마다 서버에서 생성 🐌
```

## 문제 코드

### ❌ 비효율적인 구현

```tsx
// app/posts/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts(); // ❌ 문제!

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

**문제점:**

1. `getAllPosts()`는 모든 마크다운 파일을 HTML로 변환
2. 빌드 시마다 불필요한 무거운 파싱 작업 수행
3. `slug`만 필요한데 전체 컨텐츠를 처리

**성능 영향:**

- 포스트 3개: 수 초
- 포스트 100개: 수 분 소요 가능

## 해결 방법

### ✅ 최적화된 구현

```tsx
// app/posts/[slug]/page.tsx
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}
```

**개선사항:**

1. `getPostSlugs()`는 파일명만 읽음 (파싱 없음)
2. `async` 불필요 (동기 함수)
3. 빌드 시간 대폭 단축

### lib/posts.ts 준비

```typescript
// getPostSlugs를 export해야 함
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
```

## 추가 트러블슈팅

### 에러: 'await' has no effect on the type of this expression

```tsx
export async function generateStaticParams() {
  const posts = await getPostSlugs(); // ❌ 에러!
  return posts;
}
```

**원인:**

- `getPostSlugs()`는 동기 함수 (`async` 아님)
- `Promise`를 반환하지 않으므로 `await` 불필요

**해결:**

```tsx
export function generateStaticParams() {
  const slugs = getPostSlugs(); // ✅ await 제거
  return slugs.map((slug) => ({ slug }));
}
```

### 에러: 반환 타입 불일치

```tsx
export function generateStaticParams() {
  return getPostSlugs(); // ❌ string[] 반환
}
```

**원인:**

- Next.js는 `{ [key: string]: string }[]` 형식 기대
- `string[]`을 직접 반환하면 타입 에러

**해결:**

```tsx
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug })); // ✅ 올바른 형식
}
```

## 성능 비교

| 항목          | getAllPosts() | getPostSlugs() |
| ------------- | ------------- | -------------- |
| 파일 읽기     | ✅            | ✅             |
| 마크다운 파싱 | ✅ (불필요)   | ❌             |
| HTML 변환     | ✅ (불필요)   | ❌             |
| 목차 생성     | ✅ (불필요)   | ❌             |
| 빌드 시간     | 🐌 느림       | ⚡ 빠름        |
| 메모리 사용   | 💾 많음       | 💾 적음        |

## 최종 권장 코드

```tsx
// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import PostDetail from '@/components/posts/PostDetail';
import { getPostBySlug, getPostSlugs } from '@/lib/posts';

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ✅ 최적화된 정적 경로 생성
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
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

// 페이지 컴포넌트
const PostDetailPage = async ({ params }: PostDetailPageProps) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
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
```

## 핵심 요약

1. **`generateStaticParams`는 필수** - SSG를 위해 반드시 유지
2. **내부 구현은 최적화** - 무거운 함수 대신 가벼운 함수 사용
3. **동기 함수는 `async`/`await` 불필요**
4. **반환 형식 주의** - 객체 배열 `{ slug: string }[]` 형태로 반환

## 참고 자료

- [Next.js generateStaticParams 공식 문서](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Static Site Generation (SSG) 개념](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation)
