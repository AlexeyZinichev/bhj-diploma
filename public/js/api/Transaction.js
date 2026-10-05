class Transaction extends Entity {
  static URL = '/transaction';
  // Наследует list, create, remove. 
    // Метод get для транзакций в ТЗ не требуется, но при необходимости его можно добавить по аналогии с Account.
}

window.Transaction = Transaction;
