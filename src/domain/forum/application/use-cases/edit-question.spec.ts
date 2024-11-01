import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

describe('Edit Question Use Case', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let sut: EditQuestionUseCase

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-test-1'),
      },
      new UniqueEntityID('question-test'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.questionAttachments.push(
      makeQuestionAttachment(
        {
          questionId: new UniqueEntityID('question-test'),
          attachmentId: new UniqueEntityID('1'),
        },
        new UniqueEntityID('question-test'),
      ),
      makeQuestionAttachment(
        {
          questionId: new UniqueEntityID('question-test'),
          attachmentId: new UniqueEntityID('2'),
        },
        new UniqueEntityID('question-test'),
      ),
    )

    expect(inMemoryQuestionsRepository.questions[0]).toStrictEqual(newQuestion)

    await sut.execute({
      questionId: 'question-test',
      authorId: 'author-test-1',
      title: 'Updated title',
      content: 'Updated content',
      attachmentsIds: ['1', '3'],
    })

    expect(inMemoryQuestionsRepository.questions[0]).toMatchObject({
      title: 'Updated title',
      content: 'Updated content',
    })
    expect(
      inMemoryQuestionsRepository.questions[0].attachments.currentItems,
    ).toStrictEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it("should not be able to edit another author's question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-test-1'),
      },
      new UniqueEntityID('question-test'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: 'question-test',
      authorId: 'author-test-2',
      title: 'Updated title',
      content: 'Updated content',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
