import { setSodCookie } from "highline/utils/sod_helper"

const addSodCookie = async (onSuccess) => {
  setSodCookie()
  await onSuccess()
}

export default addSodCookie
