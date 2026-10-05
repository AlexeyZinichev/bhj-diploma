class TransactionsWidget {
  /**
   * @param {HTMLElement} element - Контейнер с кнопками (div.transactions-panel)
   */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент виджета TransactionsWidget не передан');
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Устанавливает обработчики нажатия на кнопки "Доход" и "Расход".
   */
  registerEvents() {
    const incomeBtn = this.element.querySelector('.create-income-button');
    const expenseBtn = this.element.querySelector('.create-expense-button');

    // Кнопка "Доход"
    if (incomeBtn) {
      incomeBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const modal = App.getModal('newIncome');
        if (modal) modal.open();
      });
    }

    // Кнопка "Расход"
    if (expenseBtn) {
      expenseBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const modal = App.getModal('newExpense');
        if (modal) modal.open();
      });
    }
  }
}

window.TransactionsWidget = TransactionsWidget;
