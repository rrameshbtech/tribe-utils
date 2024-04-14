import { getSelf, useRootStore } from "app/models"

export function useIsSignedIn() {
  const self = useRootStore(getSelf)
  return self && self.id !== ""
}

export function useIsSignedOut() {
  const self = useRootStore(getSelf)
  return !self
}
