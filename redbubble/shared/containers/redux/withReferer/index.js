import { connect } from 'react-redux';

const withReferer = connect(s => ({ referer: s.referer.referer }));

export default withReferer;
