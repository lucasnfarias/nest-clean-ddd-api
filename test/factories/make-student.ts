import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student.mapper'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const newStudent = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return newStudent
}

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(
    override: Partial<StudentProps> = {},
    id?: UniqueEntityID,
  ): Promise<Student> {
    const student = makeStudent(override, id)

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    })

    return student
  }
}
