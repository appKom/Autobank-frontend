import React from 'react';
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Spinner from '../components/universal/Spinner';
import AdminBadge from '../components/admin/AdminBadge';
import { PaperClipIcon } from '@heroicons/react/24/solid';
import { fetchCompleteUserReceipt } from '../api/userAPI';
import AttachmentViewer from '../components/receipt/AttachmentViewer';

const DetailedReceiptPage = () => {
  const receiptid = useParams<{ receiptid: string }>().receiptid;

  const { data, isError, isLoading } = useQuery({
    queryKey: ['completereceipt', receiptid],
    queryFn: () => fetchCompleteUserReceipt(receiptid as string),
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

  return (
    <div className="min-h-screen bg-[#2e6e53] text-white p-4">
      <div className="container mx-auto">
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
                      <span className="font-semibold">Kortnummer:</span> {data.cardCardNumber}
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
                  {data.latestReviewStatus && data.latestReviewCreatedAt ? (
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

                    if (fileType === 'application/pdf') {
                      return (
                        <AttachmentViewer
                          key="receiptPDF"
                          type="pdf"
                          src={`data:${fileType};base64,${attachment.split('.')[1]}`}
                        />
                      );
                    } else if (fileType.includes('image')) {
                      return (
                        <AttachmentViewer
                          key="receiptImage"
                          type="image"
                          src={`data:${fileType};base64,${attachment.split('.')[1]}`}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedReceiptPage;
