import React, { useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { compose } from 'redux';
import Box from '@redbubble/design-system/react/Box';
import Button from '@redbubble/design-system/react/Button';
import * as constants from '@redbubble/design-system/react/constants';
import Form, { FieldSet, FieldRow, Field, FieldMessage } from '@redbubble/design-system/react/Form';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { analyticsPayload } from '../../lib/analytics';
import withUserInfo from '../../containers/apollo/withUserInfo';
import withListEntityInclusions from '../../containers/apollo/withListEntityInclusions';
import withCreateList from '../../containers/apollo/withCreateList';
import withToggleList from '../../containers/apollo/withToggleList';
import { itemShape } from './';
import messages from './messages';
import { validateListName } from './validators';
import { useAnalyticsActions } from '../../containers/redux/withAnalytics';

export const CreateListFormComponent = ({
  closeForm,
  createList,
  addItemToList,
  profile,
  item,
  intl,
  userInfo,
  listEntityInclusions,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { logEvent } = useAnalyticsActions();

  const submitForm = async ({ name }, { resetForm }) => {
    setIsLoading(true);

    const locale = get(userInfo, 'locale');
    const createResponse = await createList({ name, privacy: 'PUBLIC' });
    const { entityId, entityType } = item;
    const input = {
      item: { entityId, entityType },
      listId: createResponse.data.createList.list.listId,
      locale,
    };
    await addItemToList(input, listEntityInclusions);

    logEvent({
      analytics: analyticsPayload.createList(name),
      dataLayer: { event: 'createList', name, item },
    });

    setIsLoading(false);
    resetForm();
    closeForm();
  };

  return (
    <Form
      initialValues={{ name: '' }}
      onSubmit={submitForm}
      profile={profile}
    >
      {
        (formProps) => {
          const errors = get(formProps, 'errors') || {};
          const touched = get(formProps, 'touched') || {};

          return (
            <React.Fragment>
              <FieldSet>
                <FieldRow>
                  <Field
                    label={intl.formatMessage(messages.name)}
                    type="text"
                    name="name"
                    placeholder={intl.formatMessage(messages.placeholder)}
                    fluid
                    intent={touched.name && errors.name && constants.ERROR}
                    validate={name => validateListName(name, intl)}
                  >
                    {
                      () => (
                        errors.name &&
                          <FieldMessage intent={constants.ERROR}>{errors.name}</FieldMessage>
                      )
                    }
                  </Field>
                </FieldRow>
              </FieldSet>

              <Box paddingLeft="xs" display="block">
                <Button
                  data-testid="submitButton"
                  type="submit"
                  size={constants.MEDIUM}
                  intent={constants.PRIMARY}
                  strong
                  loading={isLoading}
                >
                  <FormattedMessage defaultMessage="Create" />
                </Button>
              </Box>
            </React.Fragment>
          );
        }
      }
    </Form>
  );
};

CreateListFormComponent.propTypes = {
  closeForm: PropTypes.func,
  createList: PropTypes.func,
  addItemToList: PropTypes.func,
  profile: PropTypes.string,
  item: itemShape,
  userInfo: PropTypes.shape({
    locale: PropTypes.string,
  }),
  intl: intlShape.isRequired,
  listEntityInclusions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    listId: PropTypes.string.isRequired,
  })),
};

CreateListFormComponent.defaultProps = {
  closeForm: null,
  createList: null,
  addItemToList: null,
  profile: constants.DESKTOP,
  item: null,
  userInfo: null,
  listEntityInclusions: null,
};

export default compose(
  injectIntl,
  withUserInfo,
  withCreateList,
  withToggleList,
  withListEntityInclusions,
)(CreateListFormComponent);
