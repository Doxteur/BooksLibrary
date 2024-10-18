import  { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LoansTable } from '@/components/services/books/TablesLoan'
import { returnBook, getUserLoans } from '@/app/reducers/BookReducers'
import { AppDispatch, RootState } from '@/app/store'
import { Loan } from '@/components/services/types/livres'

function LoanPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { loans, books } = useSelector((state: RootState) => state.books)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [totalLoans, setTotalLoans] = useState(0)
  const [activeLoansCount, setActiveLoansCount] = useState(0)

  useEffect(() => {
    dispatch(getUserLoans())
  }, [dispatch])

  useEffect(() => {
    if (loans.length > 0) {
      setTotalLoans(loans.length)
      const activeLoans = loans.filter(loan => !loan.return_date)
      setActiveLoansCount(activeLoans.length)
      setTotalPages(Math.ceil(loans.length / 5))
    }
  }, [loans, books])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleReturnBook = (loan: Loan) => {
    dispatch(returnBook(loan.id))
  }

  return (
    <TooltipProvider>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {/* Card 2 */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Emprunts Actifs</CardDescription>
              <CardTitle className="text-4xl">
                {activeLoansCount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {totalLoans > 0 ? ((activeLoansCount / totalLoans) * 100).toFixed(2) : 0}% du total
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={totalLoans > 0 ? (activeLoansCount / totalLoans) * 100 : 0}
                aria-label="Pourcentage d'emprunts actifs"
              />
            </CardFooter>
          </Card>

          {/* Card 3 */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total des Emprunts</CardDescription>
              <CardTitle className="text-4xl">
                {totalLoans}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {totalLoans - activeLoansCount} emprunts terminés
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={100} aria-label="Total des emprunts" />
            </CardFooter>
          </Card>
        </div>

        {/* Card 4 */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Emprunts</CardTitle>
            <CardDescription>
              Vous avez {totalLoans} emprunts au total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loans?.length > 0 && (
              <LoansTable
                loanData={loans.slice((currentPage - 1) * 5, currentPage * 5)}
                onReturnBook={handleReturnBook}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </CardContent>
        </Card>

      </div>
    </TooltipProvider>
  )
}

export default LoanPage
