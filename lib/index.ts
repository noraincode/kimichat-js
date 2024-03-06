import { Dispatcher, request } from 'undici';
import FormData from 'form-data';
import fs from 'fs';

import { BASE_URL } from "./constants";
import { ChatCompletion, Model, FileContent, Message, ModelResource, KimiFile, DeletedFile, Tokens, KimiResponse, IKimiChat } from "./types";

export * from './constants'
export * from './types'

export class KimiChat implements IKimiChat {
  private apiKey: string;
  private baseUrl = BASE_URL;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async handleResponse<T>(res: Dispatcher.ResponseData): Promise<KimiResponse<T>>  {
    const resBody = await res.body.json() as unknown as { data?: any, error?: any }
    return {
      data: resBody.data || resBody,
      error: resBody.error
    }
  }

  public async getModels() {
    const res = await request(`${this.baseUrl}/models`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      }
    })
    
    return this.handleResponse<ModelResource[]>(res)
  }

  public async chatCompletions({
    messages,
    model = "moonshot-v1-8k",
    maxTokens = 1024,
    temperature = 0.3,
    topN = 1.0,
    n = 1,
    stream = false
  }: {
    messages: Message[]
    model?: Model
    maxTokens?: number
    temperature?: number
    topN?: number
    n?: number
    stream?: boolean
  }) {
    const res = await request(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        messages,
        model,
        max_tokens: maxTokens,
        temperature,
        top_p: topN,
        n,
        stream,
      })
    })

    return this.handleResponse<ChatCompletion>(res)
  }

  public async getFiles() {
    const res = await request(`${this.baseUrl}/files`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      }
    })
    return this.handleResponse<KimiFile[]>(res)
  }


  public async uploadFile(filePath: string, onProgress?: (progress: { loaded: number; total: number }) => void) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), {
      filename: filePath,
      knownLength: fs.statSync(filePath).size
    });

    if (onProgress) {
      formData.on('progress', onProgress);
    }

    const res = await request(`${this.baseUrl}/files`, {
      method: "POST",
      headers: {
        'Content-Type': formData.getHeaders()['content-type'],
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: formData
    })

    return this.handleResponse<KimiFile>(res)
  }

  public async getFile(id: string) {
    const res = await request(`${this.baseUrl}/files/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      }
    })
    return this.handleResponse<KimiFile>(res)
  }

  public async getFileContent(id: string) {
    const res = await request(`${this.baseUrl}/files/${id}/content`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      }
    })
    return this.handleResponse<FileContent>(res)
  }

  public async deleteFile(id: string) {
    const res = await request(`${this.baseUrl}/files/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      }
    })
    return this.handleResponse<DeletedFile>(res)
  }

  public async estimateTokens({
    messages,
    model = "moonshot-v1-8k",
  }: {
    messages: Message[]
    model?: Model
  }) {
    const res = await request(`${this.baseUrl}/tokenizers/estimate-token-count`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        messages,
        model,
      })
    })
    return this.handleResponse<Tokens[]>(res)
  }
}

