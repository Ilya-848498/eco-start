// Слайдер товаров
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (!slider || !slides.length) return;
    
    let currentSlide = 0;
    const slideCount = slides.length;
    let isAnimating = false;
    let autoSlideInterval;
    
    // Функция для перехода к слайду
    function goToSlide(index) {
        if (isAnimating) return;
        
        isAnimating = true;
        currentSlide = index;
        
        // Плавная анимация с уменьшенной скоростью
        slider.style.transition = 'transform 0.6s ease';
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Сброс флага анимации после завершения
        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }
    
    // Следующий слайд
    function nextSlide() {
        const next = (currentSlide + 1) % slideCount;
        goToSlide(next);
    }
    
    // Предыдущий слайд
    function prevSlide() {
        const prev = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(prev);
    }
    
    // Обработчики событий для кнопок
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Автопрокрутка
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Запуск автопрокрутки
    startAutoSlide();
    
    // Остановка автопрокрутки при наведении
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
        
        // Остановка автопрокрутки при касании на мобильных устройствах
        sliderContainer.addEventListener('touchstart', stopAutoSlide);
        sliderContainer.addEventListener('touchend', startAutoSlide);
    }
    
    // Обработка окончания анимации перехода
    slider.addEventListener('transitionend', function() {
        isAnimating = false;
    });
    
    // Инициализация позиции слайдера
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Очистка интервала при уходе со страницы
    window.addEventListener('beforeunload', function() {
        stopAutoSlide();
    });
});