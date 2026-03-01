import React, { useState } from 'react';
import ReceiptRow from '../../components/receipt/ReceiptRow';
import { Receipt_Info } from '../../api/adminReceiptAPI';
import Button from '../../components/universal/Button';
import { Oval } from 'react-loader-spinner';

interface ReceiptTableProps {
  receipts: Receipt_Info[] | undefined;
  receiptsLoading: boolean;
  receiptStatus: String | undefined | null;
  setReceiptStatus: (status: string | null) => void;
}

const ReceiptTable = ({
  receipts,
  receiptsLoading,
  receiptStatus,
  setReceiptStatus,
}: ReceiptTableProps) => {
  const selectedButton =
    receiptStatus === 'NONE' ? 'active' : receiptStatus === 'DONE' ? 'history' : 'none';

  const handleSetActive = () => {
    setReceiptStatus(receiptStatus === 'NONE' ? null : 'NONE');
  };

  const handleSetHistory = () => {
    setReceiptStatus(receiptStatus === 'DONE' ? null : 'DONE');
  };

  const sortedReceipts = React.useMemo(() => {
    if (!receipts) return [];
    return [...receipts].sort(
      (a, b) => new Date(b.receiptCreatedAt).getTime() - new Date(a.receiptCreatedAt).getTime()
    );
  }, [receipts]);

  return (
    <div>
      {/* Buttons Section */}
      <div className="w-full flex flex-row justify-start items-center max-w-[1100px] ml-auto mr-auto pl-5 pt-5 space-x-4">
        <Button
          title="Aktive"
          color={selectedButton === 'active' ? 'green' : 'darkGreen'}
          onClick={handleSetActive}
          className="w-[120px] rounded-t-lg rounded-b-none"
        />
        <Button
          title="Historikk"
          color={selectedButton === 'history' ? 'green' : 'darkGreen'}
          onClick={handleSetHistory}
          className="w-[120px] rounded-t-lg rounded-b-none"
        />
      </div>

      <hr className="max-w-[1100px] ml-auto mr-auto" />

      <div className="min-h-[280px] flex justify-center items-center">
        {receiptsLoading ? (
          <Oval height={40} />
        ) : receipts && receipts.length > 0 ? (
          <table className="w-full border-separate border-spacing-y-3 max-w-[1100px] ml-auto mr-auto">
            <thead>
              <tr>
                <th></th>
                <th className="text-left text-white text-xl font-normal hidden md:table-cell">
                  Komité
                </th>
                <th className="text-left text-white text-xl font-normal">Anledning</th>
                <th className="text-left text-white text-xl font-normal hidden lg:table-cell">
                  Type
                </th>
                <th className="text-left text-white text-xl font-normal hidden lg:table-cell">
                  Kommentar
                </th>
                <th className="text-middle w-[110px] text-white text-xl font-normal">Dato</th>
              </tr>
            </thead>
            <tbody>
              {sortedReceipts.map((receipt) => (
                <ReceiptRow key={receipt.receiptId} receipt={receipt} />
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-middle text-white text-xl font-normal pt-5">
            Ingen kvitteringer å vise
          </p>
        )}
      </div>
    </div>
  );
};

export default ReceiptTable;
