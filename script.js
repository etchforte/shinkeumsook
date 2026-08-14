document.addEventListener("DOMContentLoaded", () => {
    // 1. 스크롤 애니메이션 (Intersection Observer)
    const reveals = document.querySelectorAll(".scroll-reveal");

    const revealOptions = {
        threshold: 0.15, // 요소가 화면에 15% 보일 때 작동
        rootMargin: "0px 0px -50px 0px" 
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // 애니메이션이 한 번 실행된 후에는 관찰 해제 (계속 보고 싶다면 아래 줄 삭제)
                // observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });
});
