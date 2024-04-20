import { StateCreator } from "zustand"

export interface SettingsSlice {
  isInitialSetupComplete: boolean
  setIsInitialSetupComplete: (value: boolean) => void
}

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
  isInitialSetupComplete: false,
  setIsInitialSetupComplete: (value) => set({ isInitialSetupComplete: value }),
})
