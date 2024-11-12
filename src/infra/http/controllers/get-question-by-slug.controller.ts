import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { QuestionDetailsPresenter } from '@/infra/http/presenters/question-details.presenter'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(
    private readonly getQuestionBySlugUseCase: GetQuestionBySlugUseCase,
  ) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlugUseCase.execute({
      slug,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { question } = result.value

    return { question: QuestionDetailsPresenter.toHTTP(question) }
  }
}
