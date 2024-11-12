import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

describe('Fetch Answer Comments Use Case', () => {
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let sut: FetchAnswerCommentsUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent()

    inMemoryStudentsRepository.students.push(student)

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment(
        {
          answerId: new UniqueEntityID('answer-test-1'),
          authorId: student.id,
        },
        new UniqueEntityID('comment-1'),
      ),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment(
        {
          answerId: new UniqueEntityID('answer-test-1'),
          authorId: student.id,
        },
        new UniqueEntityID('comment-2'),
      ),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment(
        {
          answerId: new UniqueEntityID('answer-test-1'),
          authorId: student.id,
        },
        new UniqueEntityID('comment-3'),
      ),
    )

    const result = await sut.execute({
      answerId: 'answer-test-1',
      page: 1,
    })

    expect(result.value?.comments).toEqual([
      expect.objectContaining({
        commentId: new UniqueEntityID('comment-1'),
        authorId: student.id,
        author: student.name,
      }),
      expect.objectContaining({
        commentId: new UniqueEntityID('comment-2'),
        authorId: student.id,
        author: student.name,
      }),
      expect.objectContaining({
        commentId: new UniqueEntityID('comment-3'),
        authorId: student.id,
        author: student.name,
      }),
    ])
  })

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent()

    inMemoryStudentsRepository.students.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment(
          {
            answerId: new UniqueEntityID('answer-test-1'),
            authorId: student.id,
          },
          new UniqueEntityID(`answer-comment-id-${i}`),
        ),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-test-1',
      page: 2,
    })

    expect(result.value?.comments).toEqual([
      expect.objectContaining({
        commentId: new UniqueEntityID(`answer-comment-id-21`),
        authorId: student.id,
        author: student.name,
      }),
      expect.objectContaining({
        commentId: new UniqueEntityID(`answer-comment-id-22`),
        authorId: student.id,
        author: student.name,
      }),
    ])
  })
})
