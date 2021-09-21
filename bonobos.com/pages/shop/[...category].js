import withApplicationLayout from "highline/layouts/with_application_layout"
import { isServer } from "highline/utils/client"
import CategoryContainer from "highline/containers/category_container"
import { categoryNavigationV2FetchAsync } from "highline/redux/actions/category_navigation_v2_actions"
import { categoryFetchAsync } from "highline/redux/actions/category_actions"
import { allSettled } from "highline/utils/browser"

const Category = () => (
  <CategoryContainer />
)

Category.getInitialProps = async ({ query, store, res }) => {
  const categorySlug = query.category.join("/")
  const path = `/shop/${ categorySlug }`

  const categoryRequest = store.dispatch(categoryFetchAsync(categorySlug, res, isServer))
  const navRequest = store.dispatch(categoryNavigationV2FetchAsync(path))

  const [categoryResponse] = await allSettled([categoryRequest, navRequest])

  const categoryResponseErrorStatus = categoryResponse.value && categoryResponse.value.error && categoryResponse.value.error.status
  if (categoryResponseErrorStatus && categoryResponseErrorStatus >= 400) {
    if (isServer) {
      res.statusCode = categoryResponseErrorStatus
    }
    return { errorStatusCode: categoryResponseErrorStatus }
  }

  return {
    canonicalPath: path,
    pageCategory: "Category",
    title: "Bonobos | Better-Fitting, Better-Looking Men's Clothing & Accessories | Bonobos",
  }
}

export default withApplicationLayout(Category)
