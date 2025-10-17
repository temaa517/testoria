// auth-header.js - Управление хедером на всех страницах
class AuthHeaderManager {
    constructor() {
        this.userManager = new UserManager();
        this.init();
    }

    init() {
        this.updateHeader();
        this.setupThemeManager();
    }

    updateHeader() {
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) {
            console.log('Элемент .auth-buttons не найден');
            return;
        }

        console.log('Обновление хедера, пользователь авторизован:', this.userManager.isLoggedIn());

        if (localStorage.getItem('isLoggedIn') === 'true' || this.userManager.isLoggedIn()) {
            const user = this.userManager.getCurrentUser();
            authButtons.innerHTML = `
                <a href="profile.html" class="btn btn-user">
                    <i class="fas fa-user"></i>
                    ${user.name}
                </a>
            `;
        } else {
            authButtons.innerHTML = `
                <a href="login.html" class="btn btn-login">
                    <i class="fas fa-sign-in-alt"></i>
                    Войти
                </a>
                <a href="register.html" class="btn btn-register">
                    <i class="fas fa-user-plus"></i>
                    Регистрация
                </a>
            `;
        }
    }

    setupThemeManager() {
        // Инициализация темы
        if (!window.themeManager) {
            window.themeManager = new ThemeManager();
        }
    }
}

// Закрытие выпадающего меню при клике вне его
document.addEventListener('click', function(e) {
    if (!e.target.closest('.profile-dropdown')) {
        const dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
});

// Открытие/закрытие меню профиля
function toggleProfileMenu() {
    const dropdown = document.querySelector('.dropdown-content');
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('Инициализация AuthHeaderManager');
    window.authHeaderManager = new AuthHeaderManager();
    
    // Плавная загрузка страницы
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});