import { useEffect } from 'react';
import get from 'lodash/get';

const useSearchBar = (updateParsedQuery, updateSearchTerm, searchBarConfig) => {
  useEffect(() => {
    const keywords = get(searchBarConfig, 'keywords', []).join(' ');
    const iaCode = get(searchBarConfig, 'iaCode');

    updateParsedQuery({ iaCode }); // Needed to pass along the iaCode
    updateSearchTerm(keywords); // Needed to show and pass along keywords
  }, [updateParsedQuery, updateSearchTerm, searchBarConfig]);
};

export default useSearchBar;
