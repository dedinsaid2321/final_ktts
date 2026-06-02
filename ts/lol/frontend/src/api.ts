import axios, { AxiosInstance, AxiosError } from 'axios';
import { IApiResponse, IUser } from './types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private handleError(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<IApiResponse>;
      if (axiosError.response?.data?.error) {
        return axiosError.response.data.error;
      }
      if (axiosError.response?.data?.message) {
        return axiosError.response.data.message;
      }
      return axiosError.message;
    }
    return 'Произошла неизвестная ошибка';
  }

  async sign(name: string): Promise<IApiResponse> {
    try {
      const response = await this.api.post<IApiResponse>('/sign', { name });
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async check(name: string): Promise<IApiResponse> {
    try {
      const response = await this.api.get<IApiResponse>('/check', {
        params: { name }
      });
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async create(name: string, surname: string): Promise<IApiResponse> {
    try {
      const response = await this.api.post<IApiResponse>('/create', { name, surname });
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async addPet(id: number, petName: string): Promise<IApiResponse> {
    try {
      const response = await this.api.post<IApiResponse>('/pet', { id, petName });
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async addColors(id: number, colors: string[]): Promise<IApiResponse> {
    try {
      const response = await this.api.post<IApiResponse>('/colors', { id, colors });
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      const response = await this.api.get<IApiResponse<IUser[]>>('/users');
      return response.data.data || [];
    } catch (error) {
      console.error('Ошибка при получении пользователей:', this.handleError(error));
      return [];
    }
  }
}

export default new ApiService();