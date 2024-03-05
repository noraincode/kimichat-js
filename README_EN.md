# kimichat-js

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
npm install kimichat-js

# Install using yarn:
yarn add kimichat-js

# Install using pnpm
pnpm i kimichat-js
```

## Usage

```typescript
import { KimiChat } from "kimichat-js";

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
```

For more methods, please refer to examples.

## Todos

[ ] Support stream requests for Chat Completion.

## References

[Kimi Chat Official API Documentation](https://platform.moonshot.cn/docs/api-reference#list-models)

[undici - An HTTP/1.1 client, written from scratch for Node.js](https://github.com/nodejs/undici)

## Disclaimer

This project is an unofficial version and is not produced by Kimi Chat official. When using this SDK, please comply with the relevant policies and terms of use of Kimi Chat. The developers are solely responsible for any problems and consequences that arise during the use of this project.

---

Contributions are welcome to improve kimichat-js!
