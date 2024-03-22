```typescript
import { KimiChat } from "../lib";
import { PassThrough } from "stream";

const kimi = new KimiChat("Your API Key");

// Chat Completion
const { data: messages } = await kimi.chatCompletions({
  messages: [
    {
      role: "user",
      content: "Hello, how are you?",
    },
  ],
});

// Stream Chat Completion
kimi.streamChatCompletions({
  messages: [
    {
      role: "user",
      content: "hello",
    },
  ],
  callback: () => {
    const bufs = [] as Buffer[];
    const pt = new PassThrough()
      .on("error", (err: any) => {
        // @ts-ignore
      })
      .on("data", (buf: Buffer) => {
        console.log(buf.toString());
        // data: {"id":"cmpl-1305b94c570f447fbde3180560736287","object":"chat.completion.chunk","created":1698999575,"model":"moonshot-v1-8k","choices":[{"index":0,"delta":{"content":"你好"},"finish_reason":null}]}

        bufs.push(buf);
      })
      .on("end", () => {
        console.log(Buffer.concat(bufs).toString("utf8")).toBeTruthy();
      });

    return pt;
  },
});

// Estimate Token
const { data: tokenCounts } = await kimi.estimateTokens({
  messages: [
    {
      role: "user",
      content: "Hello, how are you?",
    },
  ],
});

// List Models
const { data: models } = await kimi.getModels();

// Upload file
const { data: file } = await kimi.uploadFile(
  "pathToYourFile",
  (args: { loaded: number; total: number }) => {
    // Optional callback
    console.log(args.loaded, args.total);
  }
);

// Get uploaded files
const { data: files } = await kimi.getFiles();

// Get file content
const { data: fileContent } = await kimi.getFileContent(file.id);

// Get File
const { data: fileDetail } = await kimi.getFile(file.id);

// Delete file
const { data: deletedFile } = await kimi.deleteFile(file.id);
```
