class CreateAccountForm extends AsyncForm {
  /**
   * Конструктор: вызывает родителя и сразу загружает список счетов в <select>
   */
  constructor(element) {
    super(element); // Важно: вызов родителя!
    this.renderAccountsList();
  }

  /**
   * Загружает счета в выпадающий список
   */
  renderAccountsList() {
    const select = this.element.querySelector('.accounts-select');
    if (!select) return;

    select.innerHTML = '<option disabled selected>Загрузка...</option>';

    Account.list(null, (err, response) => {
      if (err || !response.success) {
        select.innerHTML = '<option disabled>Ошибка</option>';
        return;
      }

      select.innerHTML = '<option disabled selected>Выберите счет</option>';
      response.data.forEach(acc => {
        const option = document.createElement('option');
        option.value = acc.id;
        option.textContent = `${acc.name} / ${acc.sum.toLocaleString('ru-RU')} ₽`;
        select.appendChild(option);
      });
    });
  }

  /**
   * Обрабатывает данные формы создания счета.
   * @param {Object} data - Объект с данными формы { name }
   */
  onSubmit(data) {
    Account.create(data, (err, response) => {
      if (err || !response.success) {
        console.error('Ошибка создания счета:', err || response.error);
        return;
      }

      // --- УСПЕХ ---
      this.element.reset();

      // Закрываем окно по фиксированному имени из App.js
      const modal = App.getModal('createAccount'); 
      if (modal) {
        modal.close();
      }

      App.update();
    });
  }
} 

// Экспортируем класс в глобальную область для App.js
window.CreateAccountForm = CreateAccountForm;
