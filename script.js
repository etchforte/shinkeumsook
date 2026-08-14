document.addEventListener("DOMContentLoaded", () => {
    // 1. 스크롤 애니메이션 (Intersection Observer)
    const reveals = document.querySelectorAll(".scroll-reveal");
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" 
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // 2. 한/영 언어 전환 스크립트 추가
    const langBtn = document.getElementById("langToggle");
    const body = document.body;

    langBtn.addEventListener("click", () => {
        // body에 'en-mode' 클래스를 토글합니다.
        body.classList.toggle("en-mode");
        
        // 버튼 텍스트 변경 (영어 모드면 버튼에 KO 표시, 한국어 모드면 EN 표시)
        if (body.classList.contains("en-mode")) {
            langBtn.textContent = "KO";
        } else {
            langBtn.textContent = "EN";
        }
    });
});
