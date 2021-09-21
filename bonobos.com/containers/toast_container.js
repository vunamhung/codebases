import { connect } from "react-redux"
import { dismissToast, toastHasDismissed } from "highline/redux/actions/toast_actions"
import toast from "highline/components/application/toast"

const mapStateToProps = (state) => {
  return {
    isHeaderMinified: state.getIn(["header", "isMinified"]),
    showToast: state.getIn(["toast", "showToast"]),
    toast: state.getIn(["toast", "toasts"]).first(),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    beginToastCountdown: () => {
      setTimeout(() => {
        dispatch(dismissToast())
        setTimeout(() => {
          dispatch(toastHasDismissed())
        }, 300) // .3 second wait before starting the next toast
      }, 2500) // 2.5 second timer until toast animates out,
    },
  }
}

const ToastContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(toast)

export default ToastContainer
