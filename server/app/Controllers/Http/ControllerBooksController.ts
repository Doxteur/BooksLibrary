import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Book from 'App/Models/Book'
import Loan from 'App/Models/Loan'
import { DateTime } from 'luxon'

export default class ControllerBooksController {
    public async index({ response }: HttpContextContract) {
        const books = await Book.all()
        const booksWithAvailability = await Promise.all(books.map(async (book) => {
          const isAvailable = await this.checkBookAvailability(book.id)
          return { ...book.toJSON(), isAvailable }
        }))
        return response.ok(booksWithAvailability)
      }

  public async store({ request, response }: HttpContextContract) {
    const bookData = request.only(['title', 'author', 'publicationYear'])
    const book = await Book.create(bookData)
    return response.created(book)
  }

  public async show({ params, response }: HttpContextContract) {
    const book = await Book.find(params.id)
    if (!book) {
      return response.notFound({ message: 'Book not found' })
    }
    return response.ok(book)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const book = await Book.find(params.id)
    if (!book) {
      return response.notFound({ message: 'Book not found' })
    }
    const bookData = request.only(['title', 'author', 'publicationYear'])
    book.merge(bookData)
    await book.save()
    return response.ok(book)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const book = await Book.find(params.id)
    if (!book) {
      return response.notFound({ message: 'Book not found' })
    }
    await book.delete()
    return response.noContent()
  }

  private async checkBookAvailability(bookId: number): Promise<boolean> {
    const activeLoan = await Loan.query()
      .where('book_id', bookId)
      .whereNull('return_date')
      .where('due_date', '>', DateTime.now().toSQL())
      .first()

    return !activeLoan
  }

}

