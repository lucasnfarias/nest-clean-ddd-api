import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

describe('Read Notification Use Case', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sut: ReadNotificationUseCase

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should read a notification', async () => {
    const notification = makeNotification()

    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.notifications[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it("should not be able to read another recipient's notification", async () => {
    const notification = makeNotification(
      {
        recipientId: new UniqueEntityID('recipient-test-1'),
      },
      new UniqueEntityID('notification-test'),
    )

    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: 'recipient-test-2',
      notificationId: 'notification-test',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)

    expect(inMemoryNotificationsRepository.notifications[0]).toStrictEqual(
      notification,
    )
  })
})
