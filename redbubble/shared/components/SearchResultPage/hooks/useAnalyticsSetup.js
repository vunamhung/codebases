import { useEffect } from 'react';

const useAnalyticsSetup = (validateAndSetDimensions, searchUUID, formattedQuery) => {
  useEffect(() => {
    validateAndSetDimensions({
      searchUUID,
      rawSearchQuery: formattedQuery,
    });
  }, [validateAndSetDimensions, searchUUID, formattedQuery]);
};

export default useAnalyticsSetup;
