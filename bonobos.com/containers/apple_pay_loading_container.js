import { connect } from "react-redux"
import ApplePayLoadingCurtain from "highline/components/application/apple_pay_loading_curtain"

const mapStateToProps = (state) => ({
  show: state.getIn(["applePayLoading", "show"]),  
})

const ApplePayLoadingContainer = connect(
  mapStateToProps,
)(ApplePayLoadingCurtain)

export default ApplePayLoadingContainer
