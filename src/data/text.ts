import faker from 'faker';

export const randomText: string = new Array<string>(3)
  .fill('')
  .map(() => faker.random.word().toLowerCase())
  .join(' ');