// Telegram бот
const BOT_TOKEN = '8273272901:AAGcLtaTyVhd2TYt1FQP4qR2wW24Zh1dIpQ';
// Установите ваш реальный CHAT_ID
const CHAT_ID = '2077189118';

// Функция отправки в Telegram
async function sendToTelegram(message) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();
        
        if (!data.ok) {
            console.error('Ошибка Telegram API:', data);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        return false;
    }
}

// Форматирование сообщения для обратной связи
function formatFeedbackMessage(formData) {
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const product = formData.get('product');
    const message = formData.get('message');

    return `📧 <b>НОВАЯ ЗАЯВКА С САЙТА!</b>\n\n` +
           `👤 <b>Имя:</b> ${name}\n` +
           `📞 <b>Телефон:</b> ${phone}\n` +
           `📧 <b>Email:</b> ${email}\n` +
           `🛍️ <b>Товар:</b> ${product || 'Не указан'}\n` +
           `💬 <b>Сообщение:</b>\n${message || 'Не указано'}\n\n` +
           `🕒 <i>${new Date().toLocaleString('ru-RU')}</i>`;
}

// Форматирование сообщения для заказа
function formatOrderMessage(formData) {
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const product = formData.get('product');
    const quantity = formData.get('quantity');
    const comment = formData.get('comment');

    return `🛒 <b>НОВЫЙ ЗАКАЗ!</b>\n\n` +
           `👤 <b>Имя:</b> ${name}\n` +
           `📞 <b>Телефон:</b> ${phone}\n` +
           `📧 <b>Email:</b> ${email}\n` +
           `🛍️ <b>Товар:</b> ${product}\n` +
           `📦 <b>Количество:</b> ${quantity} шт.\n` +
           `💬 <b>Комментарий:</b> ${comment || 'Не указан'}\n\n` +
           `🕒 <i>${new Date().toLocaleString('ru-RU')}</i>`;
}

// Универсальная функция показа уведомлений
function showNotification(message, type = 'info') {
    // Удаляем существующие уведомления
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });

    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `custom-notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-color)' : type === 'error' ? 'var(--accent-color)' : 'var(--secondary-color)'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 10000;
        max-width: 300px;
        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
        border-left: 4px solid ${type === 'success' ? '#27ae60' : type === 'error' ? '#c0392b' : '#2980b9'};
    `;
    
    document.body.appendChild(notification);
    
    // Автоматически удаляем уведомление через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Обработка формы обратной связи
document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedback-form');
    const orderForm = document.getElementById('order-form');
    const orderModal = document.getElementById('order-modal');

    // Обработка формы обратной связи
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Валидация формы
            if (!this.checkValidity()) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }

            // Показываем загрузку
            submitButton.textContent = 'Отправка...';
            submitButton.disabled = true;

            const formData = new FormData(this);
            const message = formatFeedbackMessage(formData);

            try {
                const success = await sendToTelegram(message);
                
                if (success) {
                    showNotification('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
                    this.reset();
                } else {
                    throw new Error('Ошибка отправки в Telegram');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                showNotification('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.', 'error');
            } finally {
                // Восстанавливаем кнопку
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }

    // Обработка формы заказа
    if (orderForm) {
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Валидация формы
            if (!this.checkValidity()) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }

            // Показываем загрузку
            submitButton.textContent = 'Оформляем...';
            submitButton.disabled = true;

            const formData = new FormData(this);
            const message = formatOrderMessage(formData);

            try {
                const success = await sendToTelegram(message);
                
                if (success) {
                    showNotification('Заказ успешно оформлен! Мы свяжемся с вами для подтверждения.', 'success');
                    this.reset();
                    // Закрываем модальное окно
                    if (orderModal) {
                        orderModal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
                } else {
                    throw new Error('Ошибка отправки в Telegram');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                showNotification('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.', 'error');
            } finally {
                // Восстанавливаем кнопку
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }

    // Обработка кнопок "Заказать" в слайдере
    document.querySelectorAll('.slide .btn-primary[data-product]').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const orderProductInput = document.getElementById('order-product');
            
            if (orderProductInput && orderModal) {
                orderProductInput.value = product;
                orderModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Закрытие модального окна
    const closeModal = document.querySelector('.close-modal');
    if (closeModal && orderModal) {
        closeModal.addEventListener('click', function() {
            orderModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Закрытие модального окна при клике вне его
    if (orderModal) {
        window.addEventListener('click', function(e) {
            if (e.target === orderModal) {
                orderModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && orderModal && orderModal.style.display === 'flex') {
            orderModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Валидация телефона
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    value = value.substring(1);
                }
                
                let formattedValue = '+7';
                
                if (value.length > 0) {
                    formattedValue += ' (' + value.substring(0, 3);
                }
                if (value.length > 3) {
                    formattedValue += ') ' + value.substring(3, 6);
                }
                if (value.length > 6) {
                    formattedValue += '-' + value.substring(6, 8);
                }
                if (value.length > 8) {
                    formattedValue += '-' + value.substring(8, 10);
                }
                
                e.target.value = formattedValue;
            }
        });

        // Добавляем placeholder для лучшего UX
        if (!input.placeholder) {
            input.placeholder = '+7 (XXX) XXX-XX-XX';
        }
    });
});

// Добавляем обработчик для поля количества в заказе
document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('order-quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            if (this.value < 1) {
                this.value = 1;
            }
            if (this.value > 99) {
                this.value = 99;
            }
        });
    }
});