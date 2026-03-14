
        // ===== Theme Toggle =====
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');
        
        // Check for saved theme preference or respect OS preference
        const savedTheme = localStorage.getItem('theme') || 
                           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Apply the saved theme
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('bi-moon');
            themeIcon.classList.add('bi-sun');
        }
        
        // Toggle theme function
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                themeIcon.classList.remove('bi-sun');
                themeIcon.classList.add('bi-moon');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.classList.remove('bi-moon');
                themeIcon.classList.add('bi-sun');
                localStorage.setItem('theme', 'dark');
            }
        });

        // ===== Sidebar toggles =====
        const sidebar = document.getElementById('sidebar');
        const content = document.getElementById('content');
        const toggleCollapse = document.getElementById('toggleCollapse');
        const hamburger = document.getElementById('hamburger');
        const closeSidebar = document.getElementById('closeSidebar');

        // Desktop collapse
        toggleCollapse?.addEventListener('click', () => {
            const isCollapsed = sidebar.classList.toggle('collapsed');
            content.classList.toggle('collapsed', isCollapsed);
        });

        // Mobile offcanvas-like
        hamburger?.addEventListener('click', () => sidebar.classList.add('show'));
        closeSidebar?.addEventListener('click', () => sidebar.classList.remove('show'));

        // ===== Dropdown open on hover (as in screenshot) =====
        document.querySelectorAll('[data-hover="dropdown"]').forEach((wrap) => {
            const btn = wrap.querySelector('[data-bs-toggle="dropdown"]');
            const menu = wrap.querySelector('.dropdown-menu');
            if (!btn || !menu) return;

            let openTimeout, closeTimeout;
            wrap.addEventListener('mouseenter', () => {
                clearTimeout(closeTimeout);
                openTimeout = setTimeout(() => {
                    const dropdown = bootstrap.Dropdown.getOrCreateInstance(btn);
                    dropdown.show();
                }, 80);
            });
            wrap.addEventListener('mouseleave', () => {
                clearTimeout(openTimeout);
                closeTimeout = setTimeout(() => {
                    const dropdown = bootstrap.Dropdown.getOrCreateInstance(btn);
                    dropdown.hide();
                }, 120);
            });
        });

        // ===== Submenu expand in expanded mode; flyout in collapsed mode =====
        const flyout = document.getElementById('flyout');

        function buildFlyout(list) {
            flyout.innerHTML = '';
            if (!list) return;
            const title = document.createElement('div');
            title.className = 'fly-title';
            title.textContent = 'Menu';
            flyout.appendChild(title);
            list.querySelectorAll('.subitem').forEach(a => {
                const clone = a.cloneNode(true); // keep href/text
                flyout.appendChild(clone);
            });
        }

        function showFlyout(target) {
            const rect = target.getBoundingClientRect();
            flyout.style.top = (window.scrollY + rect.top) + 'px';
            // thoda overlap (-2) taaki gap na bane
            flyout.style.left = (rect.width <= 90
                ? (window.scrollX + rect.left + 78)
                : (window.scrollX + rect.right - 2)) + 'px';
            flyout.style.display = 'block';
        }
        function hideFlyout() {
            flyout.style.display = 'none';
        }

        document.querySelectorAll('.menu [data-flyout]').forEach((item) => {
            const trigger = item.querySelector('[data-node]');
            const submenu = item.querySelector('.submenu');

            // Expand/collapse in expanded sidebar
            trigger.addEventListener('click', (e) => {
                if (!sidebar.classList.contains('collapsed') && submenu) {
                    e.preventDefault();
                    item.classList.toggle('show');
                }
            });

            // Hover behavior when sidebar is collapsed
            item.addEventListener('mouseenter', () => {
                if (sidebar.classList.contains('collapsed') && submenu) {
                    buildFlyout(submenu);
                    showFlyout(item);
                }
            });
            item.addEventListener('mouseleave', () => {
                if (sidebar.classList.contains('collapsed')) {
                    // agar flyout pe mouse nahi gaya to hi hide karo
                    setTimeout(() => {
                        if (!flyout.matches(':hover')) {
                            hideFlyout();
                        }
                    }, 100);
                }
            });
        });

        // Flyout pe mouse le jao to open hi rahe
        flyout.addEventListener('mouseenter', () => {
            flyout.style.display = 'block';
        });
        flyout.addEventListener('mouseleave', () => {
            hideFlyout();
        });

        // Hide flyout when scrolling or resizing
        window.addEventListener('scroll', () => {
            if (sidebar.classList.contains('collapsed')) hideFlyout();
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth < 992) hideFlyout();
        });

