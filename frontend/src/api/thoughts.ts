import apiClient, { Thought } from './client';

export interface CreateThoughtRequest {
  content: string;
}

export interface CreateThoughtResponse extends Thought {}

export interface GetThoughtsResponse {
  thoughts: Thought[];
  total: number;
}

export class ThoughtsApi {
  
  static async create(content: string): Promise<CreateThoughtResponse> {
    return await apiClient.createThought(content);
  }

  static async getAll(limit = 20, offset = 0): Promise<GetThoughtsResponse> {
    return await apiClient.getThoughts(limit, offset);
  }
}

export default ThoughtsApi;