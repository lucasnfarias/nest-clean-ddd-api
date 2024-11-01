import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

describe('Fetch Answer Comments Use Case', () => {
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let sut: FetchAnswerCommentsUseCase

  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-test-1'),
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-test-1'),
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-test-1'),
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-test-1',
      page: 1,
    })

    expect(result.value?.answerComments).toEqual([
      expect.objectContaining({
        answerId: new UniqueEntityID('answer-test-1'),
      }),
      expect.objectContaining({
        answerId: new UniqueEntityID('answer-test-1'),
      }),
      expect.objectContaining({
        answerId: new UniqueEntityID('answer-test-1'),
      }),
    ])
  })

  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment(
          { answerId: new UniqueEntityID('answer-test-1') },
          new UniqueEntityID(`answer-comment-id-${i}`),
        ),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-test-1',
      page: 2,
    })

    expect(result.value?.answerComments).toEqual([
      expect.objectContaining({
        answerId: new UniqueEntityID('answer-test-1'),
        id: new UniqueEntityID(`answer-comment-id-21`),
      }),
      expect.objectContaining({
        answerId: new UniqueEntityID('answer-test-1'),
        id: new UniqueEntityID(`answer-comment-id-22`),
      }),
    ])
  })
})
