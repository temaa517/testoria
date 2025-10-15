// auth-core.js - Основные классы для системы аутентификации

// UserManager класс
class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('testoria_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('testoria_current_user')) || null;
    }

    register(userData) {
        const existingUser = this.users.find(user => user.name.toLowerCase() === userData.name.toLowerCase());
        if (existingUser) {
            throw new Error('Пользователь с таким именем уже существует');
        }

        const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            password: this.hashPassword(userData.password),
            createdAt: new Date().toISOString(),
            stats: {
                testsCompleted: 0,
                totalTime: 0,
                favoriteCategory: null
            },
            history: [],
            achievements: []
        };

        this.users.push(newUser);
        this.saveUsers();
        this.loginByName(userData.name, userData.password);
        
        // Обновляем хедер после регистрации
        if (window.authHeaderManager) {
            window.authHeaderManager.updateHeader();
        }
        
        return newUser;
    }

    loginByName(name, password) {
        const user = this.users.find(u => 
            u.name.toLowerCase() === name.toLowerCase() && 
            u.password === this.hashPassword(password)
        );
        
        if (!user) {
            throw new Error('Неверное имя пользователя или пароль');
        }

        this.currentUser = user;
        localStorage.setItem('testoria_current_user', JSON.stringify(user));
        
        // Обновляем хедер после входа
        if (window.authHeaderManager) {
            window.authHeaderManager.updateHeader();
        }
        
        return user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('testoria_current_user');
        
        // Обновляем хедер после выхода
        if (window.authHeaderManager) {
            window.authHeaderManager.updateHeader();
        }
    }

    updateUserStats(testData) {
        if (!this.currentUser) return;

        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex].stats.testsCompleted++;
            this.users[userIndex].stats.totalTime += testData.time || 0;
            
            this.users[userIndex].history.unshift({
                testId: testData.testId,
                testTitle: testData.testTitle,
                result: testData.result,
                completedAt: new Date().toISOString(),
                timeSpent: testData.time || 0
            });

            if (this.users[userIndex].history.length > 50) {
                this.users[userIndex].history = this.users[userIndex].history.slice(0, 50);
            }

            this.saveUsers();
            this.currentUser = this.users[userIndex];
            localStorage.setItem('testoria_current_user', JSON.stringify(this.currentUser));
        }
    }

    hashPassword(password) {
        return btoa(password);
    }

    saveUsers() {
        localStorage.setItem('testoria_users', JSON.stringify(this.users));
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateUserName(newName) {
        if (!this.currentUser) return;

        const existingUser = this.users.find(user => 
            user.name.toLowerCase() === newName.toLowerCase() && 
            user.id !== this.currentUser.id
        );
        
        if (existingUser) {
            throw new Error('Пользователь с таким именем уже существует');
        }

        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex].name = newName;
            this.saveUsers();
            this.currentUser = this.users[userIndex];
            localStorage.setItem('testoria_current_user', JSON.stringify(this.currentUser));
            
            // Обновляем хедер
            if (window.authHeaderManager) {
                window.authHeaderManager.updateHeader();
            }
        }
    }
}

// Функция для обновления отображения кнопок в шапке
function updateHeaderAuthState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const authButtons = document.getElementById('auth-buttons');
    const profileSection = document.getElementById('profile-section');
    
    if (isLoggedIn === 'true') {
        // Пользователь вошел - показываем профиль, скрываем кнопки входа
        if (authButtons) authButtons.style.display = 'none';
        if (profileSection) profileSection.style.display = 'block';
    } else {
        // Пользователь не вошел - показываем кнопки входа, скрываем профиль
        if (authButtons) authButtons.style.display = 'block';
        if (profileSection) profileSection.style.display = 'none';
    }
}

// Вызываем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateHeaderAuthState();
});

// ThemeManager класс
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.htmlElement = document.documentElement;
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (systemPrefersDark) {
            this.setTheme('dark');
        }

        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        this.htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (this.themeToggle) {
            this.themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему');
        }
    }

    toggleTheme() {
        const currentTheme = this.htmlElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);

        if (this.themeToggle) {
            this.themeToggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.themeToggle.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
}

// Автоматическая проверка авторизации при загрузке любой страницы
document.addEventListener('DOMContentLoaded', function() {
    updateHeaderAuthState();
});

// Также проверяем при изменении localStorage (если открыто несколько вкладок)
window.addEventListener('storage', function(e) {
    if (e.key === 'isLoggedIn') {
        updateHeaderAuthState();
    }
});