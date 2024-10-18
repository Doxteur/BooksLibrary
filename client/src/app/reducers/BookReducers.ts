import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { REACT_APP_API_URL } from '../../config';
import { Book, CreateBookDTO, UpdateBookDTO, Loan, BorrowBookDTO } from '@/components/services/types/livres';
import axiosInstance from '../middlewares/ReduxMiddlewares';

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${REACT_APP_API_URL}/books`);
      return response.data as Book[];
    } catch (error) {
      return rejectWithValue('Failed to fetch books');
    }
  }
);

export const createBook = createAsyncThunk(
  'books/createBook',
  async (bookData: CreateBookDTO, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${REACT_APP_API_URL}/books`, bookData);
      return response.data as Book;
    } catch (error) {
      return rejectWithValue('Failed to create book');
    }
  }
);

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ id, bookData }: { id: number; bookData: UpdateBookDTO }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${REACT_APP_API_URL}/books/${id}`, bookData);
      return response.data as Book;
    } catch (error) {
      return rejectWithValue('Failed to update book');
    }
  }
);

export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${REACT_APP_API_URL}/books/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete book');
    }
  }
);

export const borrowBook = createAsyncThunk(
  'books/borrowBook',
  async (borrowData: BorrowBookDTO, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${REACT_APP_API_URL}/loans/borrow`, borrowData);
      return response.data as Loan;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const returnBook = createAsyncThunk(
  'books/returnBook',
  async (loanId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${REACT_APP_API_URL}/loans/${loanId}/return`);
      return response.data as Loan;
    } catch (error) {
      return rejectWithValue('Failed to return book');
    }
  }
);

export const getUserLoans = createAsyncThunk(
  'books/getUserLoans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${REACT_APP_API_URL}/loans/user`);
      return response.data as Loan[];
    } catch (error) {
      return rejectWithValue('Failed to fetch user loans');
    }
  }
);

const bookSlice = createSlice({
  name: 'books',
  initialState: {
    books: [] as Book[],
    loans: [] as Loan[],
    isLoading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.isLoading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.books.push(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action: PayloadAction<Book>) => {
        const index = state.books.findIndex(book => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(deleteBook.fulfilled, (state, action: PayloadAction<number>) => {
        state.books = state.books.filter(book => book.id !== action.payload);
      })
      .addCase(borrowBook.fulfilled, (state, action: PayloadAction<Loan>) => {
        state.loans.push(action.payload);
        const book = state.books.find(book => book.id === action.payload.book_id);
        if (book) {
          book.isAvailable = false;
        }
      })
      .addCase(returnBook.fulfilled, (state, action: PayloadAction<Loan>) => {
        const index = state.loans.findIndex(loan => loan.id === action.payload.id);
        if (index !== -1) {
          state.loans[index] = action.payload;
        }
        const book = state.books.find(book => book.id === action.payload.book_id);
        if (book) {
          book.isAvailable = true;
        }
      })
      .addCase(getUserLoans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserLoans.fulfilled, (state, action: PayloadAction<Loan[]>) => {
        state.isLoading = false;
        state.loans = action.payload;
      })
      .addCase(getUserLoans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
  },
});

export default bookSlice.reducer;
