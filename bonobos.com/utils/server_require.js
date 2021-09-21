const COMMONS_JS_FILE = /^highline\/commonjs/i

// Prevent server-only libraries from being included
// in the webpack bundle. Only eval'd server-side.
//
// https://arunoda.me/blog/ssr-and-server-only-modules
export default function serverRequire(moduleName) {
  if (typeof window === "undefined" || process.env.APP_ENV === "test") {

    // Logic specific for files living under the commonjs directory. These
    // files don't get build and therefore the path needs to be explicit
    // to it's real location
    if (COMMONS_JS_FILE.test(moduleName)) {
      moduleName = process.cwd() + moduleName.replace("highline", "")
    }

    return eval(`require("${moduleName}")`)
  }
}
