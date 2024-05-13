import React, { useCallback, useState, useEffect } from 'react';


export function usePagination(
    initialPage = 0,
    intitalPageSize = 4,
    initialSort = "asc"
  ) {
    const [pageNumber, setPageNumber] = useState(initialPage);
    const [pageSize, setPageSize] = useState(intitalPageSize);
    const [sort, setSort] = useState(initialSort);
    const [pageableState, setPageableState] = useState({});
  
    const incrementPageNumber = useCallback(() => {
      if (!pageableState.last) {
        setPageNumber((prev) => prev + 1);
      }
    }, [pageableState.last]);
  
    const decrementPageNumber = useCallback(() => {
      if (!pageableState.first) {
        setPageNumber((prev) => prev - 1);
      }
    }, [pageableState.first]);
  
    const updatePageableState = useCallback((pageable) => {
      setPageableState({
        empty: pageable.empty,
        first: pageable.first,
        last: pageable.last,
        totalPages: pageable.totalPages,
      });
    }, []);
  
    return {
      pageNumber,
      pageSize,
      sort,
      pageableState,
      setPageNumber,
      setPageSize,
      setSort,
      incrementPageNumber,
      decrementPageNumber,
      updatePageableState,
    };
  };