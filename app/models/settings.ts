import { StateCreator } from "zustand"

export interface SettingsSlice {
  isInitialSetupComplete: boolean
}

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
  isInitialSetupComplete: false,
})
