import dotenv from "dotenv"
dotenv.config()

import fs from "fs"
import { KimiChat } from "..";

const clearFiles = async () => {
  // @ts-ignore
  const kimi = new KimiChat(process.env.MOONSHOT_API_KEY)
  const models = await kimi.getFiles()
  models.data.forEach(async m => {
    await kimi.deleteFile(m.id)
  });
}

describe('Test KimiChat SDK', () => {
  let kimi: KimiChat
  let fileId: string
  let tmpDir: string
  let tepFileName: string
  
  beforeAll(() => {
    tmpDir = fs.mkdtempSync("/tmp/kimichat")
    tepFileName = `${tmpDir}/temp.md`
    fs.writeFileSync(tepFileName, "Hello kimi")
  })

  afterAll(() => {
    fs.unlinkSync(tepFileName)
    fs.rmdirSync(tmpDir)
    clearFiles()
  })

  beforeEach(() => {
    jest.setTimeout(1000)
  })

  test("Constructor", () => {
    // @ts-ignore
    kimi = new KimiChat(process.env.MOONSHOT_API_KEY)

    expect(kimi).toBeInstanceOf(KimiChat)
  })

  test("getModels", async () => {
    const models = await kimi.getModels()

    const availableModels = [
      "moonshot-v1-32k",
      "moonshot-v1-128k",
      "moonshot-v1-8k",
    ]

    expect(models.data.length).toBe(3)
    models.data.map((m) => expect(availableModels.includes(m.id)).toBeTruthy())
  })

  test("chatCompletions", async () => {
    const res = await kimi.chatCompletions({
      messages:[{
        role: "user",
        content: "hello"
      }]
    })

    expect(res.data).toMatchObject({
      id: expect.any(String),
      object: "chat.completion",
      created: expect.any(Number),
    })
  })

  test("estimateTokens", async () => {
    const res = await kimi.estimateTokens({
      messages: [{
        role: "user",
        content: "hello"
      }], 
      model: "moonshot-v1-8k"
    })

    expect(res.data).toMatchObject({
      total_tokens: expect.any(Number),
    })
  })

  test("uploadFile", async () => {
    const res = await kimi.uploadFile(tepFileName, () => ({}))
    fileId = res.data.id

    expect(res.data.filename).toBe("temp.md")
  })

  test("getFile", async () => {
    const res = await kimi.getFile(fileId)

    expect(res.data.filename).toBe("temp.md")
  })

  test("getFiles", async () => {
    const res = await kimi.getFiles()

    expect(res.data.length).toBe(1)
    expect(res.data[0].filename).toBe("temp.md")
  })
  
  test("getFileContent", async () => {
    const res = await kimi.getFileContent(fileId)

    expect(res.data.content).toBe("Hello kimi")
  })

  test("deleteFile", async () => {
    const res = await kimi.deleteFile(fileId)

    expect(res.data.id).toBe(fileId)
  })

  test("invalid token", async () => {
    kimi = new KimiChat("invalid token")

    const res = await kimi.getModels()

    expect(res.error!.message).toBe("auth failed")
  })
});
