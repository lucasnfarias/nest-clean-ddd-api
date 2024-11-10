import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-questions'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

describe('Create Question Use Case', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let sut: CreateQuestionUseCase

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Pergunta',
      content: 'Nova pergunta?',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.question).toEqual(
      expect.objectContaining({
        id: expect.any(UniqueEntityID),
        title: 'Pergunta',
        content: 'Nova pergunta?',
      }),
    )
    expect(inMemoryQuestionsRepository.questions[0]).toStrictEqual(
      result.value?.question,
    )
    expect(
      inMemoryQuestionsRepository.questions[0].attachments.currentItems,
    ).toStrictEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })

  it('should persist attachments when creating a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Pergunta',
      content: 'Nova pergunta?',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(
      inMemoryQuestionAttachmentsRepository.questionAttachments,
    ).toStrictEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
