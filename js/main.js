// Основной JavaScript файл
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initTypewriter();
    initModal();
    initFormValidation();
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
    const orderForm = document.getElementById('order-form');
    
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
                modal.style.display = 'block';
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
    
    // Обработка формы заказа
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация формы
            if (validateOrderForm()) {
                // Имитация отправки
                const formData = new FormData(this);
                const orderData = {
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    product: formData.get('product'),
                    quantity: formData.get('quantity'),
                    comment: formData.get('comment')
                };
                
                console.log('Заказ оформлен:', orderData);
                
                // Показываем сообщение об успехе
                showNotification('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.', 'success');
                
                // Закрываем модальное окно
                modal.style.display = 'none';
                document.body.style.overflow = '';
                
                // Очищаем форму
                this.reset();
            }
        });
    }
}

// Валидация формы заказа
function validateOrderForm() {
    const name = document.getElementById('order-name');
    const phone = document.getElementById('order-phone');
    const email = document.getElementById('order-email');
    const product = document.getElementById('order-product');
    const consent = document.getElementById('order-consent');
    
    let isValid = true;
    
    // Валидация имени
    if (!name.value.trim()) {
        showInputError(name, 'Пожалуйста, введите ваше имя');
        isValid = false;
    } else {
        removeInputError(name);
    }
    
    // Валидация телефона
    const phoneRegex = /^(\+7|8)[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    if (!phone.value.trim() || !phoneRegex.test(phone.value.replace(/\s/g, ''))) {
        showInputError(phone, 'Пожалуйста, введите корректный номер телефона');
        isValid = false;
    } else {
        removeInputError(phone);
    }
    
    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
        showInputError(email, 'Пожалуйста, введите корректный email');
        isValid = false;
    } else {
        removeInputError(email);
    }
    
    // Валидация товара
    if (!product.value) {
        showInputError(product, 'Пожалуйста, выберите товар');
        isValid = false;
    } else {
        removeInputError(product);
    }
    
    // Валидация согласия
    if (!consent.checked) {
        showInputError(consent, 'Необходимо согласие на обработку данных');
        isValid = false;
    } else {
        removeInputError(consent);
    }
    
    return isValid;
}

// Показать ошибку ввода
function showInputError(input, message) {
    removeInputError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#e74c3c';
}

// Убрать ошибку ввода
function removeInputError(input) {
    const existingError = input.parentNode.querySelector('.input-error');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = '#e0e0e0';
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = '#27ae60';
    } else if (type === 'error') {
        notification.style.background = '#e74c3c';
    } else {
        notification.style.background = '#3498db';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
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

// Валидация форм
function initFormValidation() {
    const feedbackForm = document.getElementById('feedback-form');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateFeedbackForm()) {
                // Имитация отправки
                const formData = new FormData(this);
                const feedbackData = {
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    product: formData.get('product'),
                    message: formData.get('message')
                };
                
                console.log('Форма отправлена:', feedbackData);
                showNotification('Сообщение отправлено! Мы ответим вам в ближайшее время.', 'success');
                this.reset();
            }
        });
    }
}

// Валидация формы обратной связи
function validateFeedbackForm() {
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const consent = document.getElementById('consent');
    
    let isValid = true;
    
    // Валидация имени
    if (!name.value.trim()) {
        showInputError(name, 'Пожалуйста, введите ваше имя');
        isValid = false;
    } else {
        removeInputError(name);
    }
    
    // Валидация телефона
    const phoneRegex = /^(\+7|8)[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    if (!phone.value.trim() || !phoneRegex.test(phone.value.replace(/\s/g, ''))) {
        showInputError(phone, 'Пожалуйста, введите корректный номер телефона');
        isValid = false;
    } else {
        removeInputError(phone);
    }
    
    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
        showInputError(email, 'Пожалуйста, введите корректный email');
        isValid = false;
    } else {
        removeInputError(email);
    }
    
    // Валидация согласия
    if (!consent.checked) {
        showInputError(consent, 'Необходимо согласие на обработку данных');
        isValid = false;
    } else {
        removeInputError(consent);
    }
    
    return isValid;
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

