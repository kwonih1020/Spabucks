/**
 * 오른쪽 하단 화살표 누르면 위에 가기
 */

const toTopEl = document.querySelector("#to-top");

toTopEl.addEventListener("click", function () {
  // 페이지 위치를 최상단으로 부드럽게(0.7초 동안) 이동.
  gsap.to(window, 0.7, {
    scrollTo: 0,
  });
});

/**
 * 배너에 사진들 순서대로 나타나는 기능
 */
// 나타날 요소들(.fade-in) 찾기.
const fadeEls = document.querySelectorAll(".visual .fade-in");
// 나타날 요소들을 하나씩 반복해서 처리
fadeEls.forEach(function (fadeEl, index) {
  // 각 요소들을 순서대로(delay) 보여지게 함
  gsap.to(fadeEl, 1, {
    delay: (index + 1) * 0.7,
    opacity: 1,
  });
});

/**
 * 올해가 몇 년도인지 계산
 */
 const thisYear = document.querySelector(".this-year");
 thisYear.textContent = new Date().getFullYear();