import { useEffect } from 'react';
import get from 'lodash/get';

const useSearchPill = (updateProductContext, searchBarConfig) => {
  useEffect(() => {
    const id = get(searchBarConfig, 'iaCode');
    const label = get(searchBarConfig, 'pillLabel');

    updateProductContext({ id, label }); // Needed to show the iaCode/pill
  }, [updateProductContext, searchBarConfig]);
};

export default useSearchPill;
