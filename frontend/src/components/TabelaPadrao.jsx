import React from "react";
import { Table, Pagination, Form, FormControl } from "react-bootstrap";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import "./TabelaPadrao.css";

const TabelaPadrao = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,

    setGlobalFilter,
    state: { pageIndex, globalFilter },
    gotoPage,
    pageCount,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const renderPagination = () => {
    if (pageCount <= 1) {
      // Se houver apenas uma página ou menos, não exibe a paginação
      return null;
    }

    const paginationItems = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(0, pageIndex - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(pageCount - 1, startPage + maxPagesToShow - 1);

    if (startPage > 0) {
      paginationItems.push(
        <Pagination.Item
          className="botao-paginacao"
          key="first"
          onClick={() => gotoPage(0)}>
          {"Primeiro"}
        </Pagination.Item>
      );
      paginationItems.push(
        <Pagination.Item key="prev" onClick={() => previousPage()}>
          {"<"}
        </Pagination.Item>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <Pagination.Item
          key={i}
          active={i === pageIndex}
          onClick={() => gotoPage(i)}>
          {i + 1}
        </Pagination.Item>
      );
    }

    if (endPage < pageCount - 1) {
      paginationItems.push(
        <Pagination.Item key="next" onClick={() => nextPage()}>
          {">"}
        </Pagination.Item>
      );
      paginationItems.push(
        <Pagination.Item key="last" onClick={() => gotoPage(pageCount - 1)}>
          {"Último"}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="pagination-custom justify-content-end">
        {paginationItems}
      </Pagination>
    );
  };

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setGlobalFilter(value);
  };

  return (
    <div>
      <Form className="mt-4">
        <FormControl
          type="text"
          value={globalFilter || ""}
          onChange={handleFilterChange}
          placeholder="Filtrar registros..."
          className="mb-3"
        />
      </Form>
      <Table bordered hover className="mt-4" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <i className="bi bi-caret-down-fill"></i>
                    ) : (
                      <i className="bi bi-caret-up-fill"></i>
                    )
                  ) : (
                    ""
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
      {renderPagination()}
    </div>
  );
};

export default TabelaPadrao;
