import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BooksTable } from "@/components/services/books/TablesBooks";
import { fetchBooks } from "@/app/reducers/BookReducers";
import { AppDispatch, RootState } from "@/app/store";
import { Book } from "@/components/services/types/livres";
import AddLoanModal from "@/components/services/books/AddLoanModal";

export const description =
  "Un tableau de bord des livres avec une navigation latérale. La barre latérale a une navigation par icônes. La zone de contenu a un fil d'Ariane et une recherche dans l'en-tête. La zone principale affiche une liste des livres récents avec un filtre et un bouton d'exportation. La zone principale affiche également une vue détaillée d'un seul livre avec les détails du livre, les informations d'emprunt, et les informations de disponibilité.";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { books, isLoading } = useSelector((state: RootState) => state.books);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* Gestion des livres */
  const [totalBooks, setTotalBooks] = useState(0);
  const [availableBooksCount, setAvailableBooksCount] = useState(0);
  const [availableBooksData, setAvailableBooksData] = useState<{ id: number; title: string }[]>([]);

  /* Gestion Modals */
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const fetchBooksData = useCallback(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  useEffect(() => {
    fetchBooksData();
  }, [fetchBooksData]);

  useEffect(() => {
    if (books.length > 0) {
      setTotalBooks(books.length);
      const availableBooks = books.filter(book => book.isAvailable);
      setAvailableBooksCount(availableBooks.length);
      setAvailableBooksData(availableBooks.map(book => ({ id: book.id, title: book.title })));
      setTotalPages(Math.ceil(books.length / 5)); // Assuming 5 books per page
    }
  }, [books]);

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsEditBookModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <TooltipProvider>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {/* Card 1 */}
          <Card className="sm:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Vos Livres</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Tableau de bord dynamique des livres pour une gestion et une
                analyse perspicace de votre bibliothèque.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => setIsAddBookModalOpen(true)}>
                Emprunter un nouveau livre
              </Button>
            </CardFooter>
          </Card>

          {/* Card 2 */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Livres Disponibles</CardDescription>
              <CardTitle className="text-4xl">
                {availableBooksCount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {((availableBooksCount / totalBooks) * 100).toFixed(2)}% du total
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={(availableBooksCount / totalBooks) * 100}
                aria-label="Pourcentage de livres disponibles"
              />
            </CardFooter>
          </Card>

          {/* Card 3 */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total des Livres</CardDescription>
              <CardTitle className="text-4xl">
                {totalBooks}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {totalBooks - availableBooksCount} livres empruntés
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={100} aria-label="Total des livres" />
            </CardFooter>
          </Card>
        </div>

        {/* Card 4 */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Livres</CardTitle>
            <CardDescription>
              Vous avez {totalBooks} livres au total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {books?.length > 0 && (
              <BooksTable
                bookData={books.slice((currentPage - 1) * 5, currentPage * 5)}
                onEditBook={handleEditBook}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </CardContent>
        </Card>

        {/* Ajout des modales (à implémenter) */}
         <AddLoanModal
          isOpen={isAddBookModalOpen}
          onClose={() => setIsAddBookModalOpen(false)}
          availableBooks={availableBooksData}
        />
        {/*
        <EditBookModal
          isOpen={isEditBookModalOpen}
          onClose={() => setIsEditBookModalOpen(false)}
          book={selectedBook}
        /> */}
      </div>
    </TooltipProvider>
  );
};

export default DashboardPage;
