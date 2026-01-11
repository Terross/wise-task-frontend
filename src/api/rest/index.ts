import { useEventsApi } from './Events'

// Создаем глобальный экземпляр API
export const eventsApi = useEventsApi({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8085/api'
})

// Экспортируем функцию для создания новых экземпляров
export { useEventsApi }

// Экспортируем типы
export type { EventsApi } from './Events'
export type {
  EventData,
  EventTypeData,
  ApiError,
  EventsApiState,
  ApiConfig,
  EventsApiMethods
} from './types/Event'