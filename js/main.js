// Main JavaScript for Executive Coach Website

document.addEventListener('DOMContentLoaded', () => {
    console.log('Executive Coach Site Loaded');

    // 1. Page Loader Logic
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        // Force a minimum display time of 1.5s
        setTimeout(() => {
            loader.classList.add('hidden');
            // Allow body scroll after loader vanishes
            document.body.style.overflow = 'auto';
        }, 1500);
    }

    // 2. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 3. Advanced Scroll Reveal (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-img, .fade-in-up, .fade-in-scroll');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Navbar Scroll Effect (Light Theme)
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(253, 251, 247, 0.95)'; // Light cream
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
        } else {
            navbar.style.background = 'rgba(253, 251, 247, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

});
