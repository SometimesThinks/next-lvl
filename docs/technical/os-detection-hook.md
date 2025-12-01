## OS 감지 훅 메모

### 배경
- 검색 모달 단축키 안내(`⌘ + K`, `Ctrl + K`)를 OS에 따라 다르게 보여주고 싶었다.
- `navigator` 객체는 클라이언트에서만 접근 가능하므로 SSR 단계에서는 사용할 수 없다.

### 구현 요약
```tsx
import { useEffect, useState } from 'react';

export const useOSType = () => {
  const [osType, setOsType] = useState<'mac' | 'mobile' | 'other'>('other');

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    if (/mobi|android|touch/.test(ua)) {
      setOsType('mobile');
    } else if (navigator.platform.toUpperCase().includes('MAC')) {
      setOsType('mac');
    } else {
      setOsType('other');
    }
  }, []);

  return osType;
};
```

### 포인트
1. **의존성 배열**: `[]`로 두어 마운트 시 한 번만 실행되도록 한다. `isMac` 같은 상태를 의존성에 넣으면 `setState`→재실행 무한 루프가 된다.
2. **단순 분류**: 단축키 목적이라면 `mac / mobile / other` 정도면 충분하다. 비슷한 요구에서 로직을 재사용할 수 있도록 훅으로 분리.
3. **사용 예시**
   ```tsx
   const osType = useOSType();
   const shortcutText = osType === 'mac' ? '⌘ + K' : 'Ctrl + K';
   const showShortcut = osType !== 'mobile';
   ```

### 기타
- 검색 모달이 열릴 때만 확인하고 싶다면 `isOpen` 의존성으로 묶을 수도 있지만, OS는 페이지 전체에서 동일하므로 위처럼 한 번만 체크하는 것이 효율적이다.


