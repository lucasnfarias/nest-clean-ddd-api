import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { DomainEvents } from '@/core/events/domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  // eslint-disable-next-line no-use-before-define
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // Subscriber cadastrado (e.g. listening to answer-created event)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // e.g. crate answer, but did not saved on db yet
    const aggregate = CustomAggregate.create()

    // checking the answer was created, event was created, but NOT fired (ready=false)
    expect(aggregate.domainEvents).toHaveLength(1)

    // e.g. answer saved on the db and it dispatched the event of the answer saved (based on its id) (ready=true)
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // subscriber gets the event's callback called. e.g. created answer notification fired
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
