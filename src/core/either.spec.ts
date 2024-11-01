import { Either, left, right } from '@/core/either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) return right(10)
  return left('error')
}

describe('Core > Either', () => {
  it('should return success result', () => {
    const result = doSomething(true)

    expect(result.isRight()).toEqual(true)
    expect(result.isLeft()).toEqual(false)
    expect(result.value).toEqual(10)
  })

  it('should return error result', () => {
    const result = doSomething(false)

    expect(result.isLeft()).toEqual(true)
    expect(result.isRight()).toEqual(false)
    expect(result.value).toEqual('error')
  })
})
