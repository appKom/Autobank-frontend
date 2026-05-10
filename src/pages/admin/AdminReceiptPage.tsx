import React, { useState, useEffect, useMemo } from 'react';
import { fetchAllReceipts } from '../../api/adminReceiptAPI';
import { useQuery } from '@tanstack/react-query';
import { fetchCommittees, Committee } from '../../api/baseAPI';
import {
  Checkbox,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Pagination,
} from '@mui/material';
import ReceiptTable from '../../components/receipt/ReceiptTable';
import debounce from 'lodash.debounce';
import AdminBadge from '../../components/admin/AdminBadge';
import { useSearchParams } from 'react-router-dom';

const AdminReceiptPage = () => {
  const [receiptStatus, setReceiptStatus] = useState<string | null>('NONE');
  const [searchTerm, setSearchTerm] = useState<string>(''); // The raw value from the input field
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(); // The debounced value

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const rowsPerPage = 10;

  const selectedCommittees = useMemo(() => {
    return searchParams.get('committees')?.split(',').filter(Boolean) || [];
  }, [searchParams]);

  const debouncedSetSearchTerm = useMemo(
    () => debounce((value: string) => setDebouncedSearchTerm(value), 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchTerm(value);
    debouncedSetSearchTerm(value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setSearchParams((prev: URLSearchParams) => {
      const params = new URLSearchParams(prev);
      params.set('page', String(newPage));
      return params;
    });
  };

  useEffect(() => {
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [debouncedSetSearchTerm]);

  const {
    data: receiptData,
    isLoading: receiptDataLoading,
    isError,
  } = useQuery({
    queryKey: [
      'receipts_admin',
      page - 1,
      rowsPerPage,
      receiptStatus,
      debouncedSearchTerm,
      selectedCommittees.join(','),
    ],
    queryFn: () =>
      fetchAllReceipts(
        page - 1,
        rowsPerPage,
        receiptStatus,
        debouncedSearchTerm,
        selectedCommittees.join(',')
      ),
  });

  const { data: committeeData } = useQuery({
    queryKey: ['committees'],
    queryFn: () => fetchCommittees(),
  });

  const handleCommitteeChange = (event: any) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams);

    if (value.length) {
      params.set('committees', value.join(','));
    } else {
      params.delete('committees');
    }

    setSearchParams(params);
  };

  return (
    <div className="w-full flex-row p-5">
      <div>
        <AdminBadge />
        <h1 className="text-3xl font-bold pt-5 text-white">Alle kvitteringer</h1>
      </div>
      <div className="w-full flex flex-row justify-between items-center max-w-[1100px] ml-auto mr-auto pb-5 pt-16">
        <TextField
          id="search"
          placeholder="Søk på anledning..."
          variant="outlined"
          onChange={handleSearchChange}
          value={searchTerm}
          sx={{
            backgroundColor: 'white',
            width: '200px',
            height: '40px',
            borderRadius: '4px',
            '& .MuiOutlinedInput-root': {
              height: '40px',
            },
            '& .MuiInputLabel-root': {
              top: '-5px',
            },
          }}
        />
        <FormControl sx={{ width: '200px', height: '40px' }}>
          <Select
            id="committeeDropdown"
            multiple
            value={selectedCommittees}
            onChange={handleCommitteeChange}
            inputProps={{ 'aria-label': 'Without label' }}
            input={<OutlinedInput notched={false} />}
            displayEmpty
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <span className="text-gray-500">Filtrer...</span>;
              }
              return selected.join(', ');
            }}
            sx={{
              backgroundColor: 'white',
              height: '40px',
              textAlign: 'left',
            }}
            MenuProps={{
              disableScrollLock: true,
              container: document.body,
              keepMounted: true,
            }}
          >
            {committeeData &&
              committeeData?.map((committee: Committee) => (
                <MenuItem key={committee.id} value={committee.name}>
                  <Checkbox checked={selectedCommittees.includes(committee.name)} />
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
          setReceiptStatus={setReceiptStatus}
        />
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
