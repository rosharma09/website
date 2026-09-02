/**
 * ROHAN SHARMA (@_ROH_SHARMA_) — VERCEL / GEIST MINIMAL ENGINE
 * Hero Landscape Parallax · Bidirectional Scroll Reveal · Spotlight Cursor · Email Dispatch
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================================
     HERO LANDSCAPE — FADE-IN ON LOAD + SCROLL-DRIVEN PARALLAX SHIFT
     ========================================================================== */
  const heroLandscape = document.getElementById('heroLandscape');

  // Fade the landscape in after a short delay (cinematic reveal on page open)
  if (heroLandscape) {
    setTimeout(() => {
      heroLandscape.classList.add('is-loaded');
    }, 300);

    // Parallax + scroll-driven opacity reveal
    function updateLandscapeParallax() {
      const scrollY = window.scrollY;
      const heroSection = heroLandscape.closest('section');
      if (!heroSection) return;
      const heroHeight = heroSection.offsetHeight;
      const heroBottom = heroSection.offsetTop + heroHeight;

      if (scrollY <= heroBottom) {
        // Parallax shift — image moves slower than scroll (depth effect)
        const shift = scrollY * 0.25;
        heroLandscape.style.transform = `scale(1) translateY(${shift}px)`;

        // Opacity: 0.15 at rest → peaks at 0.55 halfway through hero → fades to 0.1 at bottom
        // Creates a cinematic "reveal as you descend" feel
        const progress = scrollY / heroHeight; // 0 → 1 as hero scrolls out
        let opacity;
        if (progress < 0.5) {
          // Rising phase: 0.15 → 0.55
          opacity = 0.15 + progress * 2 * 0.40;
        } else {
          // Fading phase: 0.55 → 0.10 as hero exits
          opacity = 0.55 - (progress - 0.5) * 2 * 0.45;
        }
        heroLandscape.style.opacity = Math.max(0.08, opacity);
      }
    }

    // Only run parallax on pointer (hover) devices — mobile scroll is jerky
    if (window.matchMedia('(hover: hover)').matches) {
      window.addEventListener('scroll', updateLandscapeParallax, { passive: true });
      updateLandscapeParallax();
    } else {
      // On touch: just fade in at a comfortable opacity, no parallax
      heroLandscape.style.opacity = '0.35';
    }
  }

  /* ==========================================================================
     BIDIRECTIONAL SCROLL-REVEAL OBSERVER (ANIMATES SCROLL DOWN & SCROLL UP)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        // Remove class when out of view so it re-animates when scrolling back up!
        entry.target.classList.remove('is-visible');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     SCROLL PROGRESS INDICATOR & STICKY NAVBAR
     ========================================================================== */
  const progressBar = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }

    if (navbar) {
      if (window.scrollY > 20) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
      } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.85)';
      }
    }
  }, { passive: true });

  /* ==========================================================================
     VERCEL SPOTLIGHT MOUSE TRACKING EFFECT
     ========================================================================== */
  const spotlightCards = document.querySelectorAll('.spotlight-card');

  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ==========================================================================
     MOBILE MENU DRAWER
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const menuIcon = document.getElementById('menuIcon');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      if (window.lucide) {
        menuIcon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
        window.lucide.createIcons();
      }
    });

    document.querySelectorAll('.m-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        if (window.lucide) {
          menuIcon.setAttribute('data-lucide', 'menu');
          window.lucide.createIcons();
        }
      });
    });
  }

  /* ==========================================================================
     INQUIRY FORM — EMAIL DISPATCH
     ========================================================================== */
  const collabForm = document.getElementById('collabForm');
  if (collabForm) {
    collabForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderContact').value.trim();
      const type = document.getElementById('inquiryType').value;
      const message = document.getElementById('projectDetails').value.trim();

      const subject = encodeURIComponent(`[Inquiry] ${type} - ${name}`);
      const body = encodeURIComponent(
        `Hi Rohan,\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Inquiry Type: ${type}\n\n` +
        `Message:\n${message}\n\n` +
        `Best regards,\n${name}`
      );

      window.location.href = `mailto:rosharma0906@gmail.com?subject=${subject}&body=${body}`;
      showToast('Opening email client to send to rosharma0906@gmail.com…');
    });
  }

    /* ============================================================================
      SPOTLIGHT SCROLL — Centered, circular post wheel
      ============================================================================ */
  const carousel  = document.getElementById('postsCarousel');
  const slides    = carousel ? Array.from(carousel.querySelectorAll('.post-slide')) : [];
  const dotsWrap  = document.getElementById('carouselDots');
  const prevBtn   = document.getElementById('carouselPrev');
  const nextBtn   = document.getElementById('carouselNext');

  if (carousel && slides.length) {
    // Build dots
    const dots = slides.map((_, i) => {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Post ${i + 1}`);
      d.addEventListener('click', () => scrollToSlide(i));
      if (dotsWrap) dotsWrap.appendChild(d);
      return d;
    });

    /** Find which slide is closest to the carousel's horizontal centre */
    function getActiveIndex() {
      const carouselRect = carousel.getBoundingClientRect();
      const centre = carouselRect.left + carouselRect.width / 2;
      let bestIdx = 0, bestDist = Infinity;
      slides.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - centre);
        if (dist < bestDist) { bestDist = dist; bestIdx = i; }
      });
      return bestIdx;
    }

    function updateActive() {
      const idx = getActiveIndex();
      slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    /** Scroll carousel so slide at index is centred */
    function scrollToSlide(index, behavior = 'smooth') {
      const normalizedIndex = (index + slides.length) % slides.length;
      const slide = slides[normalizedIndex];
      const carouselRect = carousel.getBoundingClientRect();
      const slideRect = slide.getBoundingClientRect();
      const offset = slideRect.left - carouselRect.left
                   - (carouselRect.width / 2 - slideRect.width / 2);
      carousel.scrollBy({ left: offset, behavior });
    }

    // Arrow buttons
    if (prevBtn) prevBtn.addEventListener('click', () => {
      scrollToSlide(getActiveIndex() - 1);
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      scrollToSlide(getActiveIndex() + 1);
    });

    carousel.addEventListener('scroll', updateActive, { passive: true });

    // Start on the middle post so the wheel is centered on first render.
    requestAnimationFrame(() => {
      scrollToSlide(Math.floor(slides.length / 2), 'auto');
      updateActive();
    });
  }

    /* ==========================================================================
     CUSTOM CURSOR — DOT + LERP RING
     ========================================================================== */
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  // Only activate on pointer devices
  if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafRunning = false;

    // Instantly move dot; ring follows via lerp in rAF
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      if (!rafRunning) {
        rafRunning = true;
        requestAnimationFrame(lerpRing);
      }
    });

    function lerpRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      // Keep running until ring catches up (within 0.5px)
      if (Math.abs(mouseX - ringX) > 0.5 || Math.abs(mouseY - ringY) > 0.5) {
        requestAnimationFrame(lerpRing);
      } else {
        rafRunning = false;
      }
    }

    // State: contracted over links and buttons
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-on-link'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on-link'));
    });

    // Hide default cursor site-wide when custom cursor is active
    document.body.style.cursor = 'none';
  }

  /* ==========================================================================
     TOAST NOTIFICATION HELPER
     ========================================================================== */
  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="mail" style="width: 14px; height: 14px;"></i> <span>${message}</span>`;
    container.appendChild(toast);

    if (window.lucide) {
      window.lucide.createIcons();
    }

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-8px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }
});
