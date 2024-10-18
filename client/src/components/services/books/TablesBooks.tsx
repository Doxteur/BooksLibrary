import { Badge } from "@/components/ui/badge";
import TableComponent from "@/components/shared/Table";
import { Book } from "@/components/services/types/livres";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

interface BooksTableProps {
  bookData: Book[];
  onEditBook: (book: Book) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const BooksTable = ({
  bookData,
  onEditBook,
  currentPage,
  totalPages,
  onPageChange,
}: BooksTableProps) => {
  const isLoading = useSelector((state: RootState) => state.books.isLoading);

  return (
    <TableComponent
      data={bookData}
      columns={[
        {
          header: "Titre",
          accessor: "title",
          cell: (book) => (
            <div className="font-medium">{book.title}</div>
          ),
          sortable: true,
          filterable: true,
        },
        {
          header: "Auteur",
          accessor: "author",
          className: "hidden sm:table-cell",
          sortable: true,
          filterable: true,
        },
        {
          header: "Année de publication",
          accessor: "publication_year",
          className: "hidden md:table-cell",
          sortable: true,
          filterable: true,
        },
        {
          header: "Disponibilité",
          accessor: "isAvailable",
          className: "hidden sm:table-cell",
          cell: (book) => (
            <Badge
              variant="custom"
              className="text-xs"
              customStyle={book.isAvailable ? { backgroundColor: "#4CAF50", color: "white" } : { backgroundColor: "#FF9800", color: "black" }}
            >
              {book.isAvailable ? "Disponible" : "Emprunté"}
            </Badge>
          ),
          sortable: true,
          filterable: true,
          filterType: 'select',
          filterOptions: [
            { value: 'true', label: 'Disponible' },
            { value: 'false', label: 'Emprunté' },
          ],
        },
        {
          header: "Date d'ajout",
          accessor: "created_at",
          className: "hidden lg:table-cell",
          cell: (book) => new Date(book.created_at).toLocaleDateString(),
          sortable: true,
        },
      ]}
      onRowClick={onEditBook}
      itemsPerPage={5}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  );
};
