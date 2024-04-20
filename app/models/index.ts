import { UseBoundStore, create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { MemberSlice, createMemberSlice } from "./member"
import { ExpenseSlice, createExpenseSlice } from "./expense"
import { SettingsSlice, createSettingsSlice } from "./settings"
import { immer } from "zustand/middleware/immer"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { pipe } from "app/utils/fns"

export const useExpenseStore = create<ExpenseSlice>()(
  persist(
    immer((...a) => ({
      ...createExpenseSlice(...a),
    })),
    {
      name: "root-store",
      storage: createJSONStorage(() => AsyncStorage, {
        reviver: (key, value) => {
          if (key === "amount") {
            return parseFloat(value as string)
          }

          if (key === "date" || key === "createdAt" || key === "updatedAt") {
            return new Date(value as string)
          }

          return value
        },
      }),
    },
  ),
)

export const useSettingsStore = create<SettingsSlice>()(
  persist(
    immer((...a) => createSettingsSlice(...a)),
    {
      name: "settings-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)

export const useMemberStore = create<MemberSlice>()(
  persist(
    immer((...a) => createMemberSlice(...a)),
    {
      name: "member-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)

export const useHydration = () => {
  const [expenseStoreHydrated, setExpenseStoreHydrated] = useState(false)
  const [settingsStoreHydrated, setSettingsStoreHydrated] = useState(false)
  const [memberStoreHydrated, setMemberStoreHydrated] = useState(false)

  useEffect(() => {
    function handleStoreHydration(
      useStore: UseBoundStore<any>,
      setStoreHydrated: React.Dispatch<React.SetStateAction<boolean>>,
    ) {
      const unsubHydrate = useStore.persist.onHydrate(() => setStoreHydrated(false))
      const unsubFinishHydration = useStore.persist.onFinishHydration(() => setStoreHydrated(true))
      setStoreHydrated(useStore.persist.hasHydrated())
      return [unsubHydrate, unsubFinishHydration]
    }

    const expenseUnsubscribers = handleStoreHydration(useExpenseStore, setExpenseStoreHydrated)
    const settingsUnsubscribers = handleStoreHydration(useSettingsStore, setSettingsStoreHydrated)
    const memberUnsubscribers = handleStoreHydration(useMemberStore, setMemberStoreHydrated)

    return () => {
      pipe(...expenseUnsubscribers)
      pipe(...settingsUnsubscribers)
      pipe(...memberUnsubscribers)
    }
  }, [])

  return expenseStoreHydrated && settingsStoreHydrated && memberStoreHydrated
}

export * from "./expense"
export * from "./member"
export * from "./icon"
