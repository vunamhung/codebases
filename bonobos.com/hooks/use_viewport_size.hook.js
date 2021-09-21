import { useState, useEffect } from "react"
import { detectSmartphoneWidth, detectTabletWidth } from "highline/utils/viewport"
import debounce from "debounce"

const RESIZE_DEBOUNCE_TIMEOUT = 200

export const useViewportSize = () => {
  const [isSmartphone, setIsSmartphone] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  const handleResize = () =>{
    debounce(() => {
      setIsSmartphone(detectSmartphoneWidth())
      setIsTablet(detectTabletWidth())
    }, RESIZE_DEBOUNCE_TIMEOUT)()
  }

  useEffect(() => {
    setIsSmartphone(detectSmartphoneWidth())
    setIsTablet(detectTabletWidth())
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return {
    isSmartphone,
    isTablet,
  }
}
