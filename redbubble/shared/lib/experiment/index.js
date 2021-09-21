import md5 from 'md5';

export const CONTROL = 'control';
export const VARIANT = 'variant';

export const isInExperiment = (experiments, experimentName) =>
  !!(experiments || [])
    .filter(Boolean)
    .find(e => e.experiment === experimentName);

export const isInVariant = (experiments, experimentName, ...groupNames) => {
  const targetGroupNames = groupNames.length === 0 ? [VARIANT] : groupNames;

  const groupMatchingTarget = experimentGroupName =>
    targetGroupName => experimentGroupName === targetGroupName;

  const matchingVariant = e =>
    e.experiment === experimentName &&
    targetGroupNames.some(groupMatchingTarget(e.group));

  return !!(experiments || [])
    .filter(Boolean)
    .find(matchingVariant);
};

export const getExperimentGroup = (experiments, experimentName) => {
  const experiment = (experiments || [])
    .filter(Boolean)
    .find(e => e.experiment === experimentName);
  return experiment ? experiment.group : null;
};

export const md5BasedBucketDivision = (term, numberOfBuckets) => {
  return parseInt(md5(term).slice(-1), 16) % numberOfBuckets;
};

export const md5BasedExperimentAllocation = (s, experimentName) => {
  const result = md5BasedBucketDivision(s + experimentName, 2);
  return result === 0 ? CONTROL : VARIANT;
};

export const inMd5BasedExperimentVariant = (s, experimentName) => {
  return md5BasedExperimentAllocation(s, experimentName) === VARIANT;
};

export const serializeExperiments = (experiments) => {
  let serializedExperiments = '';

  if (Array.isArray(experiments) && experiments.length > 0) {
    serializedExperiments = experiments
      .filter(experiment => experiment && experiment.experiment && experiment.group)
      .map(experiment => `${experiment.experiment}=${experiment.group}`)
      .sort()
      .join(',');
  } else if (experiments && typeof experiments === 'object') {
    serializedExperiments = Object.keys(experiments)
      .map(key => `${key}=${experiments[key]}`)
      .sort()
      .join(',');
  }

  return serializedExperiments;
};
