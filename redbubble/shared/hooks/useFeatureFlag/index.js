import { useSessionContext } from '@redbubble/boom-session-context';
import get from 'lodash/get';


/**
  * useFeatureFlag Hook
  *
  * @param {string|string[]} flags - A single feature flag name or an array of flag names
  *
  * @return {[boolean, (boolean|boolean[])]}
  *
  * Returns the loading state and a boolean or array
  * of booleans indicating whether the features are enabled
  *
  * @example
  *
  * const [loading, featureAEnabled] = useFeatureFlag('a');
  * const [loading, [featureAEnabled, featureBEnabled]] = useFeatureFlag(['a', 'b']);
  *
  */
const useFeatureFlag = (flags) => {
  const { loading, ...session } = useSessionContext();
  const enabledFeatures = get(session, 'features', []);

  if (Array.isArray(flags)) {
    return [
      loading,
      flags.map(flag => enabledFeatures.includes(flag)),
    ];
  }

  return [loading, enabledFeatures.includes(flags)];
};

export default useFeatureFlag;
