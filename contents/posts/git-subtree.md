---
title: '[Git] 여러 repository를 subtree로 합치기'
date: '2025-12-29T04:25:58'
tags: ['Git']
---

# [Git] 여러 repository를 subtree로 합치기

## 1. 배경

지금까지 새로운 기술을 공부할 때마다 레포지토리를 따로 만들었다.  
그러다 보니 쓸 데 없이 많은 레포지토리가 있다고 느껴졌다.  
원래 안 쓰는 물건은 버리고 정리하는 걸 좋아하는 성정상, 이것도 깔끔하게 정리하고 싶었다.

### 목표

목표는 learning이라는 하나의 레포지토리만을 남겨둔 채, 나머지 레포지토리들은 종류별로 폴더로 관리하는 거였다.  
동시에 공부했던 기록과 흔적은 남겨두고 싶었다.  
그게 아니었다면 .git 파일만 지운 후에 복사, 붙여넣기를 해도 됐을 것이다.

```text
learning/
├── course/
│   ├── example1/
│   └── example2/
└── book/
    └── example2/
```

## 2. subtree vs submodule?

구글링을 하다 보니, 선택지는 subtree와 submodule인 듯 보였다.

### submodule

한 레포지토리 안에 다른 레포지토리를 **참조**하여 하위 디렉토리로 추가한다.  
코드를 직접 복사하는 게 아닌 참조 링크를 추가하여 외부 종속성을 관리하는 형식이다.  
변경 사항은 레포지토리별로 따로 관리되고 실시간으로 변경 사항이 반영되지는 않는다.  
따라서, 특정 버전을 참고할 때 유용하다.

### subtree

한 레포지토리 안에 다른 레포지토리의 코드를 **복사**해서 하위 디렉토리로 추가한다.  
일반적인 폴더처럼 관리할 수 있어서 편하고, 커밋 기록도 함께 가져올 수 있다.  
다만, squash 옵션을 사용하면 원본 커밋 기록은 하나의 커밋으로 압축된다.

### subtree 선택 이유

내가 이번 정리를 통해 하고 싶었던 가장 큰 목적은 **레포지토리 수를 하나로** 만드는 거였다. + **기록 유지**  
그런데 submodule은 참조하는 형태로 관리하며, 커밋 기록도 따로 관리되니 내 목적에 맞지 않았다.  
또한, 원본 레포지토리를 삭제한 후 로컬에 남은 하위 레포지토리와의 통합이 매우 귀찮은 과정이 예상되었다.  
프로젝트를 진행 중에 **외부 라이브러리의 특정 버전을 참조해야하는 상황**이라면 **submodule**을 사용했을 것 같다.  
하지만 현재는 **단순히 기록용으로 남겨놓은 레포지토리들의 통합**이기 때문에 subtree가 더 적합하다고 생각했다.

## 3. 진행 과정

```terminal
git remote add -f vitest https://github.com/SometimesThinks/course-vitest.git
```

통합하고자 하는 원격 레포지토리를 fetch 옵션과 함께 등록한다.

```terminal
git subtree add --prefix course/vitest --squash vitest main
```

통합하면서 커밋 기록은 하나로 깔끔하게 추가하기 위해 --squash 옵션을 사용해서 subtree를 추가한다.

```terminal
git commit --amend -m "chore: vitest 강의 레포지토리 병합"
```

커밋 메시지를 깔끔하게 수정하기 위해 사용했다.

```terminal
git remote remove vitest
```

더 이상 필요 없는 원격 레포지토리를 제거했다.  
그리고 원본 레포지토리도 삭제함으로써 마무리했다.

## 4. 마무리

별 거 아니라는 생각에 오랫동안 미뤄왔는데, 막상 블로그를 쓰면서 하려 하니 시간이 꽤 걸렸다.  
그래도 하고 나니 내심 뿌듯하고 깔끔해진 기분이다.

---

**참고**  
[https://git-memo.readthedocs.io/en/latest/subtree.html#adding-a-subtree-to-a-project](https://git-memo.readthedocs.io/en/latest/subtree.html#adding-a-subtree-to-a-project)  
[https://www.atlassian.com/ko/git/tutorials/git-submodule](https://www.atlassian.com/ko/git/tutorials/git-submodule)  
[https://git-scm.com/book/en/v2/Git-Tools-Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
