import { WalkthroughModel } from "./Walkthrough"

test("can be created", () => {
  const instance = WalkthroughModel.create({})

  expect(instance).toBeTruthy()
})
