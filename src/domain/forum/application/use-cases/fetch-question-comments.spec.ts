import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

describe('Fetch Question Comments Use Case', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let sut: FetchQuestionCommentsUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const student = makeStudent()

    inMemoryStudentsRepository.students.push(student)

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment(
        {
          questionId: new UniqueEntityID('question-test-1'),
          authorId: student.id,
        },
        new UniqueEntityID('comment-1'),
      ),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment(
        {
          questionId: new UniqueEntityID('question-test-1'),
          authorId: student.id,
        },
        new UniqueEntityID('comment-2'),
      ),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment(
        {
          questionId: new UniqueEntityID('question-test-1'),
          authorId: student.id,
        },
        new UniqueEntityID('comment-3'),
      ),
    )

    const result = await sut.execute({
      questionId: 'question-test-1',
      page: 1,
    })

    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
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
      ]),
    )
  })

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent()

    inMemoryStudentsRepository.students.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment(
          {
            questionId: new UniqueEntityID('question-test-1'),
            authorId: student.id,
          },
          new UniqueEntityID(`question-comment-id-${i}`),
        ),
      )
    }

    const result = await sut.execute({
      questionId: 'question-test-1',
      page: 2,
    })

    expect(result.value?.comments).toEqual([
      expect.objectContaining({
        commentId: new UniqueEntityID(`question-comment-id-21`),
        authorId: student.id,
        author: student.name,
      }),
      expect.objectContaining({
        commentId: new UniqueEntityID(`question-comment-id-22`),
        authorId: student.id,
        author: student.name,
      }),
    ])
  })
})
