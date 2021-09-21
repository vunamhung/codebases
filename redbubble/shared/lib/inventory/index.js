import isEqual from 'lodash/isEqual';
import findKey from 'lodash/findKey';
import find from 'lodash/find';
import get from 'lodash/get';
import uniq from 'lodash/uniq';

const isCollection = collection => Array.isArray(collection) && collection.length;

const getConfig = (config, name) => find(config, { name });

export const excludeAttribute = (attributes, name) => {
  if (!(isCollection(attributes) && name)) {
    return false;
  }

  return attributes.filter(attr => attr.name !== name);
};

export const hasAttributeValue = (attributes, name, value) => {
  if (!(isCollection(attributes) && name)) {
    return false;
  }
  return find(attributes, { name, value }) !== undefined;
};

export const findByAttributes = (items, attributes) => {
  if (!(isCollection(items) && isCollection(attributes))) {
    return [];
  }
  return attributes
    .reduce((prev, { name, value }) => (
      prev.filter(item => hasAttributeValue(item.attributes, name, value))
    ), items);
};

export const findOneByAttributes = (items, attributes) => {
  const collection = findByAttributes(items, attributes);
  if (!isCollection(collection)) {
    return undefined;
  }
  return collection.find(Boolean);
};

export const getAttribute = (attributes = [], name, value) => {
  if (!(isCollection(attributes) && name)) {
    return undefined;
  }
  return value
    ? find(attributes, { name, value })
    : find(attributes, { name });
};

export const hasAttribute = (attributes, name) => getAttribute(attributes, name) !== undefined;

export const getAttributeValue = (attributes = [], name) => {
  const attribute = getAttribute(attributes, name);
  return attribute ? attribute.value : null;
};

export const setAttributeValue = (attributes, name, value) => {
  if (!hasAttribute(attributes, name)) {
    return [...attributes, { name, value }];
  }

  return attributes.map(
    attribute => (attribute.name === name ? { ...attribute, value } : attribute),
  );
};

export const filterAttributesByName = (attributes, name) => {
  if (!Array.isArray(attributes)) return [];
  return attributes.filter(({ name: n }) => name === n);
};

export const mergeAttributes = (set1 = [], set2 = []) => {
  const right = Array.isArray(set2) ? set2 : [];
  const left = Array.isArray(set1) ? set1 : [];
  if (left.length === 0) return right;

  return left.reduce((memo, attribute) => {
    const mergedAttribute = Object.assign(
      {},
      attribute,
      ...right.filter(a => a.name === attribute.name),
    );

    memo.push(mergedAttribute);
    return memo;
  }, []);
};

const canSortAttribute = (attributes) => {
  if (!isCollection(attributes)) return false;

  // Get all the display orders from `attributes`
  const displayOrders = attributes.map((attribute) => {
    return getAttributeValue(attribute.attributes, 'displayOrder');
  })
    .filter(displayOrder => displayOrder != null);

  // Return `true` if there are no missing or duplicate display orders
  return uniq(displayOrders).length === attributes.length;
};

export const sortAttributes = (attributes) => {
  return canSortAttribute(attributes)
    ? attributes.sort((left, right) => {
      const i = findKey(left.attributes, { name: 'displayOrder' });
      const j = findKey(right.attributes, { name: 'displayOrder' });

      return left.attributes[i].value - right.attributes[j].value;
    })
    : attributes;
};

const getConfigurationTypeAttributes = (items) => {
  const types = items.reduce((prev, { attributes }) => {
    return prev.concat(attributes.map(({ name }) => name));
  }, []);

  return uniq(types).map(value => ({ name: 'configuration', value }));
};

