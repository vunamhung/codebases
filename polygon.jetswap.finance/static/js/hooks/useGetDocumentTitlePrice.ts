import { useEffect } from 'react'
import { usePriceWingsUsd } from 'state/hooks'

const useGetDocumentTitlePrice = () => {
  const wingsPriceUsd = usePriceWingsUsd()
  useEffect(() => {
    document.title = 'JetSwap'
    // document.title = `JetSwap - $${Number(cakePriceUsd).toLocaleString(undefined, {
    //   minimumFractionDigits: 3,
    //   maximumFractionDigits: 3,
    // })}`
  })
}
export default useGetDocumentTitlePrice
