import { ExpenseStoreModel } from "./ExpenseStore"

test("can be created", () => {
  const instance = ExpenseStoreModel.create({})

  expect(instance).toBeTruthy()
})
