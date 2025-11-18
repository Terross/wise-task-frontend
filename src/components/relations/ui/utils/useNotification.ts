import { ref, type Component, h, render } from 'vue'
import NotificationMessage from '@/components/relations/ui/NotificationMessages.vue'

type NotificationType = 'success' | 'error' | 'warning'

interface NotificationOptions {
    duration?: number
}

let notificationInstance: any = null

export const useNotifications = () => {
    const showNotification = (
        type: NotificationType,
        message: string,
        options: NotificationOptions = {}
    ) => {
        hideNotification()

        const container = document.createElement('div')
        document.body.appendChild(container)

        const vnode = h(NotificationMessage, {
            type,
            message,
            duration: options.duration || 3000,
            onClose: () => {
                hideNotification()
            }
        })

        render(vnode, container)
        notificationInstance = { vnode, container }
    }

    const hideNotification = () => {
        if (notificationInstance) {
            render(null, notificationInstance.container)
            notificationInstance.container.remove()
            notificationInstance = null
        }
    }

    const showCompletionMessage = () => {
        showNotification('success', '✅ Задание выполнено верно!')
    }

    const showFailMessage = () => {
        showNotification('error', '❌ Задание выполнено неверно!')
    }

    const showErrorSelectMessage = () => {
        showNotification('error', 'Для создания графа выберите его параметры')
    }

    const showErrorSelectEdgesMessage = () => {
        showNotification('error', 'Не удастся создать граф с таким количеством ребер')
    }

    const showErrorCreateGraphMessage = () => {
        showNotification('error', 'Вначале создайте граф')
    }

    return {
        showCompletionMessage,
        showFailMessage,
        showErrorSelectMessage,
        showErrorSelectEdgesMessage,
        showErrorCreateGraphMessage,
        hideNotification,
        showNotification
    }
}