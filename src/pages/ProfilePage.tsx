import ProfileCard from '../components/profile/ProfileCard';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchAllUserReceipts } from '../api/userAPI';
import ReceiptTable from '../components/receipt/ReceiptTable';
import { Pagination } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

const ProfilePage = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(); // The debounced value
  const rowsPerPage = 5;
  const [receiptStatus, setReceiptStatus] = useState<string | null>('NONE');
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);

  const handleChangePage = (event: unknown, newPage: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', String(newPage));
      return params;
    });
  };

  const { data: receiptData, isLoading: receiptDataLoading } = useQuery({
    queryKey: ['receipts_user', page - 1, rowsPerPage, receiptStatus, debouncedSearchTerm],
    queryFn: () => fetchAllUserReceipts(page - 1, rowsPerPage, receiptStatus),
  });

  return (
    <div className="flex min-h-screen pt-5 mx-5 gap-x-6">
      <div className="hidden md:block lg:block">
        <ProfileCard />
      </div>
      <div className="mx-auto rounded-xl w-full p-4 sm:p-6 md:p-8 bg-[#669782] h-full">
        <ReceiptTable
          receipts={receiptData?.receipts}
          receiptsLoading={receiptDataLoading}
          setReceiptStatus={setReceiptStatus}
          receiptStatus={receiptStatus}
        />
        {receiptData && receiptData.total > 0 && (
          <Pagination
            className="flex justify-center mt-5"
            count={Math.ceil(receiptData.total / rowsPerPage)}
            color="primary"
            page={page}
            onChange={handleChangePage}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
