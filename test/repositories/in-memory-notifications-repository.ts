import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public notifications: Notification[] = []

  async create(notification: Notification) {
    this.notifications.push(notification)
  }

  async save(notification: Notification) {
    const notificationIndex = this.notifications.findIndex(
      (q) => q.id === notification.id,
    )

    this.notifications[notificationIndex] = notification
  }

  async findById(id: string) {
    const notification = this.notifications.find(
      (notification) => notification.id.toString() === id,
    )

    if (!notification) return null

    return notification
  }
}
