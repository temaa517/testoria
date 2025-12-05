class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.userManager = new UserManager();
        this.init();
    }

    init() {
        // Проверяем авторизацию
        if (!this.userManager.getCurrentUser()) {
            window.location.href = 'login.html';
            return;
        }
        
        this.currentUser = this.userManager.getCurrentUser();
        this.setupEventListeners();
        this.loadProfileData();
    }

    setupEventListeners() {
        // Кнопка выхода
        document.getElementById('logoutProfile')?.addEventListener('click', () => {
            this.logout();
        });

        // Сохранение имени
        document.getElementById('saveUserName')?.addEventListener('click', () => {
            this.updateUserName();
        });

        // Переключение вкладок
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
    }

    switchTab(tabName) {
        // Обновляем активные кнопки
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Обновляем активные вкладки
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`)?.classList.add('active');

        // Загружаем данные для вкладки
        if (tabName === 'history') {
            this.loadHistory();
        } else if (tabName === 'stats') {
            this.loadStatistics();
        }
    }

    loadProfileData() {
        if (!this.currentUser) return;

        // Основная информация
        document.getElementById('userName').textContent = this.currentUser.name || 'Пользователь';
        document.getElementById('userNameInput').value = this.currentUser.name || '';
        
        // Дата регистрации
        const joinDate = this.currentUser.registrationDate ? 
            new Date(this.currentUser.registrationDate).toLocaleDateString('ru-RU') : 
            new Date().toLocaleDateString('ru-RU');
        document.getElementById('userJoinDate').textContent = `Участник с ${joinDate}`;

        // Загружаем статистику и историю
        this.loadStatistics();
        this.loadHistory();
    }

    loadStatistics() {
        const testHistory = this.getTestHistory();
        const stats = this.calculateStatistics(testHistory);
        
        document.getElementById('testsCompleted').textContent = stats.testsCompleted;
        document.getElementById('totalTime').textContent = this.formatTime(stats.totalTime);
        document.getElementById('achievementsCount').textContent = stats.achievementsCount;

        this.loadRecentActivity(testHistory);
    }

    getTestHistory() {
        // Получаем историю тестов из localStorage
        const allResults = JSON.parse(localStorage.getItem('testResults')) || [];
        return allResults.filter(result => result.userId === this.currentUser.id);
    }

    calculateStatistics(testHistory) {
        const testsCompleted = testHistory.length;
        const totalTime = testHistory.reduce((total, test) => total + (test.timeSpent || 0), 0);
        
        // Простая система достижений
        const achievements = [];
        if (testsCompleted >= 1) achievements.push('Первый тест');
        if (testsCompleted >= 5) achievements.push('Опытный тестируемый');
        if (testsCompleted >= 10) achievements.push('Мастер тестов');

        return {
            testsCompleted,
            totalTime,
            achievementsCount: achievements.length
        };
    }

    loadHistory() {
        const historyList = document.getElementById('historyList');
        const testHistory = this.getTestHistory();
        
        if (testHistory.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <h3>История тестов пуста</h3>
                    <p>Пройдите свой первый тест, чтобы увидеть его здесь!</p>
                    <a href="catalog.html" class="btn btn-primary">Найти тест</a>
                </div>
            `;
            return;
        }

        historyList.innerHTML = testHistory.map(test => `
            <div class="history-item" style="cursor: pointer;" onclick="window.location.href='results.html?resultId=${test.id}'">
                <div class="test-info">
                    <h4>${test.testTitle || 'Неизвестный тест'}</h4>
                    <p class="test-score">Результат: ${test.score || 0}%</p>
                    <p class="test-description">${test.result?.title || 'Тест завершен'}</p>
                </div>
                <div class="test-meta">
                    <span class="test-date">${new Date(test.completedAt || Date.now()).toLocaleDateString('ru-RU')}</span>
                    <span class="test-time">${this.formatTime(test.timeSpent || 0)}</span>
                    <i class="fas fa-arrow-right" style="margin-left: 10px; opacity: 0.6;"></i>
                </div>
            </div>
        `).join('');
    }

    loadRecentActivity(testHistory) {
        const activityList = document.getElementById('recentActivity');
        const recentTests = testHistory.slice(0, 5).reverse();
        
        if (recentTests.length === 0) {
            activityList.innerHTML = '<p class="no-activity">Нет недавней активности</p>';
            return;
        }

        activityList.innerHTML = recentTests.map(test => `
            <div class="activity-item">
                <i class="fas fa-check-circle"></i>
                <div class="activity-content">
                    <span class="activity-text">Пройден тест "${test.testTitle || 'Неизвестный тест'}"</span>
                    <span class="activity-score">${test.score || 0}%</span>
                    <span class="activity-time">${this.formatRelativeTime(test.completedAt)}</span>
                </div>
            </div>
        `).join('');
    }

    updateUserName() {
        const newName = document.getElementById('userNameInput').value.trim();
        if (!newName) {
            testoriaAlerts.warning('Введите имя пользователя');
            return;
        }

        try {
            // Обновляем имя через UserManager
            this.userManager.updateUserName(this.currentUser.id, newName);
            this.currentUser.name = newName;
            
            testoriaAlerts.success('Имя пользователя обновлено!');
            this.loadProfileData(); // Обновляем отображение
        } catch (error) {
            testoriaAlerts.error('Ошибка при обновлении имени: ' + error.message);
        }
    }

    async logout() {
        const confirmed = await customConfirm('Вы уверены, что хотите выйти из аккаунта?', 'Подтверждение выхода');
        if (confirmed) {
            this.userManager.logout();
            window.location.href = 'index.html';
        }
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return hours > 0 ? `${hours}ч ${minutes}м` : `${minutes}м`;
    }

    formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'только что';
        if (diffMins < 60) return `${diffMins} мин назад`;
        if (diffHours < 24) return `${diffHours} ч назад`;
        if (diffDays < 7) return `${diffDays} д назад`;
        return date.toLocaleDateString('ru-RU');
    }
}