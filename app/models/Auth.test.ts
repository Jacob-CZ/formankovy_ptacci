import { AuthModel } from "./Auth"

test("can be created", () => {
  const instance = AuthModel.create({})

  expect(instance).toBeTruthy()
})
