import { ExpenseModel } from "./Expense"

test("can be created", () => {
  const instance = ExpenseModel.create({})

  expect(instance).toBeTruthy()
})
