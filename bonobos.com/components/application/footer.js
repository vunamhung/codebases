import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { fromJS } from "immutable"
import classNames from "classnames"
import Link from "highline/components/secure_link"
import EmailForm from "highline/components/application/email_form"
import Imgix from "highline/components/imgix"
import LinkIcon from "highline/components/link_icon"
import getConfig from "highline/config/application"
import LazyLoad from "highline/components/lazy_load"
import { SocialIcons } from "highline/components/icons"
import SupportID from "highline/components/application/support_id"
import { useSelector, useDispatch } from "react-redux"
import * as TermsAndPrivacyApi from "highline/api/terms_and_privacy_api"
import * as UserLeadApi from "highline/api/user_lead_api"
import * as CCPAApi from "highline/api/ccpa_api"
import { emailCaptured } from "highline/redux/actions/email_list_actions"
import Rollbar, { formatHttpError } from "highline/utils/rollbar"
import { footerLinkClicked, submitCCPARequestFailed } from "highline/redux/actions/footer_actions"

import styles from "highline/styles/components/application/footer.module.css"

const { brandCode, ccpaUrlAffirmation, showCCPALinks } = getConfig()

const socialLinks = fromJS([
  {
    icon: SocialIcons.Instagram,
    name: "Instagram",
    url: "https://instagram.com/bonobos",
  },
  {
    icon: SocialIcons.Facebook,
    name: "Facebook",
    url: "https://www.facebook.com/bonobos",
  },
  {
    icon: SocialIcons.Twitter,
    name: "Twitter",
    url: "https://twitter.com/bonobos",
  },
  {
    icon: SocialIcons.Youtube,
    name: "Youtube",
    url: "https://www.youtube.com/user/bonobos",
  },
])

const links = fromJS([
  [
    {
      name: "Help",
      url: "/help",
    },
    {
      name: "Returns",
      url: "/returns",
    },
    {
      name: "Guideshop Locations",
      url: "/guideshop",
    },
    {
      name: "Wholesale",
      url: "/wholesale",
    },
    {
      name: "Bonobos App",
      url: "/app",
    },
    {
      name: "Jobs",
      url: "/jobs",
    },
    {
      name: "Email Us",
      url: "/contact-us",
    },
    {
      name: "Gift Cards",
      url: "/gift-cards",
    },
  ],
  [
    {
      name: "About Us",
      url: "/about",
    },
    {
      name: "Get 25% Off",
      url: "/refer-a-friend",
    },
    {
      isExternal: true,
      name: "Teachers",
      openInNewTab: true,
      url: "https://bonobos-teachers.sheerid.com/",
    },
    {
      isExternal: true,
      name: "Military",
      openInNewTab: true,
      url: "https://bonobos-military.sheerid.com/",
    },
    {
      name: "About Our Ads",
      url: "/privacy#third-party-advertisements",
    },
    {
      name: "Privacy Policy",
      url: "/privacy",
    },
    {
      name: "Terms",
      url: "/terms",
    },
    {
      name: "Site Map",
      url: "/sitemap",
    },
    {
      name: "Accessibility",
      url: "/accessibility",
    },
    {
      name: "Give Us Feedback",
      url: "/feedback",
    },
  ],
])

const ccpaLinks = (encryptedParam) => fromJS([
  {
    isExternal: true,
    name: "Request my Personal Information",
    openInNewTab: false,
    url: `${ccpaUrlAffirmation}?brandCode=${brandCode}&requestType=ACCESS&params=${encryptedParam}`,
  },
  {
    isExternal: true,
    name: "Do not sell my personal information",
    openInNewTab: false,
    url: `${ccpaUrlAffirmation}?brandCode=${brandCode}&requestType=OPTOUT&params=${encryptedParam}`,
  },
])

