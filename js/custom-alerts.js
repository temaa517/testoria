// custom-alerts.js - Кастомные уведомления для Testoria
class TestoriaAlerts {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        this.createContainer();
        this.addStyles();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'testoria-alerts-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(this.container);
    }

    addStyles() {
        const styles = `
            .testoria-alert {
                background: var(--bg-card);
                border: 2px solid;
                border-radius: 12px;
                padding: 16px 20px;
                box-shadow: var(--shadow);
                display: flex;
                align-items: center;
                gap: 12px;
                animation: slideInAlert 0.3s ease-out;
                transition: all 0.3s ease;
                max-width: 400px;
                backdrop-filter: blur(10px);
            }

            .testoria-alert.success {
                border-color: #10b981;
                background: linear-gradient(135deg, var(--bg-card) 0%, rgba(16, 185, 129, 0.1) 100%);
            }

            .testoria-alert.error {
                border-color: #ef4444;
                background: linear-gradient(135deg, var(--bg-card) 0%, rgba(239, 68, 68, 0.1) 100%);
            }

            .testoria-alert.warning {
                border-color: #f59e0b;
                background: linear-gradient(135deg, var(--bg-card) 0%, rgba(245, 158, 11, 0.1) 100%);
            }

            .testoria-alert.info {
                border-color: var(--accent-color);
                background: linear-gradient(135deg, var(--bg-card) 0%, rgba(69, 192, 236, 0.1) 100%);
            }

            .testoria-alert-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                font-size: 14px;
            }

            .testoria-alert.success .testoria-alert-icon {
                background: #10b981;
                color: white;
            }

            .testoria-alert.error .testoria-alert-icon {
                background: #ef4444;
                color: white;
            }

            .testoria-alert.warning .testoria-alert-icon {
                background: #f59e0b;
                color: white;
            }

            .testoria-alert.info .testoria-alert-icon {
                background: var(--accent-color);
                color: white;
            }

            .testoria-alert-content {
                flex: 1;
                color: var(--text-primary);
            }

            .testoria-alert-title {
                font-weight: 600;
                margin-bottom: 4px;
                font-size: 14px;
            }

            .testoria-alert-message {
                font-size: 13px;
                color: var(--text-secondary);
                line-height: 1.4;
            }

            .testoria-alert-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
                font-size: 16px;
                flex-shrink: 0;
            }

            .testoria-alert-close:hover {
                background: rgba(0,0,0,0.1);
                color: var(--text-primary);
            }

            @keyframes slideInAlert {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutAlert {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .testoria-alert.hiding {
                animation: slideOutAlert 0.3s ease-in forwards;
            }

            /* Адаптивность */
            @media (max-width: 768px) {
                .testoria-alerts-container {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
                
                .testoria-alert {
                    max-width: none;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    show(options) {
        const {
            title = '',
            message = '',
            type = 'info',
            duration = 5000,
            icon = null
        } = options;

        const alert = document.createElement('div');
        alert.className = `testoria-alert ${type}`;

        // Определяем иконку по типу
        const getIcon = () => {
            if (icon) return icon;
            switch(type) {
                case 'success': return '✓';
                case 'error': return '✕';
                case 'warning': return '⚠';
                case 'info': return 'ℹ';
                default: return '💡';
            }
        };

        alert.innerHTML = `
            <div class="testoria-alert-icon">${getIcon()}</div>
            <div class="testoria-alert-content">
                ${title ? `<div class="testoria-alert-title">${title}</div>` : ''}
                <div class="testoria-alert-message">${message}</div>
            </div>
            <button class="testoria-alert-close" onclick="this.parentElement.remove()">
                ×
            </button>
        `;

        this.container.appendChild(alert);

        // Автоматическое закрытие
        if (duration > 0) {
            setTimeout(() => {
                if (alert.parentElement) {
                    alert.classList.add('hiding');
                    setTimeout(() => alert.remove(), 300);
                }
            }, duration);
        }

        return alert;
    }

    // Методы-помощники для разных типов уведомлений
    success(message, title = 'Успех!', duration = 5000) {
        return this.show({ title, message, type: 'success', duration });
    }

    error(message, title = 'Ошибка!', duration = 7000) {
        return this.show({ title, message, type: 'error', duration });
    }

    warning(message, title = 'Внимание!', duration = 6000) {
        return this.show({ title, message, type: 'warning', duration });
    }

    info(message, title = 'Информация', duration = 4000) {
        return this.show({ title, message, type: 'info', duration });
    }

    // Специальные алерты для тестов
    testComplete(score, testTitle) {
        return this.success(
            `Вы набрали ${score}% в тесте "${testTitle}"`,
            'Тест завершен! 🎉',
            6000
        );
    }

    timeWarning(timeLeft) {
        return this.warning(
            `До конца теста осталось ${timeLeft} секунд`,
            'Время истекает! ⏰',
            3000
        );
    }

    authSuccess(userName) {
        return this.success(
            `Добро пожаловать, ${userName}!`,
            'Успешный вход! 👋',
            4000
        );
    }

    profileUpdated() {
        return this.success(
            'Ваши данные были успешно обновлены',
            'Профиль сохранен! 💾',
            3000
        );
    }
}

// Создаем глобальный экземпляр
window.testoriaAlerts = new TestoriaAlerts();

// Заменяем стандартные alert, confirm, prompt
window.customAlert = (message, title = 'Testoria') => {
    return window.testoriaAlerts.info(message, title);
};

window.customConfirm = (message, title = 'Подтверждение') => {
    return new Promise((resolve) => {
        const alert = window.testoriaAlerts.show({
            title,
            message: `${message}<br><br>
                     <div style="display: flex; gap: 10px; margin-top: 10px;">
                         <button class="btn btn-primary" onclick="handleConfirm(true)">Да</button>
                         <button class="btn btn-outline" onclick="handleConfirm(false)">Нет</button>
                     </div>`,
            type: 'info',
            duration: 0 // Не закрывается автоматически
        });

        const handleConfirm = (result) => {
            alert.remove();
            resolve(result);
        };

        // Делаем функции глобальными для обработчиков
        window.handleConfirm = handleConfirm;
    });
};

window.customPrompt = (message, title = 'Ввод данных', defaultValue = '') => {
    return new Promise((resolve) => {
        const alert = window.testoriaAlerts.show({
            title,
            message: `${message}<br><br>
                     <input type="text" 
                            value="${defaultValue}" 
                            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 10px;"
                            id="promptInput">
                     <div style="display: flex; gap: 10px;">
                         <button class="btn btn-primary" onclick="handlePrompt(true)">OK</button>
                         <button class="btn btn-outline" onclick="handlePrompt(false)">Отмена</button>
                     </div>`,
            type: 'info',
            duration: 0
        });

        const handlePrompt = (confirmed) => {
            const input = document.getElementById('promptInput');
            const value = confirmed ? input.value : null;
            alert.remove();
            resolve(value);
        };

        window.handlePrompt = handlePrompt;

        // Фокус на инпуте
        setTimeout(() => {
            const input = document.getElementById('promptInput');
            if (input) input.focus();
        }, 100);
    });
};