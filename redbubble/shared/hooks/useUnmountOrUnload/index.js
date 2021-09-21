import { useEffect } from 'react';

const useUnmountOrUnload = (callback) => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      callback();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      callback();
    };
  }, [callback]);
};

export default useUnmountOrUnload;
