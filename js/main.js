class Portfolio {
    constructor() {
        this.currentTheme = 'dark'; // default theme
        this.init();
    }
    
    init() {
        // Apply theme immediately
        this.applyStoredTheme();
        
        // Initialize components
        this.preloader();
        this.navbar();
        this.scrollReveal();
        this.magneticButtons();
        this.cursorEffect();
        this.counterAnimation();
        this.formHandler();
        this.smoothScroll();
        this.setupThemeToggle();
        
        // Initialize new features
        this.animateSkills();
        this.initProjectFilters();
        this.initExperienceTabs();
        this.initTechTooltips();
        
        // Initialize animations
        setTimeout(() => this.animateHero(), 100);
    }
    
    // Apply stored theme from localStorage
    applyStoredTheme() {
        const root = document.documentElement;
        const themeIcon = document.querySelector('.theme-toggle i');
        const storedTheme = localStorage.getItem('theme') || 'dark';
        
        this.currentTheme = storedTheme;
        
        if (storedTheme === 'light') {
            root.classList.add('light-theme');
            themeIcon.className = 'fas fa-sun';
        } else {
            root.classList.remove('light-theme');
            themeIcon.className = 'fas fa-moon';
        }
    }
    
    // Theme toggle setup
    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const themeIcon = themeToggle.querySelector('i');
        const root = document.documentElement;
        
        themeToggle.addEventListener('click', () => {
            // Toggle theme class
            root.classList.toggle('light-theme');
            
            // Update current theme
            this.currentTheme = root.classList.contains('light-theme') ? 'light' : 'dark';
            
            // Update icon with animation
            if (this.currentTheme === 'light') {
                themeIcon.style.transform = 'rotate(180deg) scale(1.2)';
                setTimeout(() => {
                    themeIcon.className = 'fas fa-sun';
                    themeIcon.style.transform = 'rotate(0) scale(1)';
                }, 150);
            } else {
                themeIcon.style.transform = 'rotate(180deg) scale(1.2)';
                setTimeout(() => {
                    themeIcon.className = 'fas fa-moon';
                    themeIcon.style.transform = 'rotate(0) scale(1)';
                }, 150);
            }
            
            // Save to localStorage
            localStorage.setItem('theme', this.currentTheme);
            
            // Dispatch theme change event for other components
            this.dispatchThemeChange();
            
            // Add click feedback
            themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 100);
        });
    }
    
    // Dispatch theme change event
    dispatchThemeChange() {
        const themeChangeEvent = new CustomEvent('themeChanged', {
            detail: { theme: this.currentTheme }
        });
        window.dispatchEvent(themeChangeEvent);
    }
    
    // Initialize skill animations
    animateSkills() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width') + '%';
                    entry.target.style.width = width;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => observer.observe(bar));
    }
    
    // Initialize project filtering
    initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category').split(',');
                    
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.classList.add('hidden');
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Initialize experience tabs
    initExperienceTabs() {
        const tabs = document.querySelectorAll('.exp-tab');
        const tabContents = document.querySelectorAll('.timeline-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(20px)';
                });
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                const activeContent = document.getElementById(`${tabId}-timeline`);
                if (activeContent) {
                    activeContent.classList.add('active');
                    setTimeout(() => {
                        activeContent.style.opacity = '1';
                        activeContent.style.transform = 'translateY(0)';
                    }, 100);
                }
            });
        });
    }
    
    // Tooltip for tech icons
    initTechTooltips() {
        const techIcons = document.querySelectorAll('.tech-icon');
        
        techIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                const tooltip = icon.getAttribute('data-tooltip');
                // Tooltip is handled by CSS, but we can add custom behavior here if needed
            });
        });
    }
    
    // Preloader
    preloader() {
        const preloader = document.querySelector('.preloader');
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 1000);
        });
    }
    
    // Hero animation sequence
    animateHero() {
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title .title-line, .hero-subtitle, .hero-cta');
        
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 300 + index * 200);
        });
        
        // Floating card animation
        const floatingCard = document.querySelector('.floating-card');
        if (floatingCard) {
            let startTime = null;
            
            const animateCard = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = (timestamp - startTime) / 1000;
                
                const floatY = Math.sin(progress) * 10;
                floatingCard.style.transform = `translateY(${floatY}px)`;
                
                requestAnimationFrame(animateCard);
            };
            
            requestAnimationFrame(animateCard);
        }
    }
    
    // Navbar scroll effect
    navbar() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                navbar.classList.remove('scrolled');
                return;
            }
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
                navbar.classList.add('scrolled');
            }
            
            lastScroll = currentScroll;
        });
        
        // Mobile menu toggle
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        mobileBtn.addEventListener('click', () => {
            const isVisible = navMenu.style.display === 'flex';
            navMenu.style.display = isVisible ? 'none' : 'flex';
            mobileBtn.classList.toggle('active');
        });
    }
    
    // Scroll reveal animations
    scrollReveal() {
        const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        
        const revealOnScroll = () => {
            reveals.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('active');
                }
            });
        };
        
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Initial check
    }
    
    // Magnetic buttons
    magneticButtons() {
        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const strength = 0.5;
                
                // Use CSS transforms for smooth animation
                element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    // Custom cursor effect
    cursorEffect() {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        
        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });
        
        // Smooth outline animation
        const animateCursor = () => {
            outlineX += (mouseX - outlineX) * 0.1;
            outlineY += (mouseY - outlineY) * 0.1;
            
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            
            requestAnimationFrame(animateCursor);
        };
        
        animateCursor();
        
        // Interactive elements cursor effects
        const interactiveElements = document.querySelectorAll('a, button, .btn, .magnetic');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.borderColor = 'var(--color-accent-primary)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.borderColor = 'var(--color-accent-primary)';
            });
        });
    }
    
    // Counter animation for stats
    counterAnimation() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        };
        
        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // Form handler
    formHandler() {
        const form = document.querySelector('.contact-form');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.querySelector('span').textContent;
            const submitIcon = submitBtn.querySelector('i');
            
            // Show loading state
            submitBtn.querySelector('span').textContent = 'Sending...';
            submitIcon.className = 'fas fa-spinner fa-spin';
            submitBtn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success state
            submitBtn.querySelector('span').textContent = 'Message Sent!';
            submitIcon.className = 'fas fa-check';
            submitBtn.style.background = 'linear-gradient(135deg, #00ffaa, #00d9ff)';
            
            // Reset form
            form.reset();
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.querySelector('span').textContent = originalText;
                submitIcon.className = 'fas fa-paper-plane';
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        });
    }
    
    // Smooth scroll for anchor links
    smoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                if (window.innerWidth <= 768) {
                    navMenu.style.display = 'none';
                }
            });
        });
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});