/**
 * Класс UserWidget отвечает за
 * отображение информации о имени пользователя
 * после авторизации или его выхода из системы
 * */

class UserWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    // 1. Проверка на пустой элемент
    if (!element) {
      throw new Error('Элемент виджета UserWidget не передан');
    }

    // 2. Сохранение элемента в свойство
    this.element = element;
  }

  /**
   * Получает информацию о текущем пользователе
   * с помощью User.current()
   * Если пользователь авторизован,
   * в элемент .user-name устанавливает имя
   * авторизованного пользователя
   * */
  update() {
    // 1. Получаем объект пользователя из localStorage
    const user = User.current();

    // 2. Ищем внутри нашего элемента (this.element) тег с классом .user-name
    const nameElement = this.element.querySelector('.user-name');

    // 3. Если и пользователь есть, и элемент найден
    if (user && nameElement) {
      // Записываем имя
      nameElement.textContent = user.name;
    } 
    // 4. Если пользователя нет (вышел из системы)
    else if (nameElement) {
      // Можно написать "Гость" или оставить пустым
      nameElement.textContent = 'Гость'; 
    }
  }
}

window.UserWidget = UserWidget;
