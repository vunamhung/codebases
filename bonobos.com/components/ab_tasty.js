import getConfig from "highline/config/application"
const { abTastyKey } = getConfig()

const ABTasty = () =>
  <script
    type="text/javascript"
    src={ `https://try.abtasty.com/${abTastyKey}.js` }
  />

export default ABTasty
