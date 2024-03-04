export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
};
