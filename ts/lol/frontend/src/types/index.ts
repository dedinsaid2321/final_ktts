export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ISignData {
  id: number;
  name: string;
  message: string;
}

export interface ICheckData {
  id: number;
  name: string;
  message: string;
}

export interface ICreateData {
  id: number;
  name: string;
  surname: string;
  message: string;
}

export interface IPetData {
  id: number;
  name: string;
  pets: string[];
  message: string;
}

export interface IColorsData {
  id: number;
  name: string;
  colors: string[];
  message: string;
}

export interface IUser {
  id: number;
  name: string;
  surname?: string;
  pets: string[];
  colors: string[];
}