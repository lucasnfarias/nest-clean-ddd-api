/* 
  - Why either?
    - It's either a success or an error

  - Why left or right?
    - Right = success
      - because it went all the way right following the proper flow (e.g. UI -> Controller -> Use Case -> Entity -> Repository -> Database)
    - Left = error
      - You didn't go all the way right

  - Remember this is just the normal convention for Functional Error Handling, but it's not mandatory (you could use Success/Failure)
*/

// Error
export class Left<L, R> {
  readonly value: L

  constructor(value: L) {
    this.value = value
  }

  isRight(): this is Right<L, R> {
    return false
  }

  isLeft(): this is Left<L, R> {
    return true
  }
}

// Success
export class Right<L, R> {
  readonly value: R

  constructor(value: R) {
    this.value = value
  }

  isRight(): this is Right<L, R> {
    return true
  }

  isLeft(): this is Left<L, R> {
    return false
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>

export const left = <L, R>(value: L): Either<L, R> => {
  return new Left(value)
}

export const right = <L, R>(value: R): Either<L, R> => {
  return new Right(value)
}
