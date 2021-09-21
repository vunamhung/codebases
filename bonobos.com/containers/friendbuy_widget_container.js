import { connect } from "react-redux"
import FriendBuyWidget from "highline/components/friendbuy_widget/friendbuy_widget"
import { invalidateModalAsync } from "highline/redux/actions/new_customer_modal_actions"

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => {
  return {
    onMount: () => {
      dispatch(invalidateModalAsync())
    },
  }
}

const FriendBuyWidgetContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FriendBuyWidget)

export default FriendBuyWidgetContainer
