import { TOKEN_IMAGE_URL_OVERRRIDES } from 'config/constants/tokens'

const getTokenLogoURL = (address: string) => {
  return TOKEN_IMAGE_URL_OVERRRIDES.map((x) => x.toLowerCase()).includes(address.toLowerCase())
    ? `/tokens/${address}.png`
    : `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`
}

export default getTokenLogoURL
