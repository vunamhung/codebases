import { connect } from 'react-redux';
import {
  accumulateImpression,
  sendImpressions,
} from '../../../redux/ducks/search';

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  accumulateImpression,
  sendImpressions,
};

const withSearchImpressions = connect(mapStateToProps, mapDispatchToProps);

export default withSearchImpressions;
