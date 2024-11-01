import { Notification } from '@/domain/notification/enterprise/entities/notification'

export interface NotificationsRepository {
  findById(notificationId: string): Promise<Notification | null>
  save(notification: Notification): Promise<void>
  create(notification: Notification): Promise<void>
}
