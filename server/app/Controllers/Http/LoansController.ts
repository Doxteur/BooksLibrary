import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Loan from 'App/Models/Loan'
import Book from 'App/Models/Book'
import { DateTime } from 'luxon'

export default class LoansController {
  public async borrowBook({ request, response, auth }: HttpContextContract) {
    const { book_id } = request.only(['book_id'])

    if (!book_id) {
      return response.badRequest({ message: 'Book ID is required' })
    }

    const user = auth.user!

    // Vérifier le nombre de livres empruntés cette semaine
    const startOfWeek = DateTime.local().startOf('week')
    const loansThisWeek = await Loan.query()
      .where('user_id', user.id)
      .where('loan_date', '>=', startOfWeek.toSQL())
      .count('* as total')

    if (loansThisWeek[0].$extras.total >= 2) {
      return response.forbidden({ message: 'Vous avez déjà emprunté 2 livres cette semaine' })
    }

    // Check if the book is already borrowed
    const existingLoan = await Loan.query()
      .where('book_id', book_id)
      .whereNull('return_date')
      .first()

    if (existingLoan) {
      return response.badRequest({ message: 'This book is already borrowed' })
    }

    const book = await Book.find(book_id)
    if (!book) {
      return response.notFound({ message: 'Book not found' })
    }

    const loan = new Loan()
    loan.userId = user.id
    loan.bookId = book.id
    loan.loanDate = DateTime.local()
    loan.dueDate = DateTime.local().plus({ days: 14 }) // Set due date to 14 days from now

    await loan.save()

    return response.created(loan)
  }

  public async returnBook({ params, response, auth }: HttpContextContract) {
    const loanId = params.id
    if (!loanId) {
      return response.badRequest({ message: 'Loan ID is required' })
    }

    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const loan = await Loan.query()
      .where('id', loanId)
      .where('user_id', user.id)
      .whereNull('return_date')
      .first()

    if (!loan) {
      return response.notFound({ message: 'Loan not found or already returned' })
    }

    loan.returnDate = DateTime.local()
    await loan.save()

    return response.ok(loan)
  }

  public async getUserLoans({ response, auth }: HttpContextContract) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const loans = await Loan.query()
      .where('user_id', user.id)
      .preload('book')

    return response.ok(loans)
  }
}
