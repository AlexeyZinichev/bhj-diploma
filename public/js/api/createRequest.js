export const createRequest = (options) => {
  const {
    url,
    method = 'GET',
    data = null,
    callback,
    responseType = 'json'
  } = options;

  const xhr = new XMLHttpRequest();
  xhr.responseType = responseType;

  // Обработка сетевых ошибок
  xhr.onerror = () => callback(new Error('Сетевая ошибка'), null);
  xhr.timeout = () => callback(new Error('Превышено время ожидания'), null);

  xhr.onload = () => {
    // Проверяем статус ответа (успешными считаем 2xx)
    if (xhr.status >= 200 && xhr.status < 300) {
      callback(null, xhr.response);
    } else {
      // Сервер вернул ошибку (например, 400 или 500)
      callback(xhr.response || new Error(`Ошибка ${xhr.status}`), null);
    }
  };

  try {
    // 1. Подготовка URL и данных для GET
    let finalUrl = url;
    let body = null;

    if (method === 'GET' && data) {
      const queryParams = new URLSearchParams(data).toString();
      finalUrl += `?${queryParams}`;
    } else if (data) {
      // 2. Подготовка данных для POST/PUT/DELETE через FormData
      const formData = new FormData();
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          formData.append(key, data[key]);
        }
      }
      body = formData;
    }

    xhr.open(method, finalUrl);
    xhr.send(body);
  } catch (e) {
    // Перехват ошибок инициализации (например, если URL невалидный)
    callback(e, null);
  }
};
