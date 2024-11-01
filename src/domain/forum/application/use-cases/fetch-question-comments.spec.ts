import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

describe('Fetch Question Comments Use Case', () => {
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let sut: FetchQuestionCommentsUseCase

  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-test-1'),
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-test-1'),
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-test-1'),
      }),
    )

    const result = await sut.execute({
      questionId: 'question-test-1',
      page: 1,
    })

    expect(result.value?.questionComments).toEqual([
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

  it('should be able to fetch paginated question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment(
          { questionId: new UniqueEntityID('question-test-1') },
          new UniqueEntityID(`question-comment-id-${i}`),
        ),
      )
    }

    const result = await sut.execute({
      questionId: 'question-test-1',
      page: 2,
    })

    expect(result.value?.questionComments).toEqual([
      expect.objectContaining({
        questionId: new UniqueEntityID('question-test-1'),
        id: new UniqueEntityID(`question-comment-id-21`),
      }),
      expect.objectContaining({
        questionId: new UniqueEntityID('question-test-1'),
        id: new UniqueEntityID(`question-comment-id-22`),
      }),
    ])
  })
})
