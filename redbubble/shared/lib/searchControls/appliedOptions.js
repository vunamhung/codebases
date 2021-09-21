import get from 'lodash/get';

export const getAppliedOptionLabels = (options) => {
  return options
    .filter(({ applied }) => applied)
    .map(({ label }) => label);
};

export const getAllAppliedOptionLabels = (filters = []) => (filters || [])
  .filter(Boolean)
  .reduce(
    (accum, { options = [] }) => accum.concat(getAppliedOptionLabels(options)),
    [],
  );

const recursivelyFindAppliedCategory = (category) => {
  const { applied, options } = category;

  if (Array.isArray(options) && options.length) {
    const appliedChild = options
      .map(recursivelyFindAppliedCategory)
      .find(Boolean);

    if (appliedChild) return appliedChild;
  }

  return applied ? category : undefined;
};

export const getAppliedCategoryLabel = (categories) => {
  if (!Array.isArray(categories)) return '';

  const appliedCategory = categories
    .map(({ options }) => recursivelyFindAppliedCategory({ options }))
    .find(Boolean);

  return get(appliedCategory, 'label');
};
