import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

describe('Slug Value Object', () => {
  it('should create a new slug from text', async () => {
    const slug = Slug.createFromText('Example question title')

    expect(slug.value).toEqual('example-question-title')
  })
})
