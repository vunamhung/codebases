import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import Head from "next/head"

const defaultDescription = "Free shipping and returns. Bonobos, home of better-fitting menswear and an easier shopping experience."

const CategoryHead = ({
  breadcrumbs,
  metaCanonicalPath,
  metaDescription,
  metaTitle,
  name,
}) => {
  const title = metaTitle || name
  const description = metaDescription || defaultDescription

  const breadcrumbData = {
    "@context": "http://schema.org",
    "@type": "BreadcrumbList",
    itemListElement:
      breadcrumbs.map((category, index) => ({
        "@type": "ListItem",
        item: `https://bonobos.com${category.get("as")}`,
        name: category.get("name"),
        position: index + 1,
      })),
  }

  return (
    <Head>
      <title key="title">{ `${title} | Bonobos` }</title>
      { metaCanonicalPath &&
        <link key="canonical" href={ `https://bonobos.com${metaCanonicalPath}` } rel="canonical" />
      }
      <meta key="meta-description" property="og:description" name="description" content={ description } />
      <script type="application/ld+json" dangerouslySetInnerHTML={ { __html: JSON.stringify(breadcrumbData) } } />
    </Head>
  )
}

CategoryHead.propTypes = {
  breadcrumbs: ImmutablePropTypes.list,
  metaCanonicalPath: PropTypes.string,
  metaDescription: PropTypes.string,
  metaTitle: PropTypes.string,
  name: PropTypes.string,
}

export default CategoryHead
