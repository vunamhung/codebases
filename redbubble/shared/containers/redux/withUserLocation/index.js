import { connect } from 'react-redux';

export default connect(state => ({ userLocation: state.userLocation }));
