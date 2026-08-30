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

    // Parallax: as user scrolls down, shift the background-position upward
    function updateLandscapeParallax() {
      const scrollY = window.scrollY;
      const heroSection = heroLandscape.closest('section');
      if (!heroSection) return;
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

      // Only apply while hero is in view
      if (scrollY <= heroBottom) {
        // Move background opposite to scroll direction (true parallax feel)
        const shift = scrollY * 0.25;
        heroLandscape.style.transform = `scale(1) translateY(${shift}px)`;
      }
    }

    window.addEventListener('scroll', updateLandscapeParallax, { passive: true });
    updateLandscapeParallax();
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
