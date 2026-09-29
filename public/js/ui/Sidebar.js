// public/js/ui/Sidebar.js

export class Sidebar {
  /**
   * Инициализация кнопки сворачивания/разворачивания боковой колонки.
   * Работает на основе переключения классов на теге body.
   */
  initToggleButton() {
    // Находим кнопку. В ТЗ указан класс .sidebar-toggle visible-xs.
    // Используем только базовый класс для универсальности.
    const toggleBtn = document.querySelector('.sidebar-toggle');

    // Проверяем наличие кнопки на странице, чтобы избежать ошибок в консоли
    if (!toggleBtn) {
      console.warn('Кнопка .sidebar-toggle не найдена в DOM');
      return;
    }

    toggleBtn.addEventListener('click', (event) => {
      // Отменяем стандартное поведение ссылки <a href="#">
      event.preventDefault();

      // Получаем ссылку на корневой тег body
      const body = document.querySelector('body');
      
      // Если body не найден (крайне маловероятно), прекращаем выполнение
      if (!body) return;

      // Переключаем классы. 
      // Если класс есть - он удалится, если нет - добавится.
      body.classList.toggle('sidebar-open');
      body.classList.toggle('sidebar-collapse');
    });
  }
}
