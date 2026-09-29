// public/js/ui/widgets/AccountsWidget.js

import { Account } from '../api/Account.js';
import { User } from '../api/User.js';
import { App } from '../../App.js';

export class AccountsWidget {
  /**
   * @param {HTMLElement} element - DOM-элемент боковой панели счетов
   */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент виджета AccountsWidget не передан');
    }

    this.element = element;

    // Сразу регистрируем события и отрисовываем начальное состояние
    this.registerEvents();
    this.update();
  }

  /**
   * Устанавливает обработчики событий: создание счета и выбор существующего.
   */
  registerEvents() {
    // Кнопка "Новый счёт"
    const createBtn = this.element.querySelector('.create-account');
    if (createBtn) {
      createBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const modal = App.getModal('createAccount');
        if (modal) modal.open();
      });
    }

    // Делегирование: выбор любого счета в списке
    this.element.addEventListener('click', (event) => {
      const targetLink = event.target.closest('.account a');
      
      if (targetLink) {
        event.preventDefault();
        const accountItem = targetLink.closest('.account');
        const accountId = accountItem.dataset.id;
        
        if (accountId) {
          this.onSelectAccount(accountId);
        }
      }
    });
  }

  /**
   * Обновляет список счетов пользователя.
   * Доступно только для авторизованных пользователей.
   */
  update() {
    if (!User.current()) {
      this.clear(); // Очищаем список, если пользователь вышел
      return;
    }

    // Очищаем старые данные перед загрузкой новых
    this.clear();

    Account.list(null, (err, response) => {
      if (err || !response || !response.success) {
        console.error('Ошибка загрузки счетов:', err || response.error);
        return;
      }
      
      this.renderItems(response.data);
    });
  }

  /**
   * Очищает список ранее отображённых счетов.
   */
  clear() {
    const accounts = this.element.querySelectorAll('.account');
    accounts.forEach((account) => account.remove());
  }

  /**
   * Обрабатывает выбор счета пользователем.
   * @param {string|number} id - ID выбранного счета
   */
  onSelectAccount(id) {
    // Убираем класс .active у предыдущего активного счета
    const prevActive = this.element.querySelector('.account.active');
    if (prevActive) {
      prevActive.classList.remove('active');
    }

    // Добавляем класс .active выбранному счету
    const current = this.element.querySelector(`.account[data-id="${id}"]`);
    if (current) {
      current.classList.add('active');
    }

    // Переключаем страницу на отображение транзакций этого счета
    App.showPage('transactions', { account_id: id });
  }

  /**
   * Возвращает HTML-код одного счета.
   * @param {Object} data - Объект счета { id, name, sum }
   * @returns {string} HTML-строка
   */
  getAccountHTML(data) {
    // Форматируем сумму: пробелы как разделители тысяч и 2 знака после запятой
    const formattedSum = data.sum.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' ₽';

    // В базовой реализации ТЗ не передает флаг active в данных,
    // поэтому класс active управляется только через onSelectAccount.
    return `
      <li class="account" data-id="${data.id}">
        <a href="#">
          <span>${data.name}</span> / <span>${formattedSum}</span>
        </a>
      </li>`;
  }

  /**
   * Отрисовывает массив счетов в панели.
   * @param {Array} data - Массив объектов счетов
   */
  renderItems(data) {
    const container = this.element;
    data.forEach((item) => {
      container.insertAdjacentHTML('beforeend', this.getAccountHTML(item));
    });
  }
}
