# kimichat.js

[![CI](https://github.com/noraincode/kimichat-js/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/noraincode/kimichat-js/actions/workflows/ci.yml)

[English Version](./README_EN.md)

kimichat.js 是一个非官方的 Kimi Chat SDK，使用 TypeScript 和 undici 库开发

本项目旨在提供一个简单、高效的方式来接入和使用 [Kimi Chat](https://kimi.moonshot.cn/) 的官方 API

## Features

- 覆盖官方 API：实现了官方文档中定义的 99% API
- TypeScript 支持：利用 TypeScript 开发，为开发者提供静态类型检查和智能提示，提高开发效率和项目的可维护性
- 基于 [undici](https://github.com/nodejs/undici)

## 安装

```sh
# 使用 npm 安装：
npm install kimichat.js

# 使用 yarn 安装：
yarn add kimichat.js

# 使用 pnpm 安装
pnpm i kimichat.js
```

## 使用方法

> 请注意, 流式调用需要调用方传入自定义的回调方法, 用于处理数据流

```typescript
import { KimiChat } from "kimichat.js";
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

对于 stream 格式返回数据格式如下, 类型引用 `StreamChatCompletionData`

```json
data: {"id":"cmpl-1305b94c570f447fbde3180560736287","object":"chat.completion.chunk","created":1698999575,"model":"moonshot-v1-8k","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}

data: {"id":"cmpl-1305b94c570f447fbde3180560736287","object":"chat.completion.chunk","created":1698999575,"model":"moonshot-v1-8k","choices":[{"index":0,"delta":{"content":"你好"},"finish_reason":null}]}

...

data: {"id":"cmpl-1305b94c570f447fbde3180560736287","object":"chat.completion.chunk","created":1698999575,"model":"moonshot-v1-8k","choices":[{"index":0,"delta":{"content":"。"},"finish_reason":null}]}

data: {"id":"cmpl-1305b94c570f447fbde3180560736287","object":"chat.completion.chunk","created":1698999575,"model":"moonshot-v1-8k","choices":[{"index":0,"delta":{},"finish_reason":"stop","usage":{"prompt_tokens":19,"completion_tokens":13,"total_tokens":32}}]}

data: [DONE]
```

> 更多方法请参考 examples

## 引用

[Kimi Chat 官方 API 文档](https://platform.moonshot.cn/docs/api-reference#list-models)

[undici - An HTTP/1.1 client, written from scratch for Node.js](https://github.com/nodejs/undici)

## 免责声明

本项目为非官方版本，并非 Kimi Chat 官方出品。
使用本 SDK 时，请遵守 Kimi Chat 的相关政策和使用条款。开发者在使用过程中产生的任何问题和后果，本项目概不负责。

---

欢迎贡献代码，一起完善 kimichat.js！
