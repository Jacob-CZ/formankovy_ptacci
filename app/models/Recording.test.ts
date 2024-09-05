import { RecordingModel } from "./Recording"

test("can be created", () => {
  const instance = RecordingModel.create({})

  expect(instance).toBeTruthy()
})
