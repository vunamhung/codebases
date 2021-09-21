import React from "react"
import Head from "next/head"
import _static from "highline/lib/static"

const HomepageHead = () => {  
  const url = "https://bonobos.com"
  const logo = _static("logo_bonobos_v3.png")
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.bonobos.com/#website",
    "name": "Bonobos",
    url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${url}/search?term={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
  const logoData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.bonobos.com/#organization",
    "name": "Bonobos",
    url,
    logo,
    "sameAs": [
      "https://instagram.com/bonobos",
      "https://www.facebook.com/bonobos",
      "https://twitter.com/bonobos",
      "https://www.youtube.com/user/bonobos",
    ],
  }
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ { __html: JSON.stringify(data) } }
      ></script>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ { __html: JSON.stringify(logoData) } }
      ></script>
    </Head>
  )
}

export default HomepageHead
