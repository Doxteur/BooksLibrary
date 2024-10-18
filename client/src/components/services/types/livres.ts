// Type pour un livre
export interface Book {
  id: number;
  title: string;
  author: string;
  publication_year: number;
  created_at: string;
  updated_at: string;
  isAvailable: boolean;
}

// Type pour un emprunt
export interface Loan {
  id: number;
  user_id: number;
  book_id: number;
  loan_date: string;
  due_date: string;
  return_date: string | null;
  created_at: string;
  updated_at: string;
  book?: Book; // Inclus si les emprunts sont chargés avec les détails du livre
}

// Type pour la création d'un nouveau livre
export interface CreateBookDTO {
  title: string;
  author: string;
  publication_year: number;
}

// Type pour la mise à jour d'un livre
export interface UpdateBookDTO {
  title?: string;
  author?: string;
  publication_year?: number;
}

// Type pour l'emprunt d'un livre
export interface BorrowBookDTO {
  book_id: number;
}

// Type pour les réponses d'erreur de l'API
export interface ApiError {
  message: string;
}
