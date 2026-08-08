import api from './api';

export interface SplitMember {
  id?: string;
  name: string;
  amount: number;
  settled: boolean;
}

export interface BillSplit {
  id: string;
  firebaseUid: string;
  title: string;
  category: string;
  totalAmount: number;
  date: string;
  paidBy: string;
  members: SplitMember[];
  settled: boolean;
}

export const fetchBillSplits = async (): Promise<BillSplit[]> => {
  const response = await api.get('/bill-splits');
  return response.data.billSplits;
};

export const addBillSplit = async (
  data: Omit<BillSplit, 'id' | 'firebaseUid' | 'settled'>
): Promise<BillSplit> => {
  const response = await api.post('/bill-splits', data);
  return response.data.billSplit;
};

export const toggleMemberSettled = async (billSplitId: string, memberId: string): Promise<BillSplit> => {
  const response = await api.patch(`/bill-splits/${billSplitId}/members/${memberId}/settle`);
  return response.data.billSplit;
};

export const deleteBillSplit = async (id: string): Promise<void> => {
  await api.delete(`/bill-splits/${id}`);
};
