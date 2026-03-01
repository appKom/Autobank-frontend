import { GET, POST, sendRequest } from "./helper";

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

export const fetchAllReceipts = async (
  from: number,
  count: number,
  status: string | null,
  search?: string,
  committee?: string,
  sortOrder?: string,
  sortField?: string,
): Promise<AllReceiptsResponse> => {
  const params = new URLSearchParams({
    from: from.toString() || "0",
    count: count.toString() || "10",
  });

  if (search) params.append("search", search);
  if (committee) params.append("committee", committee);
  if (status) params.append("status", status);
  if (sortOrder) params.append("sortOrder", sortOrder);
  if (sortField) params.append("sortField", sortField);

  const url = `/admin/receipt/all?${params.toString()}`;

  return sendRequest<undefined, AllReceiptsResponse>(url, GET);
};

export const fetchCompleteReceipt = async (
  receiptId: String,
): Promise<CompleteReceipt> => {
  return sendRequest<undefined, CompleteReceipt>("/admin/receipt/get/" + receiptId, GET);
};

export const postReceiptReview = async (
  receiptreview: ReceiptReview,
): Promise<void> => {
  return sendRequest<ReceiptReview, void>("/admin/receipt/review", POST, receiptreview);
};
