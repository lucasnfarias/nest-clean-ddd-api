import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

describe('Delete Question Comment Use Case', () => {
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let sut: DeleteQuestionCommentUseCase

  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-test-1'),
      },
      new UniqueEntityID('question-comment-test'),
    )

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    expect(
      inMemoryQuestionCommentsRepository.questionComments[0],
    ).toStrictEqual(newQuestionComment)

    await sut.execute({
      questionCommentId: 'question-comment-test',
      authorId: 'author-test-1',
    })

    expect(inMemoryQuestionCommentsRepository.questionComments).toHaveLength(0)
  })

  it("should not be able to delete another author's question comment", async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-test-1'),
      },
      new UniqueEntityID('question-test'),
    )

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    const result = await sut.execute({
      questionCommentId: 'question-test',
      authorId: 'author-test-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)

    expect(
      inMemoryQuestionCommentsRepository.questionComments[0],
    ).toStrictEqual(newQuestionComment)
  })
})
