import { DomainEvents } from '@/core/events/domain-events'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public students: Student[] = []

  async findByEmail(email: string) {
    const student = this.students.find((student) => student.email === email)

    if (!student) return null

    return student
  }

  async create(student: Student) {
    this.students.push(student)
  }

  async save(student: Student) {
    const studentIndex = this.students.findIndex((q) => q.id === student.id)

    this.students[studentIndex] = student

    DomainEvents.dispatchEventsForAggregate(student.id)
  }
}
