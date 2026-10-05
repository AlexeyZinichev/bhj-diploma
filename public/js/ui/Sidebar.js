class Sidebar {
   /**
   * Регистрирует обработчики событий для ссылок 
   * "Регистрация", "Войти" и "Выйти" в боковом меню.
   */
  initAuthLinks() {
    // Находим ссылки по их id (убедитесь, что они есть в вашем HTML)
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');

    // 1. Обработчик для кнопки "Регистрация"
    if (registerLink) {
      registerLink.addEventListener('click', (event) => {
        event.preventDefault(); 
        const modal = App.getModal('register');
        if (modal) modal.open();
      });
    }

    // 2. Обработчик для кнопки "Войти"
    if (loginLink) {
      loginLink.addEventListener('click', (event) => {
        event.preventDefault();
        const modal = App.getModal('login');
        if (modal) modal.open();
      });
    }

    // 3. Обработчик для кнопки "Выйти"
    if (logoutLink) {
      logoutLink.addEventListener('click', (event) => {
        event.preventDefault();
        
        User.logout((err, response) => {
          // Если сервер подтвердил выход или произошла ошибка сети
          if ((response && response.success) || err) {
            App.setState('init');
          }
        });
      });
    }
  }

  /**
   * Инициализация кнопки скрытия/показа боковой колонки.
   * Переключает классы sidebar-open и sidebar-collapse у тега body.
   */
  initToggleButton() {
    const toggleBtn = document.querySelector('.sidebar-toggle');

    if (!toggleBtn) {
      console.warn('Кнопка .sidebar-toggle не найдена в DOM');
      return;
    }

    toggleBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const body = document.querySelector('body');
      if (!body) return;

      body.classList.toggle('sidebar-open');
      body.classList.toggle('sidebar-collapse');
    });
  }

  /**
   * Статический метод для инициализации всей логики сайдбара.
   * Вызывается из App.init(). Создает экземпляр и запускает методы.
   */
  static init() {
    const instance = new Sidebar();
    instance.initToggleButton();
    instance.initAuthLinks();
  }
}
