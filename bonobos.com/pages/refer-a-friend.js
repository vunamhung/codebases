import React from "react"
import withApplicationLayout from "highline/layouts/with_application_layout"
import getConfig from "highline/config/application"
import FriendBuyWidgetContainer from "highline/containers/friendbuy_widget_container"

const widgetId = getConfig().friendbuyReferralWidgetId

const ReferAFriend = () => (
  <FriendBuyWidgetContainer widgetId={ widgetId } />
)

ReferAFriend.getInitialProps = async () => {
  return {
    canonicalPath: "/refer-a-friend",
    metaDescription: "If you refer a friend to sign up for Bonobos, you will get 25% and your friend will also get 25% off their first purchase! Refer today and save.",
    pageCategory: "Refer-a-Friend",
    title: "Refer a Friend & Save 25% | Bonobos",
  }
}

export default withApplicationLayout(ReferAFriend)
