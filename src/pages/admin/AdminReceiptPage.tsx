import React, { useState, useEffect, useMemo } from "react";
import { fetchAllReceipts, Receipt_Info } from "../../api/adminReceiptAPI";
import { useQuery } from "@tanstack/react-query";
import { fetchCommittees, Committee } from "../../api/baseAPI";
import {
  Checkbox,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Pagination,
} from "@mui/material";
import ReceiptTable from "../../components/receipt/ReceiptTable";
import debounce from "lodash.debounce";
import AdminBadge from "../../components/admin/AdminBadge";

const AdminReceiptPage = () => {
  const [receipts, setReceipts] = useState<Receipt_Info[]>([]);
  const [selectedCommittees, setSelectedCommittees] = useState<string[]>([]);
  const [receiptStatus, setReceiptStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // The raw value from the input field
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(); // The debounced value

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const debouncedSetSearchTerm = useMemo(
    () => debounce((value: string) => setDebouncedSearchTerm(value), 500),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
 
    setSearchTerm(value);
    debouncedSetSearchTerm(value);
  };

  useEffect(() => {
    
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [debouncedSetSearchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, selectedCommittees, receiptStatus]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const {
    data: receiptData,
    isLoading: receiptDataLoading,
    isError,
  } = useQuery({
    queryKey: [
      "receipts_admin",
      page - 1,
      rowsPerPage,
      receiptStatus,
      debouncedSearchTerm,
      selectedCommittees.join(","),
    ],
    queryFn: () =>
      fetchAllReceipts(
        page - 1,
        rowsPerPage,
        receiptStatus,
        debouncedSearchTerm,
        selectedCommittees.join(","),

      ),
  });

  const { data: committeeData } = useQuery({
    queryKey: ["committees"],
    queryFn: () => fetchCommittees(),
  });

  const handleCommitteeChange = (event: any) => {
    const value = event.target.value;
    setSelectedCommittees(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div className="w-full flex-row p-5">
      <div>
        <AdminBadge />
        <h1 className="text-3xl font-bold pt-5 text-white">
          Alle kvitteringer
        </h1>
      </div>
      <div className="w-full flex flex-row justify-between items-center max-w-[1100px] ml-auto mr-auto pb-5 pt-16">
        <TextField
          id="search"
          placeholder="Søk på anledning..."
          variant="outlined"
          onChange={handleSearchChange}
          value={searchTerm}
          sx={{
            backgroundColor: "white",
            width: "200px",
            height: "40px",
            borderRadius: "4px",
            "& .MuiOutlinedInput-root": {
              height: "40px",
            },
            "& .MuiInputLabel-root": {
              top: "-5px",
            },
          }}
        />
        <FormControl sx={{ width: "200px", height: "40px" }}>
          <Select
            id="committeeDropdown"
            multiple
            value={selectedCommittees || ""}
            onChange={handleCommitteeChange}
            inputProps={{ "aria-label": "Without label" }}
            input={<OutlinedInput notched={false} />}
            displayEmpty
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <span className="text-gray-500">Filtrer...</span>;
              }
              return selected.join(", ");
            }}
            sx={{
              backgroundColor: "white",
              height: "40px",
              textAlign: "left",
            }}
          >
            {committeeData &&
              committeeData?.map((committee: Committee) => (
                <MenuItem key={committee.id} value={committee.name}>
                  <Checkbox
                    checked={selectedCommittees.includes(committee.name)}
                  />
                  {committee.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>
      {(receiptData || receiptDataLoading) && (
        <ReceiptTable
          receipts={receiptData?.receipts}
          receiptsLoading={receiptDataLoading}
          receiptStatus={receiptStatus}
          setReceiptStatus={setReceiptStatus}        />
      )}
      {receiptData && receiptData.total > 0 && (
        <Pagination
          className="flex justify-center mt-5"
          count={Math.ceil(receiptData?.total / rowsPerPage)}
          color="primary"
          page={page}
          onChange={handleChangePage}
        />
      )}
    </div>
  );
};

export default AdminReceiptPage;
