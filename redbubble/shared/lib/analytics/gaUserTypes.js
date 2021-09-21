const MEMBER = 'Member';
const VISITOR = 'Visitor';
const NEW_VISITOR = 'New Visitor';

// eslint-disable-next-line dot-notation
const isVisitor = cookies => (!!cookies['_ga']);
const isMember = userInfo => (userInfo.isLoggedIn);

const getVisitorType = (cookies, userInfo) => {
  if (isMember(userInfo)) {
    return MEMBER;
  } else if (isVisitor(cookies)) {
    return VISITOR;
  }
  return NEW_VISITOR;
};

const GaUserTypes = {
  getVisitorType,
  Member: MEMBER,
  Visitor: VISITOR,
  NewVisitor: NEW_VISITOR,
};

export default GaUserTypes;
