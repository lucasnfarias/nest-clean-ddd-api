import { Either, left, right } from '@/core/either'
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials'
import { Injectable } from '@nestjs/common'

interface AuthenticateStudentsUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudentsUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentsUseCaseRequest): Promise<AuthenticateStudentsUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      student.password,
    )

    if (!isPasswordValid) {
      throw new WrongCredentialsError()
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return right({ accessToken })
  }
}
