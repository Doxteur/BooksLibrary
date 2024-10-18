import { Badge } from "@/components/ui/badge";
import TableComponent from "@/components/shared/Table";
import { Loan } from "@/components/services/types/livres";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Button } from "@/components/ui/button";

interface LoansTableProps {
  loanData: Loan[];
  onReturnBook: (loan: Loan) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const LoansTable = ({
  loanData,
  onReturnBook,
  currentPage,
  totalPages,
  onPageChange,
}: LoansTableProps) => {
  const isLoading = useSelector((state: RootState) => state.books.isLoading);
  const { books } = useSelector((state: RootState) => state.books);

  return (
    <TableComponent
      data={loanData}
      columns={[
        {
          header: "Titre du livre",
          accessor: "book_id",
          cell: (loan: Loan) => (
            <div className="font-medium">{loan.book?.title || "N/A"}</div>
          ),
          sortable: true,
        },
        {
          header: "Date d'emprunt",
          accessor: "loan_date",
          className: "hidden sm:table-cell",
          cell: (loan) => new Date(loan.loan_date).toLocaleDateString(),
          sortable: true,
        },
        {
          header: "Date de retour prévue",
          accessor: "due_date",
          className: "hidden md:table-cell",
          cell: (loan) => new Date(loan.due_date).toLocaleDateString(),
          sortable: true,
        },
        {
          header: "Statut",
          accessor: "return_date",
          className: "hidden sm:table-cell",
          cell: (loan) => (
            <Badge
              variant="custom"
              className="text-xs"
              customStyle={loan.return_date ? { backgroundColor: "#4CAF50", color: "white" } : { backgroundColor: "#FF9800", color: "black" }}
            >
              {loan.return_date ? "Retourné" : "En cours"}
            </Badge>
          ),
          sortable: true,
        },
        {
          header: "Action",
          accessor: "id",
          cell: (loan: Loan) => (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onReturnBook(loan);
              }}
              disabled={!!loan.return_date}
              variant="outline"
              size="sm"
            >
              Retourner
            </Button>
          ),
          sortable: false,
        },
      ]}
      onRowClick={() => {}} // Remove row click handler
      itemsPerPage={5}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  );
};
