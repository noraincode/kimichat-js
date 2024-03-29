import { Dispatcher } from "undici"

export type Permission = {
  created: number
  id: string
  object: string
  allow_create_engine: boolean
  allow_sampling: boolean
  allow_logprobs: boolean
  allow_search_indices: boolean
  allow_view: boolean
  allow_fine_tuning: boolean
  organization: string
  group: string
  is_blocking: boolean
}

export type Model = "moonshot-v1-8k" | "moonshot-v1-32k" | "moonshot-v1-128k"

export type ModelResource = {
  created: number
  id: string
  object: string
  owned_by: string
  permission: Permission[]
  root: string
  parent: string
}

export type Message = {
  role: "system" | "user" | "assistant"
  content: string;
}

export type Choice = {
  index: number
  message: Message
  finish_reason: string
}

export type Usage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export type ChatCompletion = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage
}

export type Tokens = {
  code: number
  data: {
    total_tokens: number
  }
  scode: string
  status: boolean
}

export type KimiFile = {
  id: string
  object: string
  bytes: number
  created_at: number
  filename: string
  purpose: string
  status: string
  status_details: string
}

export type DeletedFile = {
  id: string
  deleted: boolean
  object: string
}

export type FileContent = {
  content: string
  file_type: string
  filename: string
  title: string
  type: string
}

export interface KimiResponse<T> {
  data: T
  error?: {
    message: string
    type: string
  }
}

export interface ErrorResponse {
  error: {
    message: string
    type: string
  }
}

export type StreamChoice = {
  index: number
  delta: {
    role?: string
    content?: string
  }
  finish_reason?: string
  usage?: Usage
}

export type StreamChatCompletionData = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: StreamChoice[];
}

export interface IKimiChat {
  chatCompletions: (data: {
    messages: Message[];
    model?: Model;
    maxTokens?: number;
    temperature?: number;
    topN?: number;
    n?: number;
  }) => Promise<KimiResponse<ChatCompletion>>;
  streamChatCompletions: (data: {
    messages: Message[];
    callback: Dispatcher.StreamFactory
    model?: Model;
    maxTokens?: number;
    temperature?: number;
    topN?: number;
    n?: number;
  }) => Promise<Dispatcher.StreamData>
  getModels: () => Promise<KimiResponse<ModelResource[]>>;
  getFileContent: (id: string) => Promise<KimiResponse<FileContent>>;
  deleteFile: (id: string) => Promise<KimiResponse<DeletedFile>>;
  getFile: (id: string) => Promise<KimiResponse<KimiFile>>
  uploadFile: (file: string) => Promise<KimiResponse<KimiFile>>
  estimateTokens: (data: {
    messages: Message[];
    model?: Model;
  }) => Promise<KimiResponse<Tokens[]>>
}
