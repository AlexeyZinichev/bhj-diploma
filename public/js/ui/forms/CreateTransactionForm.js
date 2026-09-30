// public/js/ui/forms/CreateTransactionForm.js

import { AsyncForm } from './AsyncForm.js';
import { Transaction } from '../api/Transaction.js';
import { Account } from '../api/Account.js';
import { App } from '../../App.js';

export class CreateTransactionForm extends AsyncForm {
  /**
   * @param {HTMLFormElement} element - Элемент формы (#new-income-form или #new-expense-form)
   */
  constructor(element) {
    super(element); // Вызываем конструктор AsyncForm (который вешает submit)
    this.renderAccountsList(); // Сразу при создании формы загружаем счета
  }

  /**
   * Загружает список счетов пользователя и заполняет ими выпадающий список <select>.
   */
  renderAccountsList() {
    const select = this.element.querySelector('.accounts-select');
    if (!select) return;

    // Очищаем список и ставим заглушку, пока идет загрузка
    select.innerHTML = '<option disabled selected>Загрузка счетов...</option>';

    Account.list(null, (err, response) => {
      if (err || !response || !response.success) {
        select.innerHTML = '<option disabled>Ошибка загрузки</option>';
        return;
      }

      const accounts = response.data;
      
      // Очищаем перед заполнением актуальными данными
      select.innerHTML = '<option disabled selected>Выберите счет</option>';

      if (accounts.length === 0) {
        select.innerHTML = '<option disabled>Нет доступных счетов</option>';
        return;
      }

      // Формируем <option> для каждого счета
      accounts.forEach((account) => {
        const option = document.createElement('option');
        option.value = account.id;
        
        // Форматируем сумму для красоты (например: 1 000.00)
        const formattedSum = account.sum.toLocaleString('ru-RU', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });

        option.textContent = `${account.name} / ${formattedSum} ₽`;
        select.appendChild(option);
      });
    });
  }

  /**
   * Обрабатывает отправку формы.
   * @param {Object} data - Данные формы { type, name, sum, account_id }
   */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (err || !response.success) {
        console.error('Ошибка создания транзакции:', err || response.error);
        return;
      }

      // --- УСПЕШНОЕ СОЗДАНИЕ ---

      // 1. Сбрасываем поля формы
      this.element.reset();

      // 2. Закрываем модальное окно
      const modalEl = this.element.closest('.modal.in');
      if (modalEl) {
        const modal = App.getModal(modalEl.dataset.modalId);
        if (modal) modal.close();
      }

      // 3. Обновляем всё приложение (виджеты счетов, баланс, таблицу транзакций)
      App.update();
    });
  }
}
