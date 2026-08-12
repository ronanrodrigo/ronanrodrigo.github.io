// Analytics configuration
(function() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function() { window.dataLayer.push(arguments); };
    window.gtag('config', 'G-0TE9HBV804');

    // Initialize a named Firebase app so this remains safe alongside
    // the existing inline Firebase initialization in index.html.
    import('https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js')
        .then(({ initializeApp }) => import('https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js')
            .then(({ getAnalytics }) => {
                const firebaseConfig = {
                    apiKey: 'AIzaSyC5UXudhyrm7MAcV3AYF2LzDFxvsh--AbY',
                    authDomain: 'ronanrodrigo-dev.firebaseapp.com',
                    projectId: 'ronanrodrigo-dev',
                    storageBucket: 'ronanrodrigo-dev.firebasestorage.app',
                    messagingSenderId: '42504195489',
                    appId: '1:42504195489:web:fd3a6d54cbcbac5ef84fe0',
                    measurementId: 'G-0TE9HBV804'
                };

                const app = initializeApp(firebaseConfig, 'analytics');
                getAnalytics(app);
            }))
        .catch((error) => console.error('Firebase Analytics initialization failed:', error));
})();

// Theme management
(function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        html.setAttribute('data-theme', 'light');
    }

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    // Set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Add Notes link to the top navigation
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const notesLink = document.createElement('a');
        notesLink.href = 'https://ronanrodrigo.dev/notes/';
        notesLink.textContent = 'Notes';
        navLinks.appendChild(notesLink);
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe timeline items for scroll animation
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(item);
    });

    // Observe publications
    document.querySelectorAll('.publications-list li').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(15px)';
        item.style.transition = `opacity 0.4s ease ${index * 0.08}s, transform 0.4s ease ${index * 0.08}s`;
        observer.observe(item);
    });
})();
