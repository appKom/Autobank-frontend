import React from 'react';
import ReceiptRow from '../../components/receipt/ReceiptRow';
import { Receipt_Info } from '../../api/adminReceiptAPI';
import Button from '../../components/universal/Button';
import { Oval } from 'react-loader-spinner';
import { useSearchParams } from 'react-router-dom';

interface ReceiptTableProps {
  receipts: Receipt_Info[] | undefined;
  receiptsLoading: boolean;
  receiptStatus: String | undefined | null;
  setReceiptStatus: (status: string | null) => void;
  showUser?: boolean;
  searchTerm?: string | null;
}

const ReceiptTable = ({
  receipts,
  receiptsLoading,
  receiptStatus,
  setReceiptStatus,
  showUser = false,
  searchTerm,
}: ReceiptTableProps) => {
  const selectedButton =
    receiptStatus === 'NONE' ? 'active' : receiptStatus === 'DONE' ? 'history' : 'none';

  const handleSetActive = () => {
    setReceiptStatus(receiptStatus === 'NONE' ? 'DONE' : 'NONE');
  };

  const handleSetHistory = () => {
    setReceiptStatus(receiptStatus === 'DONE' ? 'NONE' : 'DONE');
  };

  type HistoryFilter = 'ALL' | 'APPROVED' | 'DENIED';

  // Kept in the URL (like the tab) so it survives navigating to a receipt and back.
  const [searchParams, setSearchParams] = useSearchParams();
  const historyFilterParam = searchParams.get('historyFilter');
  const historyFilter: HistoryFilter =
    historyFilterParam === 'APPROVED' || historyFilterParam === 'DENIED'
      ? historyFilterParam
      : 'ALL';

  const setHistoryFilter = (value: HistoryFilter) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (value === 'ALL') {
        params.delete('historyFilter');
      } else {
        params.set('historyFilter', value);
      }

      return params;
    });
  };

  const filteredReceipts = React.useMemo(() => {
    if (!receipts) return [];

    const sorted = [...receipts].sort(
      (a, b) => new Date(b.receiptCreatedAt).getTime() - new Date(a.receiptCreatedAt).getTime()
    );

    if (selectedButton !== 'history' || historyFilter === 'ALL') {
      return sorted;
    }

    return sorted.filter((receipt) => receipt.latestReviewStatus === historyFilter);
  }, [receipts, selectedButton, historyFilter]);

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

      {/* Filter on approved/denied receipt when in history */}
      {selectedButton === 'history' && (
        <div className="flex gap-2 px-5 py-3 max-w-[1100px] mx-auto">
          {(
            [
              { label: 'Alle', value: 'ALL' },
              { label: 'Godkjent', value: 'APPROVED' },
              { label: 'Avvist', value: 'DENIED' },
            ] as const
          ).map((filter) => (
            <button
              key={filter.value}
              onClick={() => setHistoryFilter(filter.value)}
              className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
                historyFilter === filter.value
                  ? 'bg-white text-[#477561] border-white'
                  : 'text-white border-white/40 hover:bg-white/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      <div className="min-h-[300px] flex justify-center items-start">
        {receiptsLoading ? (
          <Oval height={40} />
        ) : filteredReceipts.length > 0 ? (
          <table className="w-full table-fixed border-separate border-spacing-y-3 max-w-[1100px] ml-auto mr-auto">
            <colgroup>
              <col className="w-[50px]" />
              <col className="w-[180px] hidden md:table-column" />
              <col className="w-[35%]" />
              {showUser && <col className="w-[15%] hidden lg:table-column" />}
              <col className="w-[15%] hidden lg:table-column" />
              <col className="w-[12%] hidden lg:table-column" />
              <col className="w-[110px]" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th className="text-left text-white text-xl font-normal hidden md:table-cell">
                  Komité
                </th>
                <th className="text-left text-white text-xl font-normal">Anledning</th>
                {showUser && (
                  <th className="text-left text-white text-xl font-normal hidden lg:table-cell">
                    Navn
                  </th>
                )}
                <th className="text-left text-white text-xl font-normal hidden lg:table-cell">
                  Type
                </th>
                <th className="text-left text-white text-xl font-normal hidden lg:table-cell">
                  Beløp
                </th>
                <th className="text-middle w-[110px] text-white text-xl font-normal">Dato</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.map((receipt) => (
                <ReceiptRow
                  key={receipt.receiptId}
                  receipt={receipt}
                  showUser={showUser}
                  searchTerm={searchTerm}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <p
            className={`text-middle text-white text-xl font-normal ${
              selectedButton === 'history' ? 'pt-5' : 'pt-12'
            }`}
          >
            Ingen kvitteringer å vise
          </p>
        )}
      </div>
    </div>
  );
};

export default ReceiptTable;
