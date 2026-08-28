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
                // 화면에 요소가 들어오면 active 클래스 추가
                entry.target.classList.add("active");
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // 2. 한/영 언어 전환 기능
    const langBtn = document.getElementById("langToggle");
    const body = document.body;

    langBtn.addEventListener("click", () => {
        // body 태그에 'en-mode' 클래스를 껐다 켰다(toggle) 합니다.
        body.classList.toggle("en-mode");
        
        // 클래스 상태에 따라 버튼의 텍스트를 변경합니다.
        if (body.classList.contains("en-mode")) {
            langBtn.textContent = "KO"; // 영어 모드일 때는 돌아가기 위한 'KO' 표시
        } else {
            langBtn.textContent = "EN"; // 한국어 모드일 때는 'EN' 표시
        }
    });
});
