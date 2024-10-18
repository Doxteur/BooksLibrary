import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { borrowBook } from '@/app/reducers/BookReducers';
import { AppDispatch } from '@/app/store';
import { BorrowBookDTO } from '@/components/services/types/livres';
import Modal from '@/components/shared/Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AddLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBooks: { id: number; title: string }[];
}

function AddLoanModal({ isOpen, onClose, availableBooks }: AddLoanModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loanData, setLoanData] = useState<BorrowBookDTO>({
    book_id: 0,
  });


  const handleSelectChange = (value: string) => {
    setLoanData({ ...loanData, book_id: parseInt(value, 10) });
  };

  const handleSubmit = () => {
    if (loanData.book_id !== 0) {
      dispatch(borrowBook(loanData)).unwrap().then(() => {
        onClose();
      }).catch((error) => {
        console.log("JD ERROR",error)
        toast.error(error);
      });
    } else {
      console.error("Veuillez sélectionner un livre");
    }
  };

  const modalContent = (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="book_id">Livre</Label>
          <Select onValueChange={handleSelectChange} value={loanData.book_id.toString()}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un livre" />
            </SelectTrigger>
            <SelectContent>
              {availableBooks.map((book) => (
                <SelectItem key={book.id} value={book.id.toString()}>
                  {book.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Emprunter un livre"
        buttons={[
          {
            label: 'Annuler',
            onClick: onClose,
            variant: 'outline' as const,
          },
          {
            label: 'Emprunter',
            onClick: handleSubmit,
            variant: 'default' as const,
          }
        ]}
      >
        {modalContent}
      </Modal>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default AddLoanModal;