const Footer = ({ showEmailForm }) => {
  const dispatch = useDispatch()

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState({})
  const [encryptedParam, setEncryptedParam] = useState("")

  const currentPath = useSelector((state) => state.getIn(["currentPage", "path"]))
  const userEmail = useSelector((state) => state.getIn(["auth", "email"]))
  const number = useSelector((state) => state.getIn(["cart", "number"]))
  const isLoggedIn = useSelector((state) => state.getIn(["auth", "isLoggedIn"]))

  const onEmailSubmit = async () => {
    const LEAD_SOURCE = "signup_footer"

    setIsLoading(true)

    try {
      await TermsAndPrivacyApi.accept(email)
      await UserLeadApi.save(email, LEAD_SOURCE)

      dispatch(emailCaptured("Footer", email, LEAD_SOURCE))
      setIsLoading(false)
      setSubscribed(true)
      setError({})

    } catch (error) {
      setIsLoading(false)
      setError({
        email: error.data.getIn(["errors", "userLead", 0], "Something went wrong"),
      })
    }
  }

  useEffect(() => {
    if (showCCPALinks) {
      const onFooterMount = async () => {
        const timestamp = (new Date).getTime().toString()

        try {
          const response = await CCPAApi.encrypt(userEmail, timestamp)

          setEncryptedParam(response.data.encryptedValue)

        } catch (error) {
          if (currentPath === "/ccpa-optout") {
            dispatch(submitCCPARequestFailed(error))
          }
          Rollbar.error("CCPA Request Failed", formatHttpError(new Error("footer encryption failed")))
        }
      }

      onFooterMount()
    }
  }, [isLoggedIn])

  let allLinks
  //This allows us to remove the ccpa links from the list if they are hidden.
  //updateIn is an immutable method, similar to setIn, except that it allows you to pass a cb which will be called with the value of the pointer
  if (!showCCPALinks) {
    allLinks = links
  } else {
    allLinks = links.updateIn([0], (subList) => {
      return subList.concat(ccpaLinks(encryptedParam))
    })
  }

  return <div
    className={ classNames(
      "component",
      "footer-component",
      styles.component,
    ) }
    id="footer"
  >
    <div className={ styles.footerContents }>
      <div className={ styles.social }>
        { showEmailForm &&
        <div className={ styles.email }>
          <EmailForm
            description="Want exclusive offers and first access to products? Sign up for email alerts."
            disabled={ isLoading }
            email={ email }
            errorMessage={ error.email }
            layout="light"
            onChange={ (e) => setEmail(e.target.value) }
            onSubmit={ onEmailSubmit }
            placeholder="Your email address"
            placement="footer"
            subscribed={ subscribed }
            title="15% Off Your First Order"
          />
        </div>
        }
        <div className={ styles.blog }>
          <div className={ styles.blogContent }>
            <div className={ styles.blogTitle }>Guidebook</div>
            <div className={ styles.blogDescription }>The stories behind our clothes, the people who wear them, and everything else you need to know.</div>
            <a
              aria-label="Navigate to Guidebook"
              className={ styles.blogLink }
              href="https://blog.bonobos.com"
              onClick={ () => dispatch(footerLinkClicked("https://guidebook.bonobos.com", "Guidebook")) }
              rel="noopener noreferrer"
              target="_blank"
            >
              Read the latest post
            </a>
          </div>
        </div>
        <div className={ styles.socialIcons }>
          { socialLinks.map((socialLink) => (
            <LinkIcon
              aria-label={ `Navigate to ${socialLink.get("url")}` }
              className={ styles.socialIcon }
              key={ socialLink.get("name") }
              svg={ socialLink.get("icon")() /* invoke function to get element babel-plugin-inline-react */ }
              href={ socialLink.get("url") }
              onClick={ () => dispatch(footerLinkClicked(socialLink.get("url"), socialLink.get("name"))) }
              rel="noopener"
              target="_blank"
            />
          )) }
        </div>
      </div>
      <div className={ styles.links }>
        { allLinks.map((linkRow, index) => (
          <div
            className={ styles.linkRow }
            key={ index }
          >
            { linkRow.map((link) => {
              const anchor = (
                <a
                  aria-label={ `Navigate to ${link.get("name")}` }
                  className={ styles.link }
                  href={ link.get("url") }
                  key={ link.get("isExternal") ? link.get("name") : undefined }
                  onClick={ () => dispatch(footerLinkClicked(link.get("url"), link.get("name"))) }
                  target={ link.get("openInNewTab") ? "_blank" : "_self" }
                  rel={ link.get("isExternal") ? "noopener noreferrer" : undefined }
                >
                  { link.get("name") }
                </a>
              )

              if (link.get("isExternal")) return anchor

              return (
                <Link
                  href={ link.get("url") }
                  key={ link.get("name") }
                >
                  { anchor }
                </Link>
              )
            }) }
          </div>
        )) }
      </div>
    </div>
    <div className={ styles.copyright }>
      <p>&copy;{new Date().getFullYear()} Bonobos, Inc. All Rights Reserved</p>
      { showEmailForm && <SupportID number={ number } />}
    </div>
  </div>
}

Footer.propTypes = {
  showEmailForm: PropTypes.bool,
}

Footer.defaultProps = {
  showEmailForm: true,
}

export default Footer
