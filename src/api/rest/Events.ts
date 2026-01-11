import { ref, type Ref } from 'vue'
import type {
  EventData,
  EventTypeData,
  ApiError,
  EventsApiState,
  ApiConfig,
  EventsApiMethods
} from '@/api/rest/types/Event'

const DEFAULT_CONFIG: ApiConfig = {
  baseURL: 'http://localhost:8085/api'
}

export function useEventsApi(config: Partial<ApiConfig> = {}): EventsApiMethods {
  const { baseURL, token: initialToken } = { ...DEFAULT_CONFIG, ...config }
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const token: Ref<string | undefined> = ref(initialToken)

  /**
   * Установка токена авторизации
   */
  const setToken = (newToken: string): void => {
    // Очищаем токен от лишних символов
    const cleanedToken = newToken
      .trim()
      .replace(/^['"]+|['"]+$/g, '') // Убираем кавычки
      .replace(/\\n/g, '')
      .replace(/\r?\n|\r/g, '');
    
    console.log('Токен установлен (первые 30 символов):', cleanedToken.substring(0, 30) + '...');
    token.value = cleanedToken;
  }

  /**
   * Очистка токена
   */
  const clearToken = (): void => {
    token.value = undefined
    console.log('Токен очищен');
  }

  /**
   * Получение токена для отладки
   */
  const getCurrentToken = (): string | undefined => {
    return token.value;
  }

  /**
   * Формирование заголовков запроса
   */
  const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    if (token.value) {
      const currentToken = token.value;
      // Проверяем токен
      if (currentToken.length < 10) {
        console.error('Токен слишком короткий');
      } else if (/[\r\n]/.test(currentToken)) {
        console.error('Токен содержит переносы строк');
      } else {
        console.log('Отправляем Authorization заголовок (первые 30 символов):', 
                   `Bearer ${currentToken.substring(0, 30)}...`);
        headers['Authorization'] = `Bearer ${currentToken}`;
      }
    } else {
      console.warn('Токен не установлен. Запрос будет отправлен без авторизации.');
    }
    
    console.log('Заголовки запроса:', headers);
    return headers
  }

  /**
   * Обработка ошибок API
   */
  const handleApiError = async (response: Response): Promise<ApiError> => {
    try {
      const errorData: ApiError = await response.json()
      return errorData
    } catch {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  }

  /**
   * Создание события
   */
  const createEvent = async (eventData: EventData): Promise<number | ApiError> => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Отправка события:', eventData);
      console.log('URL:', `${baseURL}/events/create`);
      
      const response = await fetch(`${baseURL}/events/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(eventData)
      })

      console.log('Статус ответа:', response.status);
      console.log('Заголовки ответа:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        if (response.status === 401) {
          error.value = 'Неавторизованный доступ. Проверьте токен.'
          throw new Error('Unauthorized')
        }
        
        const errorData = await handleApiError(response)
        error.value = errorData.detail
        return errorData
      }

      // Проверяем, есть ли тело ответа
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const text = await response.text();
          console.log('Тело ответа:', text);
          
          if (text.trim() === '') {
            console.log('Пустой JSON ответ, считаем успешным');
            return 0;
          }
          
          const eventId = JSON.parse(text);
          return eventId;
        } catch (parseError) {
          console.log('Ошибка парсинга JSON:', parseError);
          return 0;
        }
      } else {
        console.log('Не-JSON ответ, считаем успешным');
        return 0;
      }
    } catch (err) {
      console.error('Ошибка при создании события:', err);
      
      if (err instanceof SyntaxError) {
        console.log('Синтаксическая ошибка JSON, но считаем успешным');
        return 0;
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Создание типа события
   */
  const createEventType = async (eventTypeData: EventTypeData): Promise<number | ApiError> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${baseURL}/events/type/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(eventTypeData)
      })

      if (!response.ok) {
        if (response.status === 401) {
          error.value = 'Неавторизованный доступ. Проверьте токен.'
          throw new Error('Unauthorized')
        }
        
        const errorData = await handleApiError(response)
        error.value = errorData.detail
        return errorData
      }

      const text = await response.text();
      if (text.trim() === '') {
        return 0;
      }
      
      const typeId: number = JSON.parse(text);
      return typeId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      error.value = errorMessage
      console.error('Error creating event type:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Удобный метод для создания события добавления ноды
   */
  const createAddNodeEvent = async (
    entityId: number, 
    taskId?: string,
    value: string = 'Добавили ребро.'
  ): Promise<number | ApiError> => {
    const eventData: EventData = {
      taskId: taskId || crypto.randomUUID(),
      eventType: 'add_node',
      eventEntityId: entityId,
      eventValue: value
    }
    
    return await createEvent(eventData)
  }

  /**
   * Удобный метод для создания типа события
   */
  const addEventType = async (eventName: string): Promise<number | ApiError> => {
    const eventTypeData: EventTypeData = { eventName }
    return await createEventType(eventTypeData)
  }

  /**
   * Сброс состояния
   */
  const resetState = (): void => {
    loading.value = false
    error.value = null
  }

  /**
   * Получение текущего состояния
   */
  const getState = (): EventsApiState => ({
    loading: loading.value,
    error: error.value
  })

  return {
    loading,
    error,

    setToken,
    clearToken,
    getCurrentToken,
    
    // Основные методы API
    createEvent,
    createEventType,
    
    // Удобные методы
    createAddNodeEvent,
    addEventType,
    
    // Утилиты
    getState,
    resetState
  }
}

export type EventsApi = ReturnType<typeof useEventsApi>