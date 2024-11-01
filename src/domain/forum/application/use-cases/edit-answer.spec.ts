import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

describe('Edit Answer Use Case', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let sut: EditAnswerUseCase

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('should be able to edit a answer', async () => {
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

    await sut.execute({
      answerId: 'answer-test',
      authorId: 'author-test-1',
      content: 'Updated content',
      attachmentsIds: ['1', '3'],
    })

    expect(inMemoryAnswersRepository.answers[0]).toMatchObject({
      content: 'Updated content',
    })
    expect(
      inMemoryAnswersRepository.answers[0].attachments.currentItems,
    ).toStrictEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it("should not be able to edit another author's answer", async () => {
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
      content: 'Updated content',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
