/* eslint-disable react/jsx-key */
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTable, usePagination } from 'react-table';
import { apiConnector } from '../../../services/apiConnector';
import { GET_HOSPITALS_LIST } from '../../../services/apis';

const fetchHospitals = async (page = 1, limit = 10, approvalStatus) => {
    const params = {
        page,
        limit,
    }
    if (approvalStatus) {
        params.approvalStatus = approvalStatus;
    }
    const data = await apiConnector('GET', GET_HOSPITALS_LIST, {}, {}, params)
    return data;
};
export default function AdminHospitalsList() {

    const [approvalStatus, setApprovalStatus] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, isError, error } = useQuery(
        ['hospitals', page, limit, approvalStatus],
        () => fetchHospitals(page, limit, approvalStatus),
        {
          keepPreviousData: true,
          refetchIntervalInBackground: false,
          refetchOnWindowFocus: false,
        }
    );

    const columns = useMemo(() => [
        { Header: 'Name', accessor: 'additionalFields.hospitalName' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Approval Status', accessor: 'approvalStatus' },
        // Add more columns as necessary
      ], []);

      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable(
        {
          columns,
          data: data?.data?.hospitals || [],
          initialState: { pageIndex: page - 1, pageSize: limit },
          manualPagination: true,
          pageCount: data?.data?.total ? Math.ceil(data?.data?.total / limit) : 0,
        },
        usePagination
      );

      if (isLoading) return <div className="text-center mt-4">Loading...</div>;
      if (isError) return <div className="text-center mt-4">Error: {error.message}</div>;
  
      return (
          <div className="container mx-auto mt-4">
            <h3 className='font-semibold text-2xl mb-6'>Hospitals List</h3>
              <div className="mb-4">
                  <label className="mr-2">Filter by Approval Status:</label>
                  <select value={approvalStatus} onChange={e => setApprovalStatus(e.target.value)} className="p-2 rounded border-2">
                      <option value=''>All</option>
                      <option value='Started'>Started</option>
                      <option value='Pending'>Pending</option>
                      <option value='Rejected'>Rejected</option>
                      <option value='Approved'>Approved</option>
                  </select>
              </div>
              <table {...getTableProps()} className="w-full border-collapse border border-gray-300">
                  <thead>
                      {headerGroups.map(headerGroup => (
                          <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
                              {headerGroup.headers.map(column => (
                                  <th {...column.getHeaderProps()} className="p-2 text-left">{column.render('Header')}</th>
                              ))}
                          </tr>
                      ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                      {rows.map(row => {
                          prepareRow(row);
                          return (
                              <tr {...row.getRowProps()} className="border-t border-gray-300">
                                  {row.cells.map(cell => (
                                      <td {...cell.getCellProps()} className="p-2">{cell.render('Cell')}</td>
                                  ))}
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
              <div className="flex justify-between items-center mt-4">
                  <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1} className="px-4 py-2 bg-gray-200 rounded" >
                      Previous
                  </button>
                  <span>Page {page}</span>
                  <button
                      onClick={() => setPage(prev => (!data?.data || !data?.data?.total || prev >= Math.ceil(data?.data?.total / limit) ? prev : prev + 1))}
                      disabled={!data?.data || !data?.data?.total || page >= Math.ceil(data?.data?.total / limit)}
                      className="px-4 py-2 bg-gray-200 rounded"
                  >
                      Next
                  </button>
              </div>
          </div>
    )
}