export const collectAttributes = (attributes, inventoryItems, attributeName, required) => {
  // Gets the attributes available in the product set for the option that the user has selected
  // e.g If user has selected a small red t-shirt and we only have yellow and blue
  // for small t-shirts
  // we wont show green xlarge shirts
  if (!Array.isArray(inventoryItems) || !attributeName) {
    return [];
  }

  const otherConfiguration = (Array.isArray(attributes) ? attributes : [])
    .filter(c => c.name !== 'configuration' && c.name !== attributeName);

  const matcher = (configSet, configurationToMatch) => {
    if (!Array.isArray(configSet)) return false;
    const newConfig = [...configSet].filter(c => c.name !== attributeName);
    return isEqual(configurationToMatch, newConfig);
  };

  const collection = inventoryItems.reduce((acc, item) => {
    if (required || matcher(item.attributes, otherConfiguration)) {
      const config = getConfig(item.attributes, attributeName);
      if (config) return acc.concat(config);
    }
    return acc;
  }, [])
    .reduce((acc, attribute) => {
      if (hasAttributeValue(acc, attribute.name, attribute.value)) return acc;
      return [...acc, attribute];
    }, []);

  return sortAttributes(collection);
};

export const extractConfigurationOptionsForTypes = (types, inventoryItemAttributes, allItems) => {
  if (!isCollection(types)) return [];

  const requireTypes = types
    .filter(t => t.name === 'configuration' && hasAttributeValue(t.attributes, 'required', true))
    .map(t => t.value);

  return types.reduce((memo, { value }) => {
    const required = requireTypes.indexOf(value) !== -1;
    return [...memo, ...collectAttributes(inventoryItemAttributes, allItems, value, required)];
  }, []);
};

export const associateCopyWithConfigAttrs = (setItems, ptcConfigurationSetEntries) => {
  if (!(isCollection(setItems) && isCollection(ptcConfigurationSetEntries))) {
    return setItems;
  }

  return sortAttributes(getConfigurationTypeAttributes(setItems).reduce((prev, attribute) => {
    const attributes = get(ptcConfigurationSetEntries.find(({ name, value }) => {
      return name === 'configuration' && value === attribute.value;
    }), 'attributes');

    if (!Array.isArray(attributes)) return prev;

    return [
      ...prev,
      {
        ...attribute,
        attributes,
      },
    ];
  }, []));
};

export const getAvailableAttributeOptions = (availableAttributes, configurationType) => {
  return filterAttributesByName(availableAttributes, configurationType)
    .map(({
      value: configurationOption,
      attributes: configurationOptionAttributes,
    }) => ({
      value: configurationOption,
      label: getAttributeValue(configurationOptionAttributes, 'defaultText') || '',
    }));
};

export const getAvailableColors = (inventoryItem, inventoryItems) => {
  if (!inventoryItem || !Array.isArray(inventoryItems)) {
    return [];
  }

  const productName = get(inventoryItem, 'description');
  const defaultBodyColor = getAttributeValue(inventoryItem.attributes, 'bodyColor');
  const attributes = collectAttributes(inventoryItem.attributes, inventoryItems, 'bodyColor');

  return attributes.reduce(
    (acc, cur) =>
      acc.concat({
        id: `color-${cur.value}`,
        label: `${cur.attributes.filter(attr => attr.name === 'defaultText')[0].value} ${productName}`,
        default: cur.value === defaultBodyColor,
        value: cur.value,
        hexColor: cur.attributes.filter(attr => attr.name === 'hexColor')[0].value,
        imageUrl: (cur.attributes.filter(attr => attr.name === 'imageUrl')[0] || {}).value,
      }),
    [],
  );
};

export const exists = inventoryItem => !!inventoryItem && !!inventoryItem.id;

export const inventoryItemIdParser = (inventoryItemId) => {
  const inventoryItemIdSegments = inventoryItemId.split('_');
  if (inventoryItemIdSegments.length > 3) {
    throw new Error(`Invalid inventory item id: ${inventoryItemId}`);
  }

  const [workId, productTypeId, blankItemId] = inventoryItemIdSegments;

  return {
    workId: parseInt(workId, 10),
    productTypeId,
    blankItemId,
  };
};

export const getAllAttributeValues = (attributes, name) => {
  return attributes
    .map(({ attributes: attr }) => {
      return getAttributeValue(attr, name);
    });
};
