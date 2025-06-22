## 배포 링크
https://pyoseunghoon.github.io/front_5th_chapter2-2/index.refactoring.html

## 과제의 핵심취지

- React의 hook 이해하기
- 함수형 프로그래밍에 대한 이해
- 액션과 순수함수의 분리

## 과제에서 꼭 알아가길 바라는 점

- 엔티티를 다루는 상태와 그렇지 않은 상태 - cart, isCartFull vs isShowPopup
- 엔티티를 다루는 컴포넌트와 훅 - CartItemView, useCart(), useProduct()
- 엔티티를 다루지 않는 컴포넌트와 훅 - Button, useRoute, useEvent 등
- 엔티티를 다루는 함수와 그렇지 않은 함수 - calculateCartTotal(cart) vs capaitalize(str)

### 기본과제

- Component에서 비즈니스 로직을 분리하기
- 비즈니스 로직에서 특정 엔티티만 다루는 계산을 분리하기
- 뷰데이터와 엔티티데이터의 분리에 대한 이해
- entities -> features -> UI 계층에 대한 이해

- [x] Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요?
- [x] 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요?
- [x] 계산함수는 순수함수로 작성이 되었나요?
- [x] Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요?
- [x] 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요?
- [x] 계산함수는 순수함수로 작성이 되었나요?
- [x] 특정 Entitiy만 다루는 함수는 분리되어 있나요?
- [x] 특정 Entitiy만 다루는 Component와 UI를 다루는 Component는 분리되어 있나요?
- [x] 데이터 흐름에 맞는 계층구조를 이루고 의존성이 맞게 작성이 되었나요?

### 심화과제

- 재사용 가능한 Custom UI 컴포넌트를 만들어 보기
- 재사용 가능한 Custom 라이브러리 Hook을 만들어 보기
- 재사용 가능한 Custom 유틸 함수를 만들어 보기
- 그래서 엔티티와는 어떤 다른 계층적 특징을 가지는지 이해하기

- [x] UI 컴포넌트 계층과 엔티티 컴포넌트의 계층의 성격이 다르다는 것을 이해하고 적용했는가?
- [x] 엔티티 Hook과 라이브러리 훅과의 계층의 성격이 다르다는 것을 이해하고 적용했는가?
- [x] 엔티티 순수함수와 유틸리티 함수의 계층의 성격이 다르다는 것을 이해하고 적용했는가?

## 과제 셀프회고

<!-- 과제에 대한 회고를 작성해주세요 -->

### 과제를 하면서 내가 제일 신경 쓴 부분은 무엇인가요?

📁 파일 분류 기준

리액트에 대한 기본기가 부족한 상태였기에, 처음부터 구조를 복잡하게 분리하기보다는 간단한 화면 구성부터 도식화하고 차근차근 기능 단위로 분리해 나가는 방식으로 접근했습니다.

