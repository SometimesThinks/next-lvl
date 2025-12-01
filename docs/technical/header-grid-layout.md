## Header Grid Layout Notes

### 문제 상황
- 헤더에서 로고, 검색 단축키, 테마 토글을 좌·중·우로 배치하고 싶었지만 `grid`만 선언하고 열 정의(`grid-cols-*`)를 하지 않아 전부 세로로 쌓였다.

### 해결 방법
#### 1. 열 구조를 명시적으로 정의
```tsx
<header className="mx-2 border-b-2 bg-background p-4 text-foreground">
  <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4">
    <div>
      <Link ...>Next Lvl</Link>
      <span>on to the next level</span>
    </div>

    <div className="flex justify-center">
      <div className="flex w-full max-w-md items-center gap-2 rounded-md border px-3 py-2">
        <Search ... />
        <span>검색</span>
        <KbdGroup className="ml-auto">
          <Kbd>⌘ + K</Kbd>
        </KbdGroup>
      </div>
    </div>

    <div className="flex justify-end">
      <ThemeToggle />
    </div>
  </div>
</header>
```
- `grid-cols-[auto,1fr,auto]`: 좌우는 콘텐츠 크기, 가운데는 남은 공간 전체.
- 중앙 열에 `max-w-md`를 주면 검색 박스 폭을 제한하면서도 가로 중앙에 배치된다.

#### 2. 반응형 처리
```tsx
<div className="grid gap-4 sm:grid-cols-[auto,1fr,auto]">
  ...
</div>
```
- 모바일에서는 한 열(`grid-cols-1`), 데스크톱에서는 3열로 전환.

### 흔한 실수
- 부모에 `grid`만 선언하고 `grid-cols`를 지정하지 않으면 기본 1열이어서 세로로 쌓인다.
- 자식 `<div>` 내부에서 또 `grid-cols-2` 등을 선언해도, 부모 컨텍스트에서 열이 나눠지지 않으면 효과가 없다.

### 정리
- 헤더처럼 명확한 3구역이 있을 땐 `grid-cols-[auto,1fr,auto]` 패턴이 직관적이다.
- 검색 박스 폭은 `max-w-*`와 `flex`를 조합하면 된다. grid는 전체 레이아웃, flex는 각 열 내부 정렬에 집중한다.


