// public/js/ui/forms/RegisterForm.js

import { AsyncForm } from './AsyncForm.js';
import { User } from '../api/User.js';
import { App } from '../../App.js';

export class RegisterForm extends AsyncForm {
  /**
   * Обрабатывает данные формы регистрации.
   * @param {Object} data - Объект с данными формы { name, email, password }
   */
  onSubmit(data) {
    // Вызываем метод API для регистрации пользователя
    User.register(data, (err, response) => {
      // Если произошла сетевая ошибка или сервер вернул ошибку валидации
      if (err || !response.success) {
        // В реальном проекте здесь стоит показать уведомление пользователю
        console.error('Ошибка регистрации:', err || response.error);
        return;
      }

      // --- УСПЕШНАЯ РЕГИСТРАЦИЯ ---

      // 1. Сбрасываем форму (очищаем поля)
      this.element.reset();

      // 2. Устанавливаем состояние приложения как "user-logged"
      // Это переключит интерфейс на версию для авторизованного пользователя
      App.setState('user-logged');

      // 3. Находим родительское модальное окно и закрываем его
      // this.element.closest('.modal.in') находит ближайший элемент с классом .modal.in
      const modalEl = this.element.closest('.modal.in');
      
      if (modalEl) {
        // id модального окна передается через data-modal-id (например, "register")
        const modal = App.getModal(modalEl.dataset.modalId);
        if (modal) {
          modal.close();
        }
      }
    });
  }
}