![image](https://github.com/user-attachments/assets/7a87e007-1de5-432b-9ca7-f56fc513216b)

이번 과제에서는 ui / models / hooks로 디렉토리가 기본 제공되었기 때문에, 각 목적에 맞게 분류하는 데 집중했습니다.
시간 여유가 있었다면 [FSD 구조](https://feature-sliced.design/)처럼 계층적 디렉토리 구조로 더욱 정리했을 텐데, 아쉽게도 거기까지는 진행하지 못했습니다.

🧩 역할별 코드 배치

* models:
순수 함수만을 담아 테스트 코드 작성이 용이하도록 구성했습니다.

* ui:
렌더링만 담당하며, 상태나 로직은 포함하지 않도록 했습니다.

* hooks:
상태 변화 및 비즈니스 로직을 다루며, UI와 분리하여 관심사를 분리했습니다.

♻️ 재사용 컴포넌트 기준 분리

기존 코드에서는 상품 목록과 같은 반복 렌더링 로직이 하나의 컴포넌트에 몰려 있어 가독성이 떨어졌습니다.
이를 해결하기 위해 for문 내부를 재사용 가능한 컴포넌트로 분리했고,
그 결과 가독성이 향상되고, 컴포넌트 간 책임도 명확해졌으며, 인자 수 및 코드 길이도 줄어들었습니다.

⚙️ 유틸 함수 및 커스텀 훅 추가

직접 유틸 함수와 훅을 만들어보고, 이를 실제 화면에 적용해 보았습니다.

* debounce 유틸 함수
``` js
export function debounce(callback: (...args: any[]) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
```

* useProductSearch 상품 검색 훅
``` js
export const useProductSearch = (products: Product[]) => {
  const [keyword, setKeyword] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // 디바운스 함수 생성 (setFilteredProducts 내부에서 필터링 실행)
  const debouncedFilter = useMemo(
    () =>
      debounce((nextKeyword: string) => {
        if (!nextKeyword.trim()) {
          setFilteredProducts(products);
        } else {
          setFilteredProducts(
            products.filter((product) =>
              product.name.toLowerCase().includes(nextKeyword.toLowerCase()),
            ),
          );
        }
      }, 300),
    [products],
  );

  // keyword 변경 시마다 debounce 적용
  useEffect(() => {
    debouncedFilter(keyword);
  }, [keyword, debouncedFilter]);

  return {
    keyword,
    setKeyword,
    filteredProducts,
  };
};
```

특히 debounce를 활용하여, 관리자 페이지에서 상품을 입력하고 일정 시간이 지나면 로컬 스토리지에 자동 임시 저장되는 기능도 구현해 보았습니다.
이처럼 단순 기능 구현을 넘어서 UX 향상과 상태 유지까지 고려하는 방향으로 과제를 수행하고자 노력했습니다

### 과제를 다시 해보면 더 잘 할 수 있었겠다 아쉬운 점이 있다면 무엇인가요?

* 이번 과제에서는 기능 구현 위주로 진행하다 보니, 디렉토리 구조를 완전한 FSD(Feature-Sliced Design) 방식으로 구성하지 못한 점이 아쉬웠습니다.
다음에는 최상단부터 기능 단위로 구조화하고, 그 안에서 ui, model, lib, api 등을 계층적으로 나누어 유지보수와 확장에 더 강한 구조를 만들어보고 싶습니다.

* 또한, 로직이 섞인 곳들을 나중에 따로 분리하느라 시간이 더 걸렸습니다.
처음부터 기능 단위뿐 아니라, 재사용 가능한 함수나 로직들을 더 세분화하여 분리하고 추상화할 수 있도록 설계한다면
코드의 재사용성 및 테스트 용이성도 크게 향상될 것이라 느꼈습니다.

## 리뷰 받고 싶은 내용이나 궁금한 것에 대한 질문

이번 과제를 진행하면서 상태 관리와 로직 분리를 위해 custom hook들을 기능별로 나누어봤습니다.
그런데 작업을 하다 보니, hook이 너무 쪼개져 있어서 오히려 구조가 더 복잡하게 느껴지는 부분도 있었습니다.

그래서 다음과 같은 점들이 궁금합니다:

1. 하나의 화면 기능 내에서 사용하는 로직이라면 관련된 hook들을 하나로 묶는 것이 더 나은 구조일까요?
아니면 지금처럼 기능별로 분리하는 방식이 더 바람직한 걸까요?

2. 실무에서는 hook 분리 기준이나 팁, 혹은 감각적으로 판단하는 기준이 있다면 알려주시면 감사하겠습니다.

3. 현재 제가 짠 구조는 FSD 구조가 아니고, ui / model / hooks 중심으로 단순 분리되어 있어서
더더욱 hook 분리가 과하게 느껴지는 것일 수도 있다는 생각이 들었는데,
혹시 구조적인 관점에서도 이런 고민이 생길 수 있는 건지도 궁금합니다.
