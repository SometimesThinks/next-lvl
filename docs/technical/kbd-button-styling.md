## Kbd Button Styling Notes

### 문제
- 검색 모달에서 `Button asChild`로 감싼 `<Kbd>`가 버튼보다 작아서 hover 영역이 어긋남.
- 기본 `Kbd` 컴포넌트에 `pointer-events-none`이 설정되어 있어 hover 자체가 적용되지 않음.

### 해결 전략
1. **Button 스타일을 그대로 쓰기**
   ```tsx
    <Button onClick={onClose} variant="outline" size="sm" className="gap-1 px-2">
      <Kbd>esc</Kbd>
    </Button>
   ```
   - 버튼에 맞춰 Kbd를 넣으면 hover, focus 스타일을 모두 재사용할 수 있다.

2. **Kbd 기본 스타일 조정**
   - `components/ui/kbd.tsx`에서 `pointer-events-none`을 제거하고, 버튼과 동일한 패딩/배경/hover 스타일을 직접 부여한다.
   ```tsx
   <kbd
     className={cn(
       'inline-flex h-8 min-w-8 items-center justify-center rounded-md border bg-background px-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
       className,
     )}
   />
   ```

3. **Button Variants 재사용**
   - `buttonVariants({ variant: 'outline', size: 'sm' })`를 가져와 `div`에 직접 적용하면 Button과 완전히 동일한 스타일을 낼 수 있다.

### 권장 패턴
- `Button`과 동일한 시각 경험을 원한다면 버튼 컴포넌트의 변형 옵션(`variant`, `size`)을 그대로 사용한다.
- Kbd를 독립 버튼처럼 쓰고 싶다면 기본 클래스에서 hover/padding/rounded 값을 맞추고 `pointer-events`를 허용한다.
- `asChild`를 사용할 때는 자식 요소가 `className`을 제대로 전달받는지, hover 영역이 전부 채워지는지 확인한다 (`w-full h-full` 등 보조 클래스 활용).

### 요약
- Hover가 안 먹는 이유는 Kbd의 `pointer-events-none`과 버튼과의 사이즈 불일치 때문이었다.
- Button 스타일을 재사용하거나 Kbd를 커스텀하면 호버, 클릭 영역을 완전히 동일하게 만들 수 있다.


