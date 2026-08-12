// Analytics: Google Analytics 4
(function() {
    const removeInvalidFirebaseSnippet = (root) => {
        const scripts = root.querySelectorAll
            ? root.querySelectorAll('script[type="module"]')
            : [];

        scripts.forEach((script) => {
            if (script.textContent.includes('apiKey: "***"')) {
                script.remove();
            }
        });
    };

    // The legacy inline Firebase snippet appears after this script in index.html.
    // Remove it as soon as the parser adds it to the document.
    removeInvalidFirebaseSnippet(document);
    const scriptObserver = new MutationObserver(() => {
        removeInvalidFirebaseSnippet(document);
    });
    scriptObserver.observe(document.documentElement, { childList: true, subtree: true });

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function() {
        window.dataLayer.push(arguments);
    };

    if (!document.querySelector('script[data-ga4="G-0TE9HBV804"]')) {
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-0TE9HBV804';
        gaScript.dataset.ga4 = 'G-0TE9HBV804';
        document.head.appendChild(gaScript);
    }

    window.gtag('js', new Date());
    window.gtag('config', 'G-0TE9HBV804');
})();

// Theme management
(function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

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

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const notesLink = document.createElement('a');
        notesLink.href = 'https://ronanrodrigo.dev/notes/';
        notesLink.textContent = 'Notes';
        navLinks.appendChild(notesLink);
    }

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.pageYOffset > 100
            ? '0 4px 20px rgba(0,0,0,0.15)'
            : 'none';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(item);
    });

    document.querySelectorAll('.publications-list li').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(15px)';
        item.style.transition = `opacity 0.4s ease ${index * 0.08}s, transform 0.4s ease ${index * 0.08}s`;
        observer.observe(item);
    });
})();
