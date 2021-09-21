import React from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import Head from "next/head"
import dynamic from "next/dynamic"

import Link from "highline/components/secure_link"
import HeaderV2Container from "highline/containers/header_v2_container"
import LeftDrawerContainer from "highline/containers/left_drawer_container"
import Footer from "highline/components/application/footer"

import styles from "highline/styles/components/error_page/custom_error.module.css"

const DynamicRightDrawerContainer = dynamic(() =>
  import("highline/containers/right_drawer_container"),
)

const CustomError = ({
  statusCode,
  pageCategory,
  title,
}) => (
  <div id="layout-wrapper" data-page-category={ pageCategory }>
    <Head>
      <title key="title">{ title }</title>
    </Head>

    <HeaderV2Container />

    <LeftDrawerContainer />

    <DynamicRightDrawerContainer />

    <div className={ classNames(
      "component",
      "error-component",
      styles.component,
      styles.center,
      styles.secondary,
    ) }>
      <section className={ styles.copy }>
        <h1 className={ styles.title }>
          { statusCode === 404 ? "Sorry, the page you were looking for could not be found." : null }
          { statusCode === 401 ? "Sorry, you are not authorized to access this resource" : null }
          { statusCode === 409 ? "Sorry, cart is currently being modified" : null }
          { ![401, 404, 409].includes(statusCode) ? "This page needs some tailoring..." : null }
        </h1>
        { statusCode >= 500 &&
          <h2 className={ styles.description }>
            We apologize but we’re experiencing an internal server problem. Please check back soon or contact us at
            <a
              aria-label="Open a new email to guides@bonobos.com"
              href="mailto:guides@bonobos.com"> guides@bonobos.com </a>
            for immediate assistance.
          </h2>

        }
        <div className={ styles.ctaContainer }>
          <Link
            href="/"
            key="Homepage"
          >
            <a
              aria-label="Navigate to Homepage"
              className={ styles.cta }
            >
              Return to the Homepage
            </a>
          </Link>
        </div>
      </section>
    </div>
    <Footer showEmailForm={ false } />
  </div>
)

CustomError.propTypes = {
  pageCategory: PropTypes.string,
  statusCode: PropTypes.number,
  title: PropTypes.string,
}

export default connect(
  () => ({}),
  (dispatch) => ({ dispatch }),
)(CustomError)
