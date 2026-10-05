class LoginForm extends AsyncForm {
  /**
   * Обрабатывает данные формы входа.
   * @param {Object} data - Объект с данными формы { email, password }
   */
  onSubmit(data) {
    // Вызываем метод API для авторизации пользователя
    User.login(data, (err, response) => {
      // Если произошла сетевая ошибка или сервер вернул ошибку (неверный логин/пароль)
      if (err || !response.success) {
        // В реальном проекте здесь стоит показать уведомление пользователю
        console.error('Ошибка входа:', err || response.error);
        return;
      }

      // --- УСПЕШНЫЙ ВХОД ---

      // 1. Сбрасываем форму (очищаем поля пароля и email)
      this.element.reset();

      // 2. Устанавливаем состояние приложения как "user-logged"
      // Это переключит интерфейс на версию для авторизованного пользователя
      App.setState('user-logged');

      // 3. Находим родительское модальное окно и закрываем его
      // this.element.closest('.modal.in') находит ближайший открытый элемент модального окна
      const modalEl = this.element.closest('.modal.in');
      
      if (modalEl) {
        // id модального окна передается через data-modal-id (в HTML это "login")
        const modal = App.getModal(modalEl.dataset.modalId);
        if (modal) {
          modal.close();
        }
      }
    });
  }
}

window.LoginForm = LoginForm;