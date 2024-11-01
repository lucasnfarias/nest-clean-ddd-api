import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

describe('Send Notification Use Case', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sut: SendNotificationUseCase

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Notificação',
      content: 'Notificando alguma coisa :)',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.notification).toEqual(
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
        title: 'Notificação',
        content: 'Notificando alguma coisa :)',
      }),
    )
    expect(inMemoryNotificationsRepository.notifications[0]).toStrictEqual(
      result.value?.notification,
    )
  })
})
