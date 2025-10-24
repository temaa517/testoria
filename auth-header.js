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
        const userManager = new UserManager();
        const currentUser = userManager.getCurrentUser();
        
        const authButtons = document.getElementById('auth-buttons');
        const profileSection = document.getElementById('profile-section');
        
        console.log('Обновление хедера, текущий пользователь:', currentUser);
        
        if (currentUser && currentUser.name) { // ДОБАВИЛИ ПРОВЕРКУ
            if (authButtons) authButtons.style.display = 'none';
            if (profileSection) profileSection.style.display = 'block';
            
            // Обновляем имя в профиле если есть элемент
            const profileName = document.getElementById('profile-name');
            if (profileName) {
                profileName.textContent = currentUser.name;
            }
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (profileSection) profileSection.style.display = 'none';
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