import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Book from 'App/Models/Book'

export default class BookSeeder extends BaseSeeder {
  public async run () {
    await Book.createMany([
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        publicationYear: 1960,
      },
      {
        title: '1984',
        author: 'George Orwell',
        publicationYear: 1949,
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        publicationYear: 1813,
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        publicationYear: 1925,
      },
      {
        title: 'One Hundred Years of Solitude',
        author: 'Gabriel García Márquez',
        publicationYear: 1967,
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        publicationYear: 1951,
      },
      {
        title: 'Moby-Dick',
        author: 'Herman Melville',
        publicationYear: 1851,
      },
      {
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        publicationYear: 1954,
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        publicationYear: 1937,
      },
      {
        title: 'Brave New World',
        author: 'Aldous Huxley',
        publicationYear: 1932,
      },
    ])
  }
}
