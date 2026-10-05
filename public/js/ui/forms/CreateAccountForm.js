class CreateAccountForm extends AsyncForm {
  /**
   * Обрабатывает данные формы создания счета.
   * @param {Object} data - Объект с данными формы { name }
   */
  onSubmit(data) {
    Account.create(data, (err, response) => {
      // Если произошла ошибка сети или сервер вернул ошибку валидации
      if (err || !response.success) {
        console.error('Ошибка создания счета:', err || response.error);
        return;
      }

      // --- УСПЕШНОЕ СОЗДАНИЕ ---

      // 1. Сбрасываем форму
      this.element.reset();

      // 2. Закрываем модальное окно
      const modalEl = this.element.closest('.modal.in');
      if (modalEl) {
        const modal = App.getModal(modalEl.dataset.modalId);
        if (modal) modal.close();
      }

      // 3. Обновляем состояние приложения (виджеты и страницы)
      App.update();
    });
  }
}

window.CreateAccountForm = CreateAccountForm;
