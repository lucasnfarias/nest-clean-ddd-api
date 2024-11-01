import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

describe('Delete Answer Use Case', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let sut: DeleteAnswerUseCase
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-test-1'),
      },
      new UniqueEntityID('answer-test'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    expect(inMemoryAnswersRepository.answers[0]).toStrictEqual(newAnswer)

    inMemoryAnswerAttachmentsRepository.answerAttachments.push(
      makeAnswerAttachment(
        {
          answerId: new UniqueEntityID('answer-test'),
          attachmentId: new UniqueEntityID('1'),
        },
        new UniqueEntityID('answer-test'),
      ),
      makeAnswerAttachment(
        {
          answerId: new UniqueEntityID('answer-test'),
          attachmentId: new UniqueEntityID('2'),
        },
        new UniqueEntityID('answer-test'),
      ),
    )

    expect(inMemoryAnswerAttachmentsRepository.answerAttachments).toHaveLength(
      2,
    )

    await sut.execute({
      answerId: 'answer-test',
      authorId: 'author-test-1',
    })

    expect(inMemoryAnswersRepository.answers).toHaveLength(0)
    expect(inMemoryAnswerAttachmentsRepository.answerAttachments).toHaveLength(
      0,
    )
  })

  it("should not be able to delete another author's answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-test-1'),
      },
      new UniqueEntityID('answer-test'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: 'answer-test',
      authorId: 'author-test-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)

    expect(inMemoryAnswersRepository.answers[0]).toStrictEqual(newAnswer)
  })
})
