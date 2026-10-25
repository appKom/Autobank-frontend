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
  InputAdornment,
} from '@mui/material';
import ReceiptTable from '../../components/receipt/ReceiptTable';
import debounce from 'lodash.debounce';
import AdminBadge from '../../components/admin/AdminBadge';
import { useSearchParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const AdminReceiptPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>(''); // The raw value from the input field
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(); // The debounced value

  const receiptStatus = searchParams.get('status') ?? 'NONE';

  const setReceiptStatus = (status: string | null) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (status) {
        params.set('status', status);
      } else {
        params.delete('status');
      }

      params.delete('page');
      return params;
    });
  };

  const page = Number(searchParams.get('page') || 1);
  const rowsPerPage = 10;

  const selectedCommittees = useMemo(() => {
    return searchParams.get('committees')?.split(',').filter(Boolean) || [];
  }, [searchParams]);

  const debouncedSetSearchTerm = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value);
      }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchTerm(value);

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      params.delete('page');

      if (value.trim()) {
        params.set('search', value);
      } else {
        params.delete('search');
      }

      return params;
    });

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
    const searchFromUrl = searchParams.get('search') ?? '';

    setSearchTerm(searchFromUrl);
    setDebouncedSearchTerm(searchFromUrl);
    debouncedSetSearchTerm.cancel();
  }, [searchParams, debouncedSetSearchTerm]);

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

    params.delete('page');

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
      <div className="w-full max-w-[600px] mx-auto pb-5 pt-10">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <TextField
            id="search"
            placeholder="Søk på anledning..."
            variant="outlined"
            onChange={handleSearchChange}
            value={searchTerm}
            className="w-full min-w-0 sm:flex-[2]"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {' '}
                  <SearchIcon sx={{ color: '#6b7280' }} />{' '}
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                height: '48px',
                borderRadius: '8px',
                '& fieldset': { borderColor: '#e5e7eb' },
                '&:hover fieldset': { borderColor: '#9ca3af' },
                '&.Mui-focused fieldset': { borderColor: '#64748b' },
              },
            }}
          />

          {/* Committee filter */}
          <FormControl className="w-full min-w-0 sm:flex-1">
            <Select
              id="committeeDropdown"
              multiple
              value={selectedCommittees}
              onChange={handleCommitteeChange}
              inputProps={{ 'aria-label': 'Without label' }}
              input={
                <OutlinedInput
                  notched={false}
                  startAdornment={
                    <InputAdornment position="start">
                      {' '}
                      <FilterListIcon sx={{ color: '#6b7280' }} />{' '}
                    </InputAdornment>
                  }
                />
              }
              displayEmpty
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <span className="text-gray-500">Filtrer...</span>;
                }
                return selected.join(', ');
              }}
              sx={{
                backgroundColor: 'white',
                height: '48px',
                borderRadius: '8px',
                textAlign: 'left',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#64748b' },
                '& .MuiSelect-select': { display: 'flex', alignItems: 'center' },
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
