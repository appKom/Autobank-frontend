import { sendRequest, POST } from "./helper";

interface Receipt {
  amount: number;
  committee_id: string;
  name: string;
  description: string;
  id: 0;
}

interface ReceiptRequestBody {
  receipt: Receipt;
  attachments: string[];
}

interface Application {
  field1: string;
  field2: string;
  field3: string;
  amount: number;
  attachments: string[];
  comments: string;
  id: 0;
}

export const submitReceipt = async (receiptbody: ReceiptRequestBody) => {
  return sendRequest<ReceiptRequestBody, void>("/receipt/create", POST, receiptbody);
};

export const submitEconomicRequest = async (application: Application) => {
  //return sendRequest<Application, void>("/application/create", POST, application);
};
