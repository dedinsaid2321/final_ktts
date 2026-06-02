export interface IUser {
  id: number;
  name: string;
  surname: string;
  pets: string[];
  colors: string[];
}

export interface ISignRequest {
  name: string;
}

export interface ICreateRequest {
  name: string;
  surname: string;
}

export interface IPetRequest {
  id: number;
  petName: string;
}

export interface IColorsRequest {
  id: number;
  colors: string[];
}

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}