# 게시글 날짜가 `1970-01-01`로 표시되는 문제

## 배경
- 개발 모드에서는 블로그 포스트의 날짜가 정상 표시되지만, Vercel 배포 페이지에서는 `1970-01-01`(Unix epoch)으로 고정되는 현상이 발생했다.
- 기존 코드에서는 마크다운 파일의 frontmatter에 `date`가 없을 경우 `fs.statSync`로 얻은 파일 메타데이터로 날짜를 대체했다.
- macOS 개발 환경에서는 `stats.birthtime`이 유효해 문제가 드러나지 않았지만, Vercel(리눅스 기반) 빌드에서는 해당 값이 항상 epoch으로 채워지면서 오류가 노출되었다.

## 원인 분석
- **`birthtime` 신뢰 불가**: 리눅스 파일시스템은 파일 생성 시각을 보존하지 않는 경우가 많아 `birthtime`이 0(=1970-01-01)으로 채워진다.
- **`mtime`도 불안정**: 파일 내용이 조금만 수정되거나 배포 과정에서 복사되어도 최신 빌드 시각으로 갱신되어 게시 날짜로 쓰기 부적절하다.
- **frontmatter 미기입**: 일부 포스트는 `date` 필드를 정의하지 않아 파일 메타데이터에 의존할 수밖에 없는 상태였다.

## 적용한 해결책
- `lib/posts.ts`의 `getPostBySlug`, `getAllPostListItems`에서 파일 메타데이터 fallback을 `stats.ctime.toISOString()`으로 교체했다.
  - `ctime`은 메타데이터 변경 시각으로 완벽하지는 않지만, 리눅스 환경에서 `birthtime`보다 생성 시점과 가까운 값을 제공한다.
- frontmatter 템플릿에 `date`를 추가하고 VS Code 스니펫으로 기본값을 쉽게 입력하도록 구성했다.
- `date` 형식이 잘못되었을 가능성에 대비해 `Date.parse`로 검증 후 실패 시 fallback을 사용하도록 가드 로직을 보강했다.

```117:120:lib/posts.ts
    const stats = fs.statSync(fullPath);
    const fileDate = stats.ctime.toISOString();
    const frontmatterDate = data.date;
    const fallbackDate = Date.parse(frontmatterDate) ? frontmatterDate : fileDate;
```

```157:160:lib/posts.ts
        const stats = fs.statSync(fullPath);
        const fileDate = stats.ctime.toISOString();
        const frontmatterDate = data.date;
        const fallbackDate = Date.parse(frontmatterDate) ? frontmatterDate : fileDate;
```

## 검증
- frontmatter가 있는 포스트는 지정한 날짜를 그대로 렌더링한다.
- frontmatter가 비어 있거나 형식을 일부러 깨트렸을 때 `ctime` 기반 fallback이 적용되는지 로컬/배포 환경에서 확인한다.

## 추가 고려 사항
- `Date.parse`는 `'1970-01-01'`처럼 truthy가 아닌 값도 반환할 수 있으므로, 필요하다면 `Number.isNaN(Date.parse(frontmatterDate))` 방식으로 더 명확한 검증을 고려한다.
- 장기적으로는 게시 일정 관리와 정렬 일관성을 위해 모든 포스트에 명시적인 ISO 날짜를 기록하는 것을 권장한다.

