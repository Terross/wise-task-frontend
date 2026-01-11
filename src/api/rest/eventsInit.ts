// utils/eventsInit.ts
import { eventsApi } from '@/api/rest'

/**
 * Автоматическая инициализация Events API при импорте файла
 */
const initEventsApi = () => {
  console.log('🔄 Инициализация Events API...')
  
  // Ищем токен в localStorage
  const token = localStorage.getItem('token')
  
  if (token) {
    // Очищаем токен
    const cleanToken = token.trim().replace(/^['"]+|['"]+$/g, '')
    
    // Устанавливаем токен
    eventsApi.setToken(cleanToken)
    
    console.log('✅ Токен установлен в Events API')
    console.log(`📊 Длина токена: ${cleanToken.length} символов`)
  } else {
    console.warn('⚠️ Токен не найден. События будут отправляться без авторизации.')
  }
}

// Автоматически вызываем инициализацию при импорте
initEventsApi()

// Экспортируем API и утилиты
export { eventsApi }

export const checkEventsApiStatus = () => {
  console.group('📊 Статус Events API')
  const token = eventsApi.getCurrentToken()
  console.log('Токен установлен:', token ? '✅ Да' : '❌ Нет')
  if (token) console.log('Длина токена:', token.length)
  console.groupEnd()
}