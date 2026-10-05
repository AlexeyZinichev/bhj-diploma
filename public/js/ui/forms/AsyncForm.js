class AsyncForm {
  /**
   * @param {HTMLFormElement} element - DOM-элемент формы
   */
  constructor(element) {
    // 1. Проверка на пустой элемент
    if (!element) {
      throw new Error('Элемент формы не передан');
    }

    this.element = element;

    // 2. Инициализация обработчиков событий
    this.registerEvents();
  }

  /**
   * Запрещает стандартную отправку формы и вызывает метод submit().
   */
  registerEvents() {
    this.element.addEventListener('submit', (event) => {
      // Отменяем стандартное поведение браузера (перезагрузку страницы)
      event.preventDefault();
      
      // Вызываем логику обработки формы
      this.submit();
    });
  }

  /**
   * Собирает данные из полей формы и возвращает объект.
   * Использует объект FormData для корректного обхода всех полей.
   * 
   * @returns {Object} Объект с данными формы { name: value }
   */
  getData() {
    const formData = new FormData(this.element);
    const data = {};

    // FormData.entries() возвращает итератор пар [ключ, значение]
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    return data;
  }

  /**
   * Метод-заглушка. 
   * В дочерних классах (LoginForm, RegisterForm и т.д.) 
   * здесь будет реализована логика отправки данных на сервер.
   * 
   * @param {Object} data - Данные, полученные из метода getData()
   */
  onSubmit(data) {
    // Намеренно оставлен пустым
  }

  /**
   * Собирает данные формы и передает их в метод onSubmit.
   */
  submit() {
    const data = this.getData();
    this.onSubmit(data);
  }
}

window.AsyncForm = AsyncForm;
