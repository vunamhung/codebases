import { connect } from "react-redux"
import { checkBrowserCompatibility, compatibilityModalCloseClicked } from "highline/redux/actions/browser_actions"
import BrowserCompatibilityModal from "highline/components/application/browser_compatibility_modal"

const mapStateToProps = (state) => ({
  browserUpgradeUrl: state.getIn(["browser", "browserUpgradeUrl"]),
  showCompatibilityModal: state.getIn(["browser", "showCompatibilityModal"]),
})

const mapDispatchToProps = (dispatch) => {
  return {
    onHandleClose: () => {
      dispatch(compatibilityModalCloseClicked())
    },
    onMount: () => {
      dispatch(checkBrowserCompatibility())
    },
  }
}

const BrowserCompatibilityModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BrowserCompatibilityModal)

export default BrowserCompatibilityModalContainer
