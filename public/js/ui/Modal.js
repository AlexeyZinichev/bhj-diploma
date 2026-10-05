class Modal {
  /**
   * @param {HTMLElement} element - DOM-элемент всплывающего окна
   */
  constructor(element) {
    // 1. Проверка на пустой элемент
    if (!element) {
      throw new Error('Элемент модального окна не передан');
    }

    this.element = element;

    // 2. Инициализация обработчиков событий
    this.registerEvents();
  }

  /**
   * Открывает всплывающее окно.
   * Устанавливает inline-стиль display: block.
   */
  open() {
    this.element.style.display = 'block';
    
    // Для корректной работы анимации (если используется Bootstrap),
    // после установки display: block нужно дождаться перерисовки кадра.
    // Это предотвращает мгновенное появление окна без анимации fade.
    setTimeout(() => {
      this.element.classList.add('in');
    }, 10);
  }

  /**
   * Закрывает всплывающее окно.
   * Удаляет inline-стиль display.
   */
  close() {
    // Удаляем класс анимации открытия перед скрытием
    this.element.classList.remove('in');
    
    // Используем requestAnimationFrame, чтобы удаление display произошло 
    // после завершения анимации затухания (обычно 300ms в Bootstrap)
    setTimeout(() => {
      this.element.style.display = '';
    }, 300);
  }

  /**
   * Обработчик нажатия на кнопку закрытия.
   * Вызывает метод close().
   */
  onClose(event) {
    // Отменяем стандартное поведение ссылки (если кнопка — <a href="#">)
    if (event) {
      event.preventDefault();
    }
    this.close();
  }

  /**
   * Назначает обработчики событий для элементов закрытия окна.
   * Ищет внутри контейнера все элементы с атрибутом [data-dismiss="modal"].
   */
  registerEvents() {
    // Используем селектор атрибутов, как указано в ТЗ
    const closeButtons = this.element.querySelectorAll('[data-dismiss="modal"]');

    closeButtons.forEach((button) => {
      button.addEventListener('click', (event) => this.onClose(event));
    });
  }
}

window.Modal = Modal;
