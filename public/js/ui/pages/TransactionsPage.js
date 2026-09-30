// public/js/ui/pages/TransactionsPage.js

import { Account } from '../api/Account.js';
import { Transaction } from '../api/Transaction.js';
import { App } from '../../App.js';

export class TransactionsPage {
  /**
   * @param {HTMLElement} element - Контейнер страницы (div.content-wrapper)
   */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент страницы TransactionsPage не передан');
    }

    this.element = element;
    this.lastOptions = null; // Для хранения ID выбранного счета

    this.registerEvents();
  }

  /**
   * Устанавливает обработчики событий для кнопок удаления.
   * Используется делегирование событий.
   */
  registerEvents() {
    this.element.addEventListener('click', (event) => {
      // Удаление счета
      if (event.target.closest('.remove-account')) {
        event.preventDefault();
        this.removeAccount();
      }

      // Удаление транзакции
      const removeBtn = event.target.closest('.transaction__remove');
      if (removeBtn) {
        event.preventDefault();
        const id = removeBtn.dataset.id;
        if (id) {
          this.removeTransaction(id);
        }
      }
    });
  }

  /**
   * Отрисовывает страницу транзакций для конкретного счета.
   * @param {Object} options - Объект с настройками { account_id }
   */
  render(options) {
    if (!options || !options.account_id) return;

    // Сохраняем опции для метода update()
    this.lastOptions = options;

    const contentContainer = this.element.querySelector('.content');
    if (!contentContainer) return;

    // Показываем лоадер
    contentContainer.innerHTML = '<p>Загрузка транзакций...</p>';

    // 1. Получаем информацию о самом счете для заголовка
    Account.get(options.account_id, (errAcc, resAcc) => {
      if (errAcc || !resAcc || !resAcc.success) return;
      this.renderTitle(resAcc.data);

      // 2. Получаем список транзакций для этого счета
      Transaction.list({ account_id: options.account_id }, (errTr, resTr) => {
        if (errTr || !resTr || !resTr.success) return;
        this.renderTransactions(resTr.data);
      });
    });
  }

  /**
   * Удаляет текущий счет.
   */
  removeAccount() {
    if (!this.lastOptions) return;

    if (!confirm('Вы действительно хотите удалить счёт?')) {
      return;
    }

    Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
      if (err || !response.success) return;
      
      // После удаления счета обновляем виджеты (где счета пересчитаются)
      // и формы (чтобы счет исчез из выпадающего списка)
      App.updateWidgets();
      App.updateForms();
    });
  }

  /**
   * Удаляет конкретную транзакцию.
   * @param {string} id - ID транзакции
   */
  removeTransaction(id) {
    if (!confirm('Вы действительно хотите удалить эту транзакцию?')) {
      return;
    }

    Transaction.remove({ id: id }, (err, response) => {
      if (err || !response.success) return;
      
      // Обновляем текущую страницу, чтобы транзакция исчезла из списка
      this.update();
    });
  }

  /**
   * Обновляет страницу. Вызывается при добавлении/удалении транзакций.
   */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
    }
  }

  /**
   * Очищает страницу (вызывается при выходе пользователя или смене состояния).
   */
  clear() {
    this.lastOptions = null;
    this.renderTitle({ name: 'Название счёта' });
    this.renderTransactions([]);
  }

  /**
   * Отрисовывает заголовок страницы (название счета).
   * @param {Object} data - Объект счета { name }
   */
  renderTitle(data) {
    const titleEl = this.element.querySelector('.content-title');
    const descEl = this.element.querySelector('.content-description');

    if (titleEl) {
      titleEl.textContent = data.name || 'Название счёта';
    }
    if (descEl) {
      descEl.textContent = 'Счёт';
    }
  }

  /**
   * Преобразует строку даты из БД в человекочитаемый формат.
   * @param {string} dateStr - Строка даты "2019-03-10 03:20:41"
   * @returns {string} - "10 марта 2019 г. в 03:20"
   */
  formatDate(dateStr) {
    // Заменяем пробел на T для корректного парсинга ISO-like строки
    const date = new Date(dateStr.replace(' ', 'T'));
    
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  /**
   * Формирует HTML-код одной транзакции.
   * @param {Object} item - Объект транзакции
   * @returns {string} HTML-строка
   */
  getTransactionHTML(item) {
    const type = item.type.toLowerCase();
    const typeClass = type === 'income' ? 'transaction_income' : 'transaction_expense';
    
    const date = this.formatDate(item.created_at);
    const sum = item.sum.toLocaleString('ru-RU');

    return `
      <div class="transaction ${typeClass} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>
              <div class="transaction__date">${date}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
              ${sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                <i class="fa fa-trash"></i>  
            </button>
        </div>
      </div>`;
  }

  /**
   * Отрисовывает список транзакций.
   * @param {Array} data - Массив объектов транзакций
   */
  renderTransactions(data) {
    const container = this.element.querySelector('.content');
    if (!container) return;

    container.innerHTML = '';

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="text-center">Транзакций пока нет</p>';
      return;
    }

    data.forEach((item) => {
      container.insertAdjacentHTML('beforeend', this.getTransactionHTML(item));
    });
  }
}
