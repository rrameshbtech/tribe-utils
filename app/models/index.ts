import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { MemberSlice, createMemberSlice } from "./member"
import { ExpenseSlice, createExpenseSlice } from "./expense"
import { SettingsSlice, createSettingsSlice } from "./settings"
import { immer } from "zustand/middleware/immer"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const useRootStore = create<MemberSlice & ExpenseSlice & SettingsSlice>()(
  persist(
    immer((...a) => ({
      ...createMemberSlice(...a),
      ...createExpenseSlice(...a),
      ...createSettingsSlice(...a),
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

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Note: This is just in case you want to take into account manual rehydration.
    // You can remove the following line if you don't need it.
    const unsubHydrate = useRootStore.persist.onHydrate(() => setHydrated(false))

    const unsubFinishHydration = useRootStore.persist.onFinishHydration(() => setHydrated(true))

    setHydrated(useRootStore.persist.hasHydrated())

    return () => {
      unsubHydrate()
      unsubFinishHydration()
    }
  }, [])

  return hydrated
}

export * from "./expense"
export * from "./member"
export * from "./icon"
