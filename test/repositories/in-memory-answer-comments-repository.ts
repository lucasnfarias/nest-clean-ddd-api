import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comments'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public answerComments: AnswerComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string) {
    const answerComment = this.answerComments.find(
      (answerComment) => answerComment.id.toString() === id,
    )

    if (!answerComment) return null

    return answerComment
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.answerComments
      .filter((answerComment) => answerComment.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ) {
    const comments = this.answerComments
      .filter((answerComment) => answerComment.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.students.find((student) =>
          student.id.equals(comment.authorId),
        )

        if (!author) {
          throw new Error(`Author ${comment.id.toString()} does not exists`)
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          authorId: comment.authorId,
          author: author.name,
        })
      })

    return comments
  }

  async create(answerComment: AnswerComment) {
    this.answerComments.push(answerComment)
  }

  async delete(answerComment: AnswerComment) {
    const answerCommentIndex = this.answerComments.findIndex(
      (q) => q.id === answerComment.id,
    )

    this.answerComments.splice(answerCommentIndex, 1)
  }
}
