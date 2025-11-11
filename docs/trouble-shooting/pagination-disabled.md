## Pagination Disabled State

### 문제

- `components/posts/Pagination.tsx`에서 `hasPrev`/`hasNext`가 false일 때 버튼이 비활성처럼 보이지 않고 여전히 클릭이 되는 문제가 있었다.
- `<a>` 요소에는 `disabled` 속성이 없고, `aria-disabled="true"`만으로는 실제 동작 차단이나 스타일 변경이 일어나지 않는다.
- `tabIndex`와 `href`를 어떻게 다뤄야 할지 명확하지 않았다.

### HTML/ARIA 관련 정리

- **`<a>`에는 `disabled` 속성이 없다.** 비활성처럼 보이려면 별도의 로직이 필요하다.
- **`aria-disabled="true"`**: 보조기술(스크린 리더 등)에 “이 링크는 현재 사용할 수 없다”는 정보만 전달한다. 클릭 방지나 스타일 변화는 개발자가 직접 구현해야 한다.
- **`tabIndex={-1}`**: 요소를 탭 순서에서 제외한다. 포커스 이동만 막아 줄 뿐, 마우스 클릭이나 키보드 `Enter`로 실행되는 동작은 따로 차단해야 한다.
- **`href="#"`**: 페이지 최상단으로 이동시키는 앵커 링크다. 비활성 상태에서 임시로 두면 예기치 않은 이동이 생길 수 있다.

### 적용한 해결책

서버 컴포넌트 그대로 유지하면서, 비활성일 때 아래 속성을 함께 내려주는 방식으로 제어했다.

```47:71:components/posts/Pagination.tsx
<PaginationPrevious
  href={hasPrev ? buildHref(basePath, currentPage - 1, tag) : '#'}
  aria-disabled={!hasPrev}
  tabIndex={hasPrev ? 0 : -1}
  className={!hasPrev ? 'pointer-events-none opacity-50' : undefined}
/>
```

`PaginationNext`도 동일한 패턴을 적용했다.

- `href`: 비활성일 때는 `'#'`로 설정해 실제 이동을 막음(추후 `undefined` + `preventDefault()`로 바꿀 수도 있다).
- `aria-disabled`: 보조기술에 비활성임을 명시.
- `tabIndex={-1}`: 키보드 포커스에서 제외.
- `className`에 `pointer-events-none opacity-50`: 마우스 클릭 차단 및 흐린 스타일로 시각적 피드백 제공.

### 선택한 방법의 장점

- **서버 컴포넌트 그대로 사용 가능**: 상태 관리 없이 렌더링 시점의 값으로 제어할 수 있다.
- **명확한 UX**: 시각적 스타일과 포커스/클릭 차단이 동시에 적용되어 사용자에게 “현재 사용할 수 없는 버튼”임이 분명히 전달된다.
- **접근성 준수**: `aria-disabled`로 스크린 리더에 비활성 정보를 제공한다.
- **기존 UI 컴포넌트 재사용**: `PaginationLink`/`PaginationPrevious`/`PaginationNext`를 schdcn 기본 형태로 유지하면서 클래스만 추가하면 되므로 코드가 단순하다.

### 참고 사항

- 비활성일 때 `href='#'` 대신 `undefined`를 전달하고 내부에서 `onClick`으로 `event.preventDefault()`를 호출하는 패턴도 고려할 수 있다.
- 디버깅용 `console.log`는 정리해 두면 빌드 로그가 깔끔하다.
