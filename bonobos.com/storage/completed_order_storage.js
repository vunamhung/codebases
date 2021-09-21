import Lockr from "lockr"

const STORAGE_KEY = "completedOrder"

export const save = (order) => {
  Lockr.set(STORAGE_KEY, order)
}

export const remove = () => {
  Lockr.rm(STORAGE_KEY)
}