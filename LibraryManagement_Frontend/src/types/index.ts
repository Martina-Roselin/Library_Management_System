export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  issueRecords?: IssueRecord[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  availability: boolean;
  createdAt: string;
}

export interface IssueRecord {
  id: string;
  userId: string;
  bookId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  user?: User;
  book?: Book;
}

export interface Fine {
  id: string;
  amount: string;
  status: 'PENDING' | 'PAID';
  issueRecordId: string;
  issueRecord?: IssueRecord;
  createdAt: string;
}

export interface Payment {
  id: string;
  amount: string;
  paymentMethod: string;
  fineId: string;
  fine?: Fine;
  createdAt: string;
}