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
  allMembers: Record<string, Member>

  updateSelf: (self: string) => void
  upsertMember: (member: Member) => void
}

export const createMemberSlice: StateCreator<MemberSlice, [], [], MemberSlice> = (set) => ({
  self: "",
  allMembers: {},
  updateSelf: (self: string) => set({ self }),
  upsertMember: (member: Member) =>
    set((state) => ({ allMembers: { ...state.allMembers, [member.id]: member } })),
})

export const getSelf = (state: MemberSlice) => state.allMembers[state.self]
