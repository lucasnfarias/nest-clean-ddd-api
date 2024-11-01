import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityID
}
