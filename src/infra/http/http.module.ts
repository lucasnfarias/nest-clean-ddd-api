import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-questions'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AnswerQuestionController } from '@/infra/http/controllers/answer-question.controller'
import { AuthenticateController } from '@/infra/http/controllers/authenticate.controller'
import { ChooseQuestionBestAnswerController } from '@/infra/http/controllers/choose-question-best-answer.controller'
import { CommentOnAnswerController } from '@/infra/http/controllers/comment-on-answer.controller'
import { CommentOnQuestionController } from '@/infra/http/controllers/comment-on-question.controller'
import { CreateAccountController } from '@/infra/http/controllers/create-account.controller'
import { CreateQuestionController } from '@/infra/http/controllers/create-question.controller'
import { DeleteAnswerController } from '@/infra/http/controllers/delete-answer.controller'
import { DeleteQuestionCommentController } from '@/infra/http/controllers/delete-question-comment.controller'
import { DeleteQuestionController } from '@/infra/http/controllers/delete-question.controller'
import { EditAnswerController } from '@/infra/http/controllers/edit-answer.controller'
import { EditQuestionController } from '@/infra/http/controllers/edit-question.controller'
import { FetchQuestionAnswersController } from '@/infra/http/controllers/fetch-question-answers.controller'
import { FetchRecentQuestionsController } from '@/infra/http/controllers/fetch-recent-questions.controller'
import { GetQuestionBySlugController } from '@/infra/http/controllers/get-question-by-slug.controller'
import { Module } from '@nestjs/common'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
  ],
  providers: [
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentUseCase,
    CommentOnAnswerUseCase,
  ],
})
export class HttpModule {}
