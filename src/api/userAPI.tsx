import { sendRequest, GET, POST } from "./helper";

export interface Receipt_Info {
  receiptId: string;
  amount: number;
  receiptName: string;
  receiptDescription: string;
  receiptCreatedAt: string;
  committeeName: string;
  userFullname: string;
  paymentOrCard: string;
  attachmentCount: number;
  latestReviewStatus: string;
  latestReviewCreatedAt: string;
}

export interface CompleteReceipt {
  receiptId: string;
  amount: number;
  receiptName: string;
  receiptDescription: string;
  receiptCreatedAt: string;
  committeeName: string;
  userFullname: string;
  paymentOrCard: string;
  attachmentCount: number;
  latestReviewStatus: string;
  latestReviewCreatedAt: string;
  latestReviewComment: string;
  paymentAccountNumber: string;
  cardCardNumber: string;
  attachments: string[];
}

export interface ReceiptReview {
  receiptId: string;
  status: string;
  comment: string;
}

export interface AllReceiptsResponse {
  receipts: Receipt_Info[];
  total: number;
}


export const fetchAllUserReceipts = async (from: Number, count: Number, status: string | null,
): Promise<AllReceiptsResponse> => {
  return sendRequest<undefined, AllReceiptsResponse>(`/receipt/getall?from=${from}&count=${count}${status ? `&status=${status}` : ''}`, GET);
};

export const fetchCompleteUserReceipt = async (receiptId: string): Promise<CompleteReceipt> => {
  return sendRequest<undefined, CompleteReceipt>(`/receipt/get/${receiptId}`, GET);
};

export const postReceiptReview = async (receiptreview: ReceiptReview): Promise<void> => {
  return sendRequest<ReceiptReview, void>('/admin/receipt/review', POST, receiptreview);
}; 