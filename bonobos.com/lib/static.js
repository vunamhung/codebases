import Rollbar from "highline/utils/rollbar"
import manifest from "highline/static_manifest.json"
import getConfig from "highline/config/application"

export default (filename)  => {
  const { assetPrefix, isProductionLike } = getConfig()

  if (!isProductionLike) {
    // Next.js version 8 deprecated the use of `next/asset`
    // https://github.com/zeit/next.js/issues/5970
    if (/^https?:\/\//.test(filename)) {
      return filename
    } else {
      const pathWithoutSlash = filename.replace(/^\//, "")
      return `${assetPrefix || ""}/static/${pathWithoutSlash}`
    }
  }

  const hashedFile = manifest[filename]

  if (!hashedFile) {
    return filename
  }

  return `${assetPrefix || ""}${hashedFile}`
}
