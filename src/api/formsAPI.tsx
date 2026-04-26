import { sendRequest, POST } from './helper';

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

interface EconomicrequestDTO {
  subject: string;
  purpose: string;
  date: string;
  description: string;
  amount: number;
  paymentDescription: string;
  otherInformation?: string;
  committeeId?: string;
  onlinemail?: string;
}

interface EconomicrequestRequestBody {
  economicrequest: EconomicrequestDTO;
  attachments: string[];
}

export const submitReceipt = async (receiptbody: ReceiptRequestBody) => {
  return sendRequest<ReceiptRequestBody, void>('/receipt/create', POST, receiptbody);
};

export const submitEconomicRequest = async (body: EconomicrequestRequestBody) => {
  return sendRequest<EconomicrequestRequestBody, void>('/economicrequest/create', POST, body);
};
