import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

describe('Fetch Question Answers Use Case', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let sut: FetchQuestionAnswersUseCase

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-test-1') }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-test-1') }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-test-1') }),
    )

    const result = await sut.execute({
      questionId: 'question-test-1',
      page: 1,
    })

    expect(result.value?.answers).toEqual([
      expect.objectContaining({
        questionId: new UniqueEntityID('question-test-1'),
      }),
      expect.objectContaining({
        questionId: new UniqueEntityID('question-test-1'),
      }),
      expect.objectContaining({
        questionId: new UniqueEntityID('question-test-1'),
      }),
    ])
  })

  it('should be able to fetch paginated question answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer(
          { questionId: new UniqueEntityID('question-test-1') },
          new UniqueEntityID(`answer-id-${i}`),
        ),
      )
    }

    const result = await sut.execute({
      questionId: 'question-test-1',
      page: 2,
    })

    expect(result.value?.answers).toEqual([
      expect.objectContaining({
        questionId: new UniqueEntityID('question-test-1'),
        id: new UniqueEntityID(`answer-id-21`),
      }),
      expect.objectContaining({
        questionId: new UniqueEntityID('question-test-1'),
        id: new UniqueEntityID(`answer-id-22`),
      }),
    ])
  })
})
