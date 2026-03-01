import ProfileCard from "../components/profile/ProfileCard";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchAllUserReceipts } from "../api/userAPI";
import ReceiptTable from "../components/receipt/ReceiptTable";
import { Pagination } from "@mui/material";
import { useEffect } from "react";

const ProfilePage = () => {

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(); // The debounced value
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [receiptStatus, setReceiptStatus] = useState<string | null>("NONE");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const {
    data: receiptData,
    isLoading: receiptDataLoading,
  } = useQuery({
    queryKey: [
      "receipts_user",
      page - 1,
      rowsPerPage,
      receiptStatus,
      debouncedSearchTerm,
    ],
    queryFn: () => fetchAllUserReceipts(page - 1, rowsPerPage, receiptStatus),
  });

   useEffect(() => {
      setPage(1);
    }, [debouncedSearchTerm, receiptStatus]);

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
