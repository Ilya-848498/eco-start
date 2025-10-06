// Основной JavaScript файл
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initTypewriter();
    initModal();
    initAnimations();
    initVideoBackground();
});

// Мобильное меню
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Закрытие меню при клике на ссылку
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            });
        });

        // Закрытие меню при клике вне его области
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
}

// Плавная прокрутка
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('#header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Кнопка "Наверх"
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Эффект печатной машинки
function initTypewriter() {
    const typewriterText = document.getElementById('typewriter-text');
    const footerTypewriterText = document.getElementById('footer-typewriter-text');
    
    if (typewriterText) {
        const texts = [
            'Создаём экологичное будущее вместе',
            'Качественные товары для вашего дома',
            'Забота о природе начинается с малого'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typewriterText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typewriterText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 1500; // Пауза перед удалением
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500; // Пауза перед новым текстом
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Запускаем эффект после небольшой задержки
        setTimeout(type, 1000);
    }
    
    if (footerTypewriterText) {
        const footerText = 'Эко-старт - забота о природе и вашем комфорте. Присоединяйтесь к нашему движению!';
        let footerCharIndex = 0;
        
        function typeFooter() {
            if (footerCharIndex < footerText.length) {
                footerTypewriterText.textContent += footerText.charAt(footerCharIndex);
                footerCharIndex++;
                setTimeout(typeFooter, 50);
            }
        }
        
        // Запускаем когда футер появляется в viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeFooter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(footerTypewriterText);
    }
}

// Модальное окно
function initModal() {
    const modal = document.getElementById('order-modal');
    const closeBtn = document.querySelector('.close-modal');
    const orderButtons = document.querySelectorAll('button[data-product]');
    
    // Открытие модального окна
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const productSelect = document.getElementById('order-product');
            
            if (productSelect) {
                for (let option of productSelect.options) {
                    if (option.value === product) {
                        option.selected = true;
                        break;
                    }
                }
            }
            
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Закрытие модального окна
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Закрытие при клике вне окна
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// Анимации при скролле
function initAnimations() {
    const animateElements = document.querySelectorAll('.benefit-card, .blog-card, .feature-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Видео-фон
function initVideoBackground() {
    const video = document.getElementById('hero-video');
    
    if (video) {
        // Установка громкости (если нужно)
        video.volume = 0.1;
        
        // Обработка ошибок видео
        video.addEventListener('error', function() {
            console.log('Ошибка загрузки видео, используется фоновое изображение');
        });
        
        // Попытка воспроизведения с обработкой авто-плей политики
        video.play().catch(function(error) {
            console.log('Автовоспроизведение заблокировано:', error);
            // Можно показать кнопку для ручного запуска
        });
    }
}

// Обработка изменения размера окна
window.addEventListener('resize', function() {
    // Закрываем мобильное меню при изменении размера на десктоп
    if (window.innerWidth > 768) {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Загрузка изображений с обработкой ошибок
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.log('Ошибка загрузки изображения:', this.src);
            this.style.display = 'none';
        });
    });
});