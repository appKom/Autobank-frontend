import React from 'react';
import {
  CalendarIcon,
  CreditCardIcon,
  UserIcon,
  PaperClipIcon,
  ClockIcon,
  CurrencyEuroIcon,
} from '@heroicons/react/24/outline';
import { fetchCompleteReceipt, postReceiptReview, ReceiptReview } from '../../api/adminReceiptAPI';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/universal/Spinner';
import AdminBadge from '../../components/admin/AdminBadge';
import AttachmentViewer from '../../components/receipt/AttachmentViewer';

const AdminReviewReceiptPage = () => {
  const receiptid = useParams<{ receiptid: string }>().receiptid;
  const navigate = useNavigate();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['completereceipt', receiptid],
    queryFn: () => fetchCompleteReceipt(receiptid as string),
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('no', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const [newReviewStatus, setNewReviewStatus] = React.useState('');
  const [reviewComment, setReviewComment] = React.useState('');

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const receiptreview: ReceiptReview = {
      receiptId: receiptid as string,
      status: newReviewStatus,
      comment: reviewComment,
    };

    try {
      await postReceiptReview(receiptreview);
      alert('Review sent');
      navigate('/admin/kvittering');
    } catch (error) {
      console.error(error);
      alert('Error sending review');
    }
  };

  return (
    <div className="min-h-screen bg-[#2e6e53] text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center flex flex-col gap-4 items-center">
          <AdminBadge className="w-[80px]" />
          Kvittering
        </h1>
        {isError && (
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg mx-auto">
            Det har oppstått en feil. Prøv å logg inn og ut, eller refresh siden.
          </div>
        )}
        {isLoading && (
          <div className="mt-[100px] font-bold text-xl text-white mx-auto">
            <Spinner size={4} color="green" />
            <p className="mt-[20px] text-green">Vennligst vent</p>
          </div>
        )}
        {data && (
          <div className="mt-[20px] space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex-col w-full">
                <p className="text-left tracking-wide">Kvittering ID</p>
                <input
                  value={data.receiptId}
                  readOnly
                  className="bg-white bg-opacity-10 text-white p-3 rounded w-full"
                />
              </div>
              <div className="flex-col w-full">
                <p className="text-left tracking-wide">Beløp</p>
                <input
                  value={`kr ${data.amount.toFixed(2)}`}
                  readOnly
                  className="bg-white bg-opacity-10 text-white p-3 rounded w-full"
                />
              </div>
              <div className="flex-col w-full">
                <p className="text-left tracking-wide">Anledning</p>
                <input
                  value={data.receiptName}
                  readOnly
                  className="bg-white bg-opacity-10 text-white p-3 rounded w-full"
                />
              </div>
              <div className="flex-col w-full">
                <p className="text-left tracking-wide">Komité</p>
                <input
                  value={data.committeeName}
                  readOnly
                  className="bg-white bg-opacity-10 text-white p-3 rounded w-full"
                />
              </div>
            </div>

            <div className="flex-col w-full">
              <p className="text-left tracking-wide">Beskrivelse</p>
              <textarea
                value={data.receiptDescription}
                readOnly
                className="bg-white bg-opacity-10 text-white p-3 rounded w-full h-[120px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex-col w-full">
                <p className="text-left tracking-wide">Sendt inn</p>
                <div className="flex items-center bg-white bg-opacity-10 text-white p-3 rounded w-full">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>{formatDate(data.receiptCreatedAt)}</span>
                </div>
              </div>
              <div className="flex-col w-full">
                <p className="text-left tracking-wide">Bruker</p>
                <div className="flex items-center bg-white bg-opacity-10 text-white p-3 rounded w-full">
                  <UserIcon className="h-5 w-5 mr-2" />
                  <span>{data.userFullname}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex-col w-full">
                <p className="text-left tracking-wide">Type</p>
                <div className="flex-col text-left bg-white bg-opacity-10 text-white p-3 rounded w-full">
                  <p className="font-bold mr-auto">
                    {data.paymentOrCard == 'Card' ? 'Onlinekort' : 'Utlegg'}
                  </p>
                  {data.paymentOrCard === 'Card' ? (
                    <p>
                      <span className="font-semibold">Kort benyttet:</span> {data.cardUsed}
                    </p>
                  ) : (
                    <p>
                      <span className="font-semibold">Kontonummer:</span>{' '}
                      {data.paymentAccountNumber}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-col w-full">
                <p className="text-left tracking-wide">Status</p>
                <div className="flex items-center bg-white bg-opacity-10 text-white p-3 rounded w-full">
                  {data.latestReviewStatus && data.latestReviewCreatedAt != null ? (
                    <div className="flex-col text-left">
                      <span
                        className={`px-2 py-1 rounded-full text-xs mb-2 font-semibold ${
                          data.latestReviewStatus === 'APPROVED'
                            ? 'bg-green-500 text-green-900'
                            : 'bg-red-500 text-red-900'
                        }`}
                      >
                        {data.latestReviewStatus == 'APPROVED' ? 'Godkjent' : 'Ikke godkjent'}
                      </span>
                      <p className="ml-2 my-2">
                        <span className="font-bold">Dato: </span>
                        {formatDate(data.latestReviewCreatedAt)}
                      </p>
                      <p className="ml-2">
                        <span className="font-bold">Kommentar: </span>
                        {data.latestReviewComment}
                      </p>
                    </div>
                  ) : (
                    <span className="text-white">Ikke besvart</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-col w-full">
              <p className="text-left tracking-wide">Vedlegg ({data.attachmentCount})</p>
              {data.attachmentCount != 0 && (
                <div className="bg-white bg-opacity-10 text-white p-3 rounded w-full">
                  {data.attachments.map((attachment, index) => {
                    const fileType = attachment.split('.')[0].replace(':', '/');
                    const base64 = attachment.split('.')[1];

                    // PDF attachment
                    if (fileType === 'application/pdf') {
                      return (
                        <AttachmentViewer
                          type="pdf"
                          src={`data:application/pdf;base64,${base64}`}
                        />
                      );
                    } else if (fileType.includes('image')) {
                      // image attachment
                      return (
                        <AttachmentViewer
                          type="image"
                          src={`data:application/pdf;base64,${base64}`}
                        />
                      );
                    } else {
                      return (
                        <a
                          href={`data:${fileType};base64,${attachment.split('.')[1]}`}
                          key={index}
                          download
                          className="flex items-center gap-2"
                        >
                          <PaperClipIcon className="h-5 w-5" />
                          <span>Last ned vedlegg</span>
                        </a>
                      );
                    }
                  })}
                </div>
              )}
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-center ">
              <h2 className="text-2xl">Ny review</h2>
              <div className=" ">
                <label htmlFor="status" className="block text-sm font-medium">
                  Ny status
                </label>
                <select
                  id="status"
                  value={newReviewStatus}
                  onChange={(e) => setNewReviewStatus(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 mx-auto focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md bg-white bg-opacity-20 text-white"
                  required
                >
                  <option value="" className="text-black">
                    Velg status
                  </option>
                  <option value="APPROVED" className="text-black">
                    Godkjent
                  </option>
                  <option value="DENIED" className="text-black">
                    Ikke godkjent
                  </option>
                </select>
              </div>
              <div className="">
                <label htmlFor="comment" className="block text-sm font-medium">
                  Kommentar
                </label>
                <textarea
                  id="comment"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  className="mt-1 p-3 block w-full sm:text-sm border-gray-300 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400"
                  placeholder="Add a comment..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Send review
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewReceiptPage;
