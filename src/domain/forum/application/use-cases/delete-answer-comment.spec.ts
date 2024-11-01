import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

describe('Delete Answer Comment Use Case', () => {
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let sut: DeleteAnswerCommentUseCase

  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-test-1'),
      },
      new UniqueEntityID('answer-comment-test'),
    )

    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    expect(inMemoryAnswerCommentsRepository.answerComments[0]).toStrictEqual(
      newAnswerComment,
    )

    await sut.execute({
      answerCommentId: 'answer-comment-test',
      authorId: 'author-test-1',
    })

    expect(inMemoryAnswerCommentsRepository.answerComments).toHaveLength(0)
  })

  it("should not be able to delete another author's answer comment", async () => {
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-test-1'),
      },
      new UniqueEntityID('answer-test'),
    )

    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    const result = await sut.execute({
      answerCommentId: 'answer-test',
      authorId: 'author-test-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)

    expect(inMemoryAnswerCommentsRepository.answerComments[0]).toStrictEqual(
      newAnswerComment,
    )
  })
})
