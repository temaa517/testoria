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
        
        if (currentUser && currentUser.name) {
            if (authButtons) authButtons.style.display = 'none';
            if (profileSection) profileSection.style.display = 'block';
            
            // Обновляем имя в профиле если есть элемент
            const profileName = document.getElementById('profile-name');
            if (profileName) {
                profileName.textContent = currentUser.name;
            }
            
            // ПОКАЗЫВАЕМ/СКРЫВАЕМ АДМИН-ССЫЛКУ В МЕНЮ
            this.toggleAdminLink(currentUser);
            
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (profileSection) profileSection.style.display = 'none';
            
            // Скрываем админ-ссылку
            this.toggleAdminLink(null);
        }
    }

    // Показываем/скрываем админ-ссылку в меню профиля
    toggleAdminLink(currentUser) {
        const adminLinks = document.querySelectorAll('.admin-link');
        
        adminLinks.forEach(adminLink => {
            if (currentUser) {
                const userManager = new UserManager();
                const isAdmin = userManager.isAdmin(currentUser);
                
                console.log('Проверка прав админа:', {
                    user: currentUser.name,
                    isAdmin: isAdmin,
                    userData: currentUser
                });
                
                if (isAdmin) {
                    adminLink.style.display = 'block';
                    console.log('✅ Показываем админ-ссылку для:', currentUser.name);
                } else {
                    adminLink.style.display = 'none';
                    console.log('❌ Скрываем админ-ссылку для:', currentUser.name);
                }
            } else {
                adminLink.style.display = 'none';
                console.log('❌ Нет пользователя - скрываем админ-ссылку');
            }
        });
    }

        setupThemeManager() {
            // Инициализация темы
            // Используем функцию для повторных попыток, если ThemeManager еще не загружен
            const initTheme = () => {
                if (typeof ThemeManager !== 'undefined') {
                    if (!window.themeManager) {
                        try {
                            window.themeManager = new ThemeManager();
                            console.log('✅ ThemeManager инициализирован');
                        } catch (error) {
                            console.error('Ошибка инициализации ThemeManager:', error);
                        }
                    }
                } else {
                    // Если ThemeManager еще не загружен, ждем и пробуем снова
                    setTimeout(initTheme, 50);
                }
            };
            
            // Пробуем инициализировать сразу
            initTheme();
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
    
    // Убеждаемся, что ThemeManager загружен перед инициализацией
    if (typeof ThemeManager === 'undefined') {
        console.warn('ThemeManager не найден, ожидаем загрузки...');
        // Ждем загрузки скриптов
        setTimeout(() => {
            window.authHeaderManager = new AuthHeaderManager();
        }, 50);
    } else {
        window.authHeaderManager = new AuthHeaderManager();
    }
    
    // Плавная загрузка страницы
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});