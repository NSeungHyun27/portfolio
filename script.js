(function () {
  'use strict';

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-list a');
  const contactForm = document.getElementById('contactForm');

  // 모바일 네비게이션 토글
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // 링크 클릭 시 메뉴 닫기 (모바일)
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', '메뉴 열기');
        document.body.style.overflow = '';
      });
    });
  }

  // 스크롤 시 헤더 스타일 (선택적)
  const header = document.querySelector('.header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
      const currentScroll = window.scrollY;
      if (currentScroll > 80) {
        header.style.background = 'rgba(13, 17, 23, 0.95)';
      } else {
        header.style.background = 'rgba(13, 17, 23, 0.85)';
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // Contact 폼 제출
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('모든 필드를 입력해 주세요.');
        return;
      }

      // 실제 백엔드 연동 시 여기서 fetch 등 처리
      alert('메시지가 전송되었습니다. (데모: 실제 전송 로직을 연결해 주세요.)');
      contactForm.reset();
    });
  }
})();
