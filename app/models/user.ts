import { StateCreator } from "zustand"

export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface UserSlice {
  currentUser: User
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set) => ({
  currentUser: {
    id: "1",
    name: "Ramesh",
    email: "rrameshbtech@gmail.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
})