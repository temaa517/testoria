// script.js
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.htmlElement = document.documentElement;
        this.init();
    }

    init() {
        // Проверяем сохраненную тему или системные настройки
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (systemPrefersDark) {
            this.setTheme('dark');
        }

        // Добавляем обработчик клика
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Следим за изменениями системной темы
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        this.htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Обновляем aria-label для доступности
        this.themeToggle.setAttribute('aria-label', 
            theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему');
    } 

    toggleTheme() {
        const currentTheme = this.htmlElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);

        // Добавляем анимацию
        this.themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }
}

// Инициализация когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});

// Дополнительные функции для плавного перехода
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем класс для плавных переходов после загрузки
    setTimeout(() => {
        document.body.classList.add('theme-transitions');
    }, 100);
});