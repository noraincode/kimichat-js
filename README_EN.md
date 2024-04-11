# kimichat.js

[![CI](https://github.com/noraincode/kimichat-js/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/noraincode/kimichat-js/actions/workflows/ci.yml)

[中文文档]('./README.md')

kimichat-js is an unofficial Kimi Chat SDK developed using TypeScript and the undici library.

This project aims to provide a simple and efficient way to integrate and use the official API of [Kimi Chat](https://kimi.moonshot.cn/).

## Features

- Covers Official API: Implements 99% of the APIs defined in the official documentation.
- TypeScript Support: Developed using TypeScript, offering developers static type checking and intelligent hints to improve development efficiency and maintainability of the project.
- Based on [undici](https://github.com/nodejs/undici).

## Installation

```sh
# Install using npm:
npm install kimichat.js

# Install using yarn:
yarn add kimichat.js

# Install using pnpm
pnpm i kimichat.js
```

## Usage

> Please note that streaming calls require the caller to pass in a custom callback method for processing the data stream.

```typescript
import { KimiChat } from "kimichat.js";

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

// Stream Chat Completion example
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
        // Handling error
      })
      .on("data", (buf: Buffer) => {
        // Handling buf data
        bufs.push(buf);
      })
      .on("end", () => {
        // Handle buf data on end
        Buffer.concat(bufs).toString("utf8");
      });

    return pt;
  },
});
```

For stream format, the returned data format is as follows, the type reference is `StreamChatCompletionData`

```json
data: {"id":"cmpl-1305b94c570f447fbde3180560736287","object":"chat.completion.chunk","created":1698999575,"model":"moonshot-v1-8k","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}

data: {"id":"cmpl-1305b94c570f447fbde3180560736287","object":"chat.completion.chunk","created":1698999575,"model":"moonshot-v1-8k","choices":[{"index":0,"delta":{"content":"你好"},"finish_reason":null}]}

...

data: {"id":"cmpl-1305b94c570f447fbde3180560736287","object":"chat.completion.chunk","created":1698999575,"model":"moonshot-v1-8k","choices":[{"index":0,"delta":{"content":"。"},"finish_reason":null}]}

data: {"id":"cmpl-1305b94c570f447fbde3180560736287","object":"chat.completion.chunk","created":1698999575,"model":"moonshot-v1-8k","choices":[{"index":0,"delta":{},"finish_reason":"stop","usage":{"prompt_tokens":19,"completion_tokens":13,"total_tokens":32}}]}

data: [DONE]
```

For more methods, please refer to examples.

## References

[Kimi Chat Official API Documentation](https://platform.moonshot.cn/docs/api-reference#list-models)

[undici - An HTTP/1.1 client, written from scratch for Node.js](https://github.com/nodejs/undici)

## Disclaimer

This project is an unofficial version and is not produced by Kimi Chat official. When using this SDK, please comply with the relevant policies and terms of use of Kimi Chat. The developers are solely responsible for any problems and consequences that arise during the use of this project.

---

Contributions are welcome to improve kimichat.js!
