import Head from "next/head"
import "../styles/common.css"

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta content="width=device-width initial-scale=1" name="viewport" />
      </Head>
      <Component { ...pageProps } />
    </>
  )
}