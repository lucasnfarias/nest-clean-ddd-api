import { DomainEvent } from '@/core/events/domain-event'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public answer: Answer

  constructor(answer: Answer) {
    this.ocurredAt = new Date()
    this.answer = answer
  }

  getAggregateId() {
    return this.answer.id
  }
}
