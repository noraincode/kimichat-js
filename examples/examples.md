```typescript
import { KimiChat } from "../lib";

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
