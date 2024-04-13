import { StateCreator } from "zustand"

export interface Member {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface MemberSlice {
  self: string
  all: Record<string, Member>
}

export const createMemberSlice: StateCreator<MemberSlice, [], [], MemberSlice> = (set) => ({
  self: "1",
  all: {
    "1": {
      id: "1",
      name: "Ramesh",
      email: "rrameshbtech@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
})

export const getSelf = (state: MemberSlice) => state.all[state.self]
