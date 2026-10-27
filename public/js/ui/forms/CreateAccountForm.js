class CreateAccountForm extends AsyncForm {
  /**
   * Обрабатывает данные формы создания счета.
   * @param {Object} data - Объект с данными формы { name }
   */
 // public/js/ui/forms/CreateAccountForm.js

onSubmit(data) {
  Account.create(data, (err, response) => {
    if (err || !response.success) {
      console.error('Ошибка создания счета:', err || response.error);
      return;
    }

    // --- УСПЕХ ---
    this.element.reset();

    // Вместо поиска по dataset.modalId, берем имя "createAccount" напрямую
    const modal = App.getModal('createAccount'); 
    
    if (modal) {
      modal.close();
    }

    App.update();
  });
}
}

window.CreateAccountForm = CreateAccountForm;
