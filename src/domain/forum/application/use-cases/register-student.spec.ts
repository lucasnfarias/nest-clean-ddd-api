import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

describe('Register Student Use Case', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let fakeHasher: FakeHasher
  let sut: RegisterStudentUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should register a student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      student: inMemoryStudentsRepository.students[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')
    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.students[0].password).toEqual(
      hashedPassword,
    )
  })
})
