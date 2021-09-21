import { defineMessages } from 'react-intl';

const messages = defineMessages({
  placeholder: 'e.g. Gifts for Mom',
  name: 'Name',
  editList: 'Edit list',
  saveList: 'Save',
  renameList: 'Rename list',
  deleteList: 'Delete list',
  deleteListPrompt: 'Are you sure you want to delete this list?',
  cancel: 'Cancel',
  listNameRequired: 'Please fill in this field.',
  listNameTooShort: 'Too short. Must be at least 3 characters long.',
  listNameTooLong: 'Too long. Must be less than 50 characters long.',
});

export default messages;
