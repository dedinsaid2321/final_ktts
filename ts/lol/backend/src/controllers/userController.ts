import { Request, Response } from 'express';
import { IUser, IApiResponse, ISignRequest, ICreateRequest, IPetRequest, IColorsRequest } from '../types';

class UserController {
  private users: IUser[] = [];
  private nextId: number = 1;

  public sign = (req: Request<{}, {}, ISignRequest>, res: Response): void => {
    try {
      const { name } = req.body;

      if (!name || typeof name !== 'string' || name.trim() === '') {
        const response: IApiResponse = {
          success: false,
          error: 'Имя обязательно и должно быть строкой'
        };
        res.status(400).json(response);
        return;
      }

      const trimmedName = name.trim();
      
      const existingUser = this.users.find(user => user.name === trimmedName);
      if (existingUser) {
        const response: IApiResponse<{ id: number; name: string }> = {
          success: false,
          error: `Имя "${trimmedName}" уже существует. Ваш порядковый номер: ${existingUser.id}`
        };
        res.status(400).json(response);
        return;
      }
    
      const newUser: IUser = {
        id: this.nextId++,
        name: trimmedName,
        surname: '', // Добавлена пустая строка
        pets: [],
        colors: []
      };
      
      this.users.push(newUser);
      
      const response: IApiResponse<{ id: number; name: string; message: string }> = {
        success: true,
        data: {
          id: newUser.id,
          name: newUser.name,
          message: `Добро пожаловать! Ваш порядковый номер: ${newUser.id}`
        }
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: IApiResponse = {
        success: false,
        error: 'Ошибка сервера при регистрации'
      };
      res.status(500).json(response);
    }
  };

  public check = (req: Request<{}, {}, {}, { name: string }>, res: Response): void => {
    try {
      const { name } = req.query;

      if (!name || typeof name !== 'string' || name.trim() === '') {
        const response: IApiResponse = {
          success: false,
          error: 'Имя обязательно и должно быть строкой'
        };
        res.status(400).json(response);
        return;
      }

      const trimmedName = name.trim();
      const user = this.users.find(u => u.name === trimmedName);

      if (user) {
        const response: IApiResponse<{ id: number; name: string; message: string }> = {
          success: true,
          data: {
            id: user.id,
            name: user.name,
            message: `Имя "${trimmedName}" найдено! Порядковый номер: ${user.id}`
          }
        };
        res.status(200).json(response);
      } else {
        const response: IApiResponse = {
          success: false,
          error: `Имя "${trimmedName}" не найдено в системе`
        };
        res.status(404).json(response);
      }
    } catch (error) {
      const response: IApiResponse = {
        success: false,
        error: 'Ошибка сервера при проверке'
      };
      res.status(500).json(response);
    }
  };

  public create = (req: Request<{}, {}, ICreateRequest>, res: Response): void => {
    try {
      const { name, surname } = req.body;

      if (!name || typeof name !== 'string' || name.trim() === '') {
        const response: IApiResponse = {
          success: false,
          error: 'Имя обязательно и должно быть строкой'
        };
        res.status(400).json(response);
        return;
      }

      if (!surname || typeof surname !== 'string' || surname.trim() === '') {
        const response: IApiResponse = {
          success: false,
          error: 'Фамилия обязательна и должна быть строкой'
        };
        res.status(400).json(response);
        return;
      }

      const trimmedName = name.trim();
      const trimmedSurname = surname.trim();
      
      const existingUser = this.users.find(u => u.name === trimmedName);

      if (existingUser) {
        existingUser.surname = trimmedSurname;
        
        const response: IApiResponse<{ id: number; name: string; surname: string; message: string }> = {
          success: true,
          data: {
            id: existingUser.id,
            name: existingUser.name,
            surname: existingUser.surname,
            message: `Фамилия "${trimmedSurname}" добавлена к пользователю "${trimmedName}"`
          }
        };
        res.status(200).json(response);
      } else {
        const newUser: IUser = {
          id: this.nextId++,
          name: trimmedName,
          surname: trimmedSurname,
          pets: [],
          colors: []
        };
        this.users.push(newUser);
        
        const response: IApiResponse<{ id: number; name: string; surname: string; message: string }> = {
          success: true,
          data: {
            id: newUser.id,
            name: newUser.name,
            surname: newUser.surname,
            message: `Создан новый пользователь: ${trimmedName} ${trimmedSurname} (ID: ${newUser.id})`
          }
        };
        res.status(200).json(response);
      }
    } catch (error) {
      const response: IApiResponse = {
        success: false,
        error: 'Ошибка сервера при создании/обновлении'
      };
      res.status(500).json(response);
    }
  };

  public addPet = (req: Request<{}, {}, IPetRequest>, res: Response): void => {
    try {
      const { id, petName } = req.body;

      if (!id || typeof id !== 'number') {
        const response: IApiResponse = {
          success: false,
          error: 'Порядковый номер (id) обязателен и должен быть числом'
        };
        res.status(400).json(response);
        return;
      }

      if (!petName || typeof petName !== 'string' || petName.trim() === '') {
        const response: IApiResponse = {
          success: false,
          error: 'Название животного обязательно и должно быть строкой'
        };
        res.status(400).json(response);
        return;
      }

      const user = this.users.find(u => u.id === id);

      if (!user) {
        const response: IApiResponse = {
          success: false,
          error: `Пользователь с ID ${id} не найден`
        };
        res.status(404).json(response);
        return;
      }

      const trimmedPetName = petName.trim();
      user.pets.push(trimmedPetName);

      const response: IApiResponse<{ id: number; name: string; pets: string[]; message: string }> = {
        success: true,
        data: {
          id: user.id,
          name: user.name,
          pets: user.pets,
          message: `Животное "${trimmedPetName}" добавлено пользователю ${user.name}. Все животные: ${user.pets.join(', ')}`
        }
      };
      res.status(200).json(response);
    } catch (error) {
      const response: IApiResponse = {
        success: false,
        error: 'Ошибка сервера при добавлении питомца'
      };
      res.status(500).json(response);
    }
  };

  public addColors = (req: Request<{}, {}, IColorsRequest>, res: Response): void => {
    try {
      const { id, colors } = req.body;

      if (!id || typeof id !== 'number') {
        const response: IApiResponse = {
          success: false,
          error: 'Порядковый номер (id) обязателен и должен быть числом'
        };
        res.status(400).json(response);
        return;
      }

      if (!colors || !Array.isArray(colors) || colors.length === 0) {
        const response: IApiResponse = {
          success: false,
          error: 'Цвета должны быть переданы в виде массива строк'
        };
        res.status(400).json(response);
        return;
      }

      const isValidColors = colors.every(color => typeof color === 'string' && color.trim() !== '');
      if (!isValidColors) {
        const response: IApiResponse = {
          success: false,
          error: 'Все цвета должны быть непустыми строками'
        };
        res.status(400).json(response);
        return;
      }

      const user = this.users.find(u => u.id === id);

      if (!user) {
        const response: IApiResponse = {
          success: false,
          error: `Пользователь с ID ${id} не найден`
        };
        res.status(404).json(response);
        return;
      }

      const trimmedColors = colors.map(color => color.trim());
      user.colors.push(...trimmedColors);

      const response: IApiResponse<{ id: number; name: string; colors: string[]; message: string }> = {
        success: true,
        data: {
          id: user.id,
          name: user.name,
          colors: user.colors,
          message: `Цвета [${trimmedColors.join(', ')}] добавлены пользователю ${user.name}. Все цвета: ${user.colors.join(', ')}`
        }
      };
      res.status(200).json(response);
    } catch (error) {
      const response: IApiResponse = {
        success: false,
        error: 'Ошибка сервера при добавлении цветов'
      };
      res.status(500).json(response);
    }
  };

  public getAllUsers = (req: Request, res: Response): void => {
    const response: IApiResponse<IUser[]> = {
      success: true,
      data: this.users
    };
    res.status(200).json(response);
  };
}

export default new UserController();