import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public questionAttachments: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.questionAttachments.filter(
      (questionAttachment) =>
        questionAttachment.questionId.toString() === questionId,
    )

    return questionAttachments
  }

  async createMany(attachments: QuestionAttachment[]) {
    this.questionAttachments.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]) {
    const questionAttachments = this.questionAttachments.filter(
      (questionAttachment) => {
        return !attachments.some((attachment) =>
          attachment.equals(questionAttachment),
        )
      },
    )

    this.questionAttachments = questionAttachments
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.questionAttachments.filter(
      (questionAttachment) =>
        questionAttachment.questionId.toString() !== questionId,
    )

    this.questionAttachments = questionAttachments
  }
}